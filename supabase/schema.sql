-- ============================================================================
-- ZAIRZA INDUCTION PLATFORM — SUPABASE POSTGRES SCHEMA
-- Designed for 24-hr Quiz Window, Concurrent OUTR Students & Live Proctoring
-- Primary Identifier: OUTR Roll Number (No synthetic Candidate ID)
-- Security Architecture: 
--   1. Public question bank completely purged of answers (zero DevTools sniffing)
--   2. Answer keys segregated into an isolated 'quiz_answer_keys' table
--   3. Detailed scorecard and Ideathon Problem Statements (PS) locked for 15 mins post-submission
--   4. Answer keys availability revoked permanently after official induction results are declared
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Candidates Registry
CREATE TABLE IF NOT EXISTS public.candidates (
    roll_number TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT NOT NULL,
    year TEXT NOT NULL,
    branch TEXT NOT NULL,
    gender TEXT,
    residential_type TEXT,
    preferred_wing TEXT NOT NULL, -- 'Software', 'Robotics & IoT', 'Design'
    technical_interests JSONB DEFAULT '[]'::jsonb,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Quiz Configuration
CREATE TABLE IF NOT EXISTS public.quiz_config (
    id TEXT PRIMARY KEY DEFAULT 'induction_2026',
    title TEXT NOT NULL DEFAULT 'Zairza Induction Assessment 2026',
    oa_start_epoch TIMESTAMPTZ NOT NULL DEFAULT '2026-09-29 22:00:00+05:30',
    oa_end_epoch TIMESTAMPTZ NOT NULL DEFAULT '2026-09-30 22:00:00+05:30',
    registration_cutoff TIMESTAMPTZ NOT NULL DEFAULT '2026-09-30 12:00:00+05:30',
    duration_minutes INT NOT NULL DEFAULT 30,
    total_questions INT NOT NULL DEFAULT 30,
    marks_per_question NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    negative_mark NUMERIC(4,2) NOT NULL DEFAULT 0.25,
    max_violations_allowed INT NOT NULL DEFAULT 3,
    is_live BOOLEAN NOT NULL DEFAULT true,
    results_announced_at TIMESTAMPTZ DEFAULT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Question Bank (Public / Sanitized — Zero Solution Keys)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id INT PRIMARY KEY,
    section TEXT NOT NULL, -- 'logical', 'tech', 'hr'
    section_title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of { id: "opt_x", text: "..." }
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. Isolated Solution Keys Table (Strict Security Layer)
-- Accessible only for server-side evaluation and post-15-minute review window
-- Availability permanently revoked once results are declared.
CREATE TABLE IF NOT EXISTS public.quiz_answer_keys (
    question_id INT PRIMARY KEY REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    correct_option_id TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    access_revoked_at TIMESTAMPTZ DEFAULT NULL
);

-- 6. Candidate Quiz Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number TEXT NOT NULL REFERENCES public.candidates(roll_number) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    evaluates_at TIMESTAMPTZ, -- Set to (submitted_at + INTERVAL '15 minutes')
    status TEXT NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'COMPLETED', 'AUTO_SUBMITTED', 'DISQUALIFIED'
    score NUMERIC(5,2),
    logical_score NUMERIC(5,2) DEFAULT 0,
    tech_score NUMERIC(5,2) DEFAULT 0,
    hr_score NUMERIC(5,2) DEFAULT 0,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    unanswered_count INT DEFAULT 0,
    violations_count INT DEFAULT 0,
    time_taken_seconds INT DEFAULT 0,
    submission_reason TEXT,
    client_ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. In-Progress & Final Candidate Answers
CREATE TABLE IF NOT EXISTS public.candidate_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES public.quiz_questions(id),
    selected_option_id TEXT,
    is_marked_for_review BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_attempt_question UNIQUE(attempt_id, question_id)
);

-- 8. Proctoring Telemetry Violations Log (Realtime Streamed to Admin)
CREATE TABLE IF NOT EXISTS public.proctoring_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    violation_type TEXT NOT NULL, -- 'TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'MOBILE_APP_SWITCH', 'FORBIDDEN_KEY'
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Audit & Administrative Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    admin_user TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Supabase Realtime on Telemetry Tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.proctoring_violations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_attempts;

-- Row Level Security (RLS)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proctoring_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answer_keys ENABLE ROW LEVEL SECURITY;

-- Candidates & Public Policies
CREATE POLICY "Allow public registration" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow candidates to view own record" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Allow public read sanitized questions" ON public.quiz_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Allow insert attempts" ON public.quiz_attempts FOR ALL USING (true);
CREATE POLICY "Allow upsert answers" ON public.candidate_answers FOR ALL USING (true);
CREATE POLICY "Allow record violations" ON public.proctoring_violations FOR ALL USING (true);

-- CRITICAL SECURITY POLICY: Block direct client SELECT on quiz_answer_keys
-- Anonymous and standard candidate roles cannot query answer keys directly under any circumstance.
REVOKE ALL ON public.quiz_answer_keys FROM anon, authenticated;

-- ============================================================================
-- SECURE STORED PROCEDURES (SECURITY DEFINER)
-- ============================================================================

-- Function 1: Submit & Evaluate Attempt Server-Side
-- Automatically calculates score against isolated answer keys and sets 15-minute lock
CREATE OR REPLACE FUNCTION public.submit_and_evaluate_attempt(p_attempt_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_attempt RECORD;
    v_correct INT := 0;
    v_incorrect INT := 0;
    v_unanswered INT := 0;
    v_logical_score NUMERIC(5,2) := 0;
    v_tech_score NUMERIC(5,2) := 0;
    v_hr_score NUMERIC(5,2) := 0;
    v_total_score NUMERIC(5,2) := 0;
    v_rec RECORD;
BEGIN
    SELECT * INTO v_attempt FROM public.quiz_attempts WHERE id = p_attempt_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Attempt not found');
    END IF;

    -- Evaluate each question
    FOR v_rec IN 
        SELECT q.id, q.section, ca.selected_option_id, ak.correct_option_id
        FROM public.quiz_questions q
        JOIN public.quiz_answer_keys ak ON ak.question_id = q.id
        LEFT JOIN public.candidate_answers ca ON ca.question_id = q.id AND ca.attempt_id = p_attempt_id
        WHERE q.is_active = true
    LOOP
        IF v_rec.selected_option_id IS NULL THEN
            v_unanswered := v_unanswered + 1;
        ELSIF v_rec.selected_option_id = v_rec.correct_option_id THEN
            v_correct := v_correct + 1;
            IF v_rec.section = 'logical' THEN v_logical_score := v_logical_score + 1.0;
            ELSIF v_rec.section = 'tech' THEN v_tech_score := v_tech_score + 1.0;
            ELSIF v_rec.section = 'hr' THEN v_hr_score := v_hr_score + 1.0;
            END IF;
        ELSE
            v_incorrect := v_incorrect + 1;
            -- -0.25 negative marking for logical & tech
            IF v_rec.section = 'logical' THEN v_logical_score := v_logical_score - 0.25;
            ELSIF v_rec.section = 'tech' THEN v_tech_score := v_tech_score - 0.25;
            END IF;
        END IF;
    END LOOP;

    v_total_score := GREATEST(0, v_logical_score + v_tech_score + v_hr_score);

    -- Update attempt with 15-minute lock
    UPDATE public.quiz_attempts
    SET submitted_at = NOW(),
        evaluates_at = NOW() + INTERVAL '15 minutes',
        status = 'COMPLETED',
        score = v_total_score,
        logical_score = v_logical_score,
        tech_score = v_tech_score,
        hr_score = v_hr_score,
        correct_count = v_correct,
        incorrect_count = v_incorrect,
        unanswered_count = v_unanswered
    WHERE id = p_attempt_id;

    RETURN jsonb_build_object(
        'success', true,
        'evaluates_at', NOW() + INTERVAL '15 minutes',
        'message', 'Submitted successfully. Evaluation metrics locked for 15 minutes.'
    );
END;
$$;

-- Function 2: Securely Retrieve Scorecard & Solutions
-- Only accessible after evaluates_at (15 mins post-submission) and revoked after results
CREATE OR REPLACE FUNCTION public.get_candidate_evaluation_breakdown(p_attempt_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_attempt RECORD;
    v_config RECORD;
    v_result JSONB;
BEGIN
    SELECT * INTO v_attempt FROM public.quiz_attempts WHERE id = p_attempt_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Attempt not found');
    END IF;

    SELECT * INTO v_config FROM public.quiz_config WHERE id = 'induction_2026';

    -- 1. Check if results announced (availability revoked)
    IF v_config.results_announced_at IS NOT NULL AND NOW() >= v_config.results_announced_at THEN
        RETURN jsonb_build_object(
            'success', false, 
            'revoked', true, 
            'error', 'Answer keys and detailed review availability has expired following final results announcement.'
        );
    END IF;

    -- 2. Check 15-minute lock
    IF v_attempt.evaluates_at IS NOT NULL AND NOW() < v_attempt.evaluates_at THEN
        RETURN jsonb_build_object(
            'success', false, 
            'locked', true, 
            'unlocks_at', v_attempt.evaluates_at,
            'remaining_seconds', EXTRACT(EPOCH FROM (v_attempt.evaluates_at - NOW())),
            'error', 'Evaluation is in 15-minute security review window to prevent test collusion.'
        );
    END IF;

    -- 3. Return verified scorecard & explanation breakdown
    SELECT jsonb_build_object(
        'success', true,
        'locked', false,
        'roll_number', v_attempt.roll_number,
        'score', v_attempt.score,
        'logical_score', v_attempt.logical_score,
        'tech_score', v_attempt.tech_score,
        'hr_score', v_attempt.hr_score,
        'correct_count', v_attempt.correct_count,
        'incorrect_count', v_attempt.incorrect_count,
        'unanswered_count', v_attempt.unanswered_count,
        'time_taken_seconds', v_attempt.time_taken_seconds,
        'breakdown', (
            SELECT jsonb_agg(jsonb_build_object(
                'question_id', q.id,
                'section', q.section,
                'prompt', q.prompt,
                'selected_option_id', ca.selected_option_id,
                'correct_option_id', ak.correct_option_id,
                'is_correct', (ca.selected_option_id = ak.correct_option_id),
                'explanation', ak.explanation
            ))
            FROM public.quiz_questions q
            JOIN public.quiz_answer_keys ak ON ak.question_id = q.id
            LEFT JOIN public.candidate_answers ca ON ca.question_id = q.id AND ca.attempt_id = p_attempt_id
            WHERE q.is_active = true
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- Function 3: Admin Procedure to Announce Results & Revoke Answer Keys Availability
CREATE OR REPLACE FUNCTION public.announce_results_and_revoke_answer_keys()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.quiz_config
    SET results_announced_at = NOW(),
        updated_at = NOW()
    WHERE id = 'induction_2026';

    UPDATE public.quiz_answer_keys
    SET access_revoked_at = NOW();

    INSERT INTO public.audit_logs (action, admin_user, details)
    VALUES ('RESULTS_ANNOUNCED', 'Super Admin', 'Final inductees list announced. Answer keys availability revoked.');

    RETURN jsonb_build_object('success', true, 'message', 'Induction results announced and answer keys revoked.');
END;
$$;

-- ============================================================================
-- SEED DATA: 260 CURATED POOL QUESTIONS & ANSWER KEYS
-- 100 Logical Reasoning | 120 Tech Knowledge | 40 Coffee Test (HR)
-- ============================================================================

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    1,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?',
    '[{"id":"opt_1","text":"225"},{"id":"opt_2","text":"256"},{"id":"opt_3","text":"289"},{"id":"opt_4","text":"361"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    2,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'What comes next in the alternating series: 3, 8, 6, 11, 9, 14, 12, ?',
    '[{"id":"opt_1","text":"15"},{"id":"opt_2","text":"17"},{"id":"opt_3","text":"19"},{"id":"opt_4","text":"16"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    3,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Identify the missing term: 2, 6, 12, 20, 30, 42, ?',
    '[{"id":"opt_1","text":"52"},{"id":"opt_2","text":"56"},{"id":"opt_3","text":"60"},{"id":"opt_4","text":"64"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    4,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Find the next term: 0, 7, 26, 63, 124, 215, ?',
    '[{"id":"opt_1","text":"342"},{"id":"opt_2","text":"343"},{"id":"opt_3","text":"344"},{"id":"opt_4","text":"511"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    5,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Complete the sequence: 1, 1, 2, 3, 5, 8, 13, 21, ?',
    '[{"id":"opt_1","text":"29"},{"id":"opt_2","text":"34"},{"id":"opt_3","text":"36"},{"id":"opt_4","text":"42"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    6,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Determine the next number: 5, 11, 23, 47, 95, ?',
    '[{"id":"opt_1","text":"181"},{"id":"opt_2","text":"190"},{"id":"opt_3","text":"191"},{"id":"opt_4","text":"195"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    7,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Find the missing number: 2, 3, 5, 7, 11, 13, 17, ?',
    '[{"id":"opt_1","text":"19"},{"id":"opt_2","text":"21"},{"id":"opt_3","text":"23"},{"id":"opt_4","text":"27"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    8,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'What is the next number: 100, 96, 88, 72, 40, ?',
    '[{"id":"opt_1","text":"-24"},{"id":"opt_2","text":"-16"},{"id":"opt_3","text":"0"},{"id":"opt_4","text":"8"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    9,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Identify the next term: 1, 4, 27, 256, ?',
    '[{"id":"opt_1","text":"1024"},{"id":"opt_2","text":"3125"},{"id":"opt_3","text":"4096"},{"id":"opt_4","text":"5120"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    10,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Find the missing term: 10, 14, 26, 62, 170, ?',
    '[{"id":"opt_1","text":"320"},{"id":"opt_2","text":"494"},{"id":"opt_3","text":"512"},{"id":"opt_4","text":"486"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    11,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'What comes next: 8, 12, 18, 27, 40.5, ?',
    '[{"id":"opt_1","text":"54"},{"id":"opt_2","text":"60.75"},{"id":"opt_3","text":"62.5"},{"id":"opt_4","text":"72"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    12,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Complete the sequence: 6, 13, 28, 59, 122, ?',
    '[{"id":"opt_1","text":"249"},{"id":"opt_2","text":"251"},{"id":"opt_3","text":"253"},{"id":"opt_4","text":"247"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    13,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Determine the next value: 1, 8, 9, 64, 25, 216, ?',
    '[{"id":"opt_1","text":"36"},{"id":"opt_2","text":"49"},{"id":"opt_3","text":"64"},{"id":"opt_4","text":"81"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    14,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'What is next: 2, 5, 10, 17, 26, 37, 50, ?',
    '[{"id":"opt_1","text":"63"},{"id":"opt_2","text":"65"},{"id":"opt_3","text":"67"},{"id":"opt_4","text":"71"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    15,
    'logical',
    'Part 1: Logical Reasoning (Number Series)',
    'Find the next number: 80, 40, 40, 60, 120, ?',
    '[{"id":"opt_1","text":"240"},{"id":"opt_2","text":"300"},{"id":"opt_3","text":"360"},{"id":"opt_4","text":"480"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    16,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'Find the next letter in the series: B, E, H, K, N, ?',
    '[{"id":"opt_1","text":"P"},{"id":"opt_2","text":"Q"},{"id":"opt_3","text":"R"},{"id":"opt_4","text":"S"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    17,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'What comes next: Z, W, S, N, ?',
    '[{"id":"opt_1","text":"H"},{"id":"opt_2","text":"I"},{"id":"opt_3","text":"J"},{"id":"opt_4","text":"G"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    18,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'Find the next group: AZ, BY, CX, DW, ?',
    '[{"id":"opt_1","text":"EV"},{"id":"opt_2","text":"EU"},{"id":"opt_3","text":"FV"},{"id":"opt_4","text":"FU"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    19,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'Identify the next term: A, C, F, J, O, ?',
    '[{"id":"opt_1","text":"T"},{"id":"opt_2","text":"U"},{"id":"opt_3","text":"V"},{"id":"opt_4","text":"S"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    20,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'Complete the sequence: JAK, KBL, LCM, MDN, ?',
    '[{"id":"opt_1","text":"OEP"},{"id":"opt_2","text":"NEO"},{"id":"opt_3","text":"MEN"},{"id":"opt_4","text":"PFQ"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    21,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'Find the next term: Z1A, X2B, V6C, T24D, ?',
    '[{"id":"opt_1","text":"R120E"},{"id":"opt_2","text":"S120E"},{"id":"opt_3","text":"R96E"},{"id":"opt_4","text":"Q120E"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    22,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'What comes next in the sequence: C, F, I, L, O, R, ?',
    '[{"id":"opt_1","text":"T"},{"id":"opt_2","text":"U"},{"id":"opt_3","text":"V"},{"id":"opt_4","text":"S"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    23,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'Identify the missing term: DF, GJ, KM, NQ, RT, ?',
    '[{"id":"opt_1","text":"UX"},{"id":"opt_2","text":"UW"},{"id":"opt_3","text":"VX"},{"id":"opt_4","text":"TX"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    24,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'What is the next term: YB, WD, UF, SH, ?',
    '[{"id":"opt_1","text":"QJ"},{"id":"opt_2","text":"PK"},{"id":"opt_3","text":"QI"},{"id":"opt_4","text":"RJ"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    25,
    'logical',
    'Part 1: Logical Reasoning (Letter Series)',
    'Complete the sequence: B2D, D4F, F6H, H8J, ?',
    '[{"id":"opt_1","text":"J10L"},{"id":"opt_2","text":"I10K"},{"id":"opt_3","text":"J12L"},{"id":"opt_4","text":"K10M"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    26,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'In a certain code, ''ZAIRZA'' is coded as ''ACKTBC''. By applying the same transformation pattern, how would ''INDUCT'' be encoded?',
    '[{"id":"opt_1","text":"KPFWEV"},{"id":"opt_2","text":"KQFXFW"},{"id":"opt_3","text":"JPEXEV"},{"id":"opt_4","text":"LPFYFV"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    27,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'If ''ROBOT'' is coded as ''TQBOT'', how is ''DRONE'' coded in the same system?',
    '[{"id":"opt_1","text":"FTQPG"},{"id":"opt_2","text":"FROPE"},{"id":"opt_3","text":"ESPOF"},{"id":"opt_4","text":"EQPQF"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    28,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'If ''SYSTEM'' is coded as ''SYSMET'' and ''NEARER'' is coded as ''AENRER'', then ''FRACTION'' is coded as:',
    '[{"id":"opt_1","text":"CARFNOIT"},{"id":"opt_2","text":"CARFTION"},{"id":"opt_3","text":"ARFCNOIT"},{"id":"opt_4","text":"CRAFNOIT"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    29,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'If ''CAT'' is coded as 24 and ''DOG'' is coded as 26, how is ''PIG'' coded?',
    '[{"id":"opt_1","text":"32"},{"id":"opt_2","text":"31"},{"id":"opt_3","text":"33"},{"id":"opt_4","text":"30"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    30,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'In a code language, if ''WATER'' is written as ''YCVGT'', how is ''FIRE'' written?',
    '[{"id":"opt_1","text":"HKTG"},{"id":"opt_2","text":"GJSF"},{"id":"opt_3","text":"HJTE"},{"id":"opt_4","text":"IKTF"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    31,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'If ''LIGHT'' is coded as ''KHFGS'', how is ''SOUND'' coded?',
    '[{"id":"opt_1","text":"TNVMEC"},{"id":"opt_2","text":"RNTMC"},{"id":"opt_3","text":"RPVMD"},{"id":"opt_4","text":"ROVME"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    32,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'If ''EARTH'' is coded as 5-1-18-20-8, how is ''VENUS'' coded?',
    '[{"id":"opt_1","text":"22-5-14-21-19"},{"id":"opt_2","text":"21-5-13-20-18"},{"id":"opt_3","text":"22-5-13-21-19"},{"id":"opt_4","text":"20-5-14-22-19"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    33,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'If ''CLOUD'' is written as ''ENQWF'', how is ''RAIN'' written?',
    '[{"id":"opt_1","text":"TCPK"},{"id":"opt_2","text":"TBNJ"},{"id":"opt_3","text":"UCRK"},{"id":"opt_4","text":"TBPL"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    34,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'If ''ORANGE'' is coded as ''QTCPIG'', what is the code for ''APPLE''?',
    '[{"id":"opt_1","text":"CRRNG"},{"id":"opt_2","text":"CQQNG"},{"id":"opt_3","text":"CRQNG"},{"id":"opt_4","text":"CPPNG"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    35,
    'logical',
    'Part 1: Logical Reasoning (Coding-Decoding)',
    'In a secret military code, ''123'' means ''hot filtered coffee'', ''356'' means ''very hot day'', and ''589'' means ''day and night''. What digit stands for ''very''?',
    '[{"id":"opt_1","text":"6"},{"id":"opt_2","text":"3"},{"id":"opt_3","text":"5"},{"id":"opt_4","text":"8"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    36,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'Pointing to a photograph of a boy, Suresh said, ''He is the son of the only son of my mother.'' How is Suresh related to that boy?',
    '[{"id":"opt_1","text":"Brother"},{"id":"opt_2","text":"Father"},{"id":"opt_3","text":"Uncle"},{"id":"opt_4","text":"Grandfather"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    37,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'A is B’s sister. C is B’s mother. D is C’s father. E is D’s mother. How is A related to D?',
    '[{"id":"opt_1","text":"Grandmother"},{"id":"opt_2","text":"Grandfather"},{"id":"opt_3","text":"Granddaughter"},{"id":"opt_4","text":"Daughter"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    38,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'Introducing a girl, Vipin said, ''Her mother is the only daughter of my mother-in-law.'' How is Vipin related to the girl?',
    '[{"id":"opt_1","text":"Uncle"},{"id":"opt_2","text":"Father"},{"id":"opt_3","text":"Brother"},{"id":"opt_4","text":"Husband"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    39,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'P is the brother of Q and R. S is R’s mother. T is P’s father. Which of the following statements cannot be definitely asserted?',
    '[{"id":"opt_1","text":"T is Q’s father"},{"id":"opt_2","text":"S is P’s mother"},{"id":"opt_3","text":"P is S’s son"},{"id":"opt_4","text":"Q is T’s son"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    40,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'Looking at a portrait, a man said, ''Brothers and sisters have I none, but that man''s father is my father''s son.'' Whose portrait was it?',
    '[{"id":"opt_1","text":"His son’s"},{"id":"opt_2","text":"His father’s"},{"id":"opt_3","text":"His own"},{"id":"opt_4","text":"His nephew’s"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    41,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'If P + Q means P is the husband of Q; P / Q means P is the sister of Q; and P * Q means P is the son of Q, which of the following shows that A is the daughter of B?',
    '[{"id":"opt_1","text":"A / C * B"},{"id":"opt_2","text":"B * C + A"},{"id":"opt_3","text":"A * C / B"},{"id":"opt_4","text":"B + C / A"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    42,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'Ananya says, ''The man standing by the podium is the father of my brother''s only sister''s son.'' Who is the man?',
    '[{"id":"opt_1","text":"Her husband"},{"id":"opt_2","text":"Her father"},{"id":"opt_3","text":"Her brother"},{"id":"opt_4","text":"Her uncle"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    43,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'M is the sister of K. D is the brother of K. F is the mother of M. How is K related to F?',
    '[{"id":"opt_1","text":"Son"},{"id":"opt_2","text":"Daughter"},{"id":"opt_3","text":"Son or Daughter"},{"id":"opt_4","text":"Data inadequate"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    44,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'A woman introduces a man as the son of the brother of her mother. How is the man related to the woman?',
    '[{"id":"opt_1","text":"Nephew"},{"id":"opt_2","text":"Son"},{"id":"opt_3","text":"Cousin"},{"id":"opt_4","text":"Uncle"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    45,
    'logical',
    'Part 1: Logical Reasoning (Blood Relations)',
    'R is the daughter of Q. M is the sister of B who is the son of Q. How is R related to M?',
    '[{"id":"opt_1","text":"Cousin"},{"id":"opt_2","text":"Sister"},{"id":"opt_3","text":"Mother"},{"id":"opt_4","text":"Aunt"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    46,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'A robotic rover moves 12m North, turns East and moves 5m, then climbs a vertical antenna pole 13m high. What is its total straight-line distance from the starting origin point?',
    '[{"id":"opt_1","text":"13m"},{"id":"opt_2","text":"18.38m"},{"id":"opt_3","text":"25m"},{"id":"opt_4","text":"30m"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    47,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'A student walks 20m North, turns right and walks 30m, turns right again and walks 35m, then turns left and walks 15m. In which direction is the student now relative to the starting point?',
    '[{"id":"opt_1","text":"North-East"},{"id":"opt_2","text":"South-East"},{"id":"opt_3","text":"South-West"},{"id":"opt_4","text":"North-West"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    48,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'At sunrise, Amit is standing facing a telephone pole. The shadow of the pole falls exactly to his right. Which direction is Amit facing?',
    '[{"id":"opt_1","text":"East"},{"id":"opt_2","text":"West"},{"id":"opt_3","text":"North"},{"id":"opt_4","text":"South"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    49,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'A delivery drone flies 10 km South, turns left and flies 20 km, turns left again and flies 10 km. How far and in what direction is it from the launch depot?',
    '[{"id":"opt_1","text":"20 km West"},{"id":"opt_2","text":"20 km East"},{"id":"opt_3","text":"10 km North"},{"id":"opt_4","text":"30 km East"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    50,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'If South-East becomes North, North-East becomes West, and so on, what will West become?',
    '[{"id":"opt_1","text":"North-East"},{"id":"opt_2","text":"South-East"},{"id":"opt_3","text":"North-West"},{"id":"opt_4","text":"South-West"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    51,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'Kunal walks 10 km towards North. From there he walks 6 km towards South. Then, he walks 3 km towards East. How far and in which direction is he with reference to his starting point?',
    '[{"id":"opt_1","text":"5 km West"},{"id":"opt_2","text":"5 km North-East"},{"id":"opt_3","text":"7 km East"},{"id":"opt_4","text":"5 km South-East"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    52,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'One evening before sunset, two friends Sumit and Mohit were talking to each other face to face. If Mohit’s shadow was exactly to his right, which direction was Sumit facing?',
    '[{"id":"opt_1","text":"North"},{"id":"opt_2","text":"South"},{"id":"opt_3","text":"East"},{"id":"opt_4","text":"West"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    53,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'Starting from point X, Jayant walked 15m West. He turned left and walked 20m. He then turned left and walked 15m. After this he turned to his right and walked 12m. How far is he now from point X?',
    '[{"id":"opt_1","text":"32m"},{"id":"opt_2","text":"47m"},{"id":"opt_3","text":"20m"},{"id":"opt_4","text":"27m"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    54,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'A car travels 8 km East, turns right and travels 6 km. What is the shortest displacement to its starting point?',
    '[{"id":"opt_1","text":"14 km"},{"id":"opt_2","text":"10 km"},{"id":"opt_3","text":"12 km"},{"id":"opt_4","text":"2 km"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    55,
    'logical',
    'Part 1: Logical Reasoning (Direction Sense)',
    'Rahul puts his timepiece on the table in such a way that at 6 P.M. the hour hand points to North. In which direction will the minute hand point at 9.15 P.M.?',
    '[{"id":"opt_1","text":"South-East"},{"id":"opt_2","text":"West"},{"id":"opt_3","text":"North"},{"id":"opt_4","text":"South"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    56,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'What is the acute angle between the hour hand and the minute hand of a clock at 3:15?',
    '[{"id":"opt_1","text":"0 degrees"},{"id":"opt_2","text":"7.5 degrees"},{"id":"opt_3","text":"15 degrees"},{"id":"opt_4","text":"22.5 degrees"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    57,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'What is the angle between the hands of a clock at 8:20?',
    '[{"id":"opt_1","text":"120 degrees"},{"id":"opt_2","text":"130 degrees"},{"id":"opt_3","text":"140 degrees"},{"id":"opt_4","text":"110 degrees"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    58,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'How many times do the hands of a clock coincide (overlap) in a standard 24-hour day?',
    '[{"id":"opt_1","text":"24"},{"id":"opt_2","text":"22"},{"id":"opt_3","text":"20"},{"id":"opt_4","text":"44"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    59,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'If January 1, 2024 was a Monday, what day of the week was January 1, 2025?',
    '[{"id":"opt_1","text":"Tuesday"},{"id":"opt_2","text":"Wednesday"},{"id":"opt_3","text":"Thursday"},{"id":"opt_4","text":"Friday"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    60,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'A clock gains 5 seconds every 3 minutes. If it is set correctly at 7:00 AM, what time will it display at 1:00 PM on the same day?',
    '[{"id":"opt_1","text":"1:10 PM"},{"id":"opt_2","text":"1:12 PM"},{"id":"opt_3","text":"1:15 PM"},{"id":"opt_4","text":"1:20 PM"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    61,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'Today is Friday. What day of the week will it be after 61 days?',
    '[{"id":"opt_1","text":"Tuesday"},{"id":"opt_2","text":"Wednesday"},{"id":"opt_3","text":"Thursday"},{"id":"opt_4","text":"Sunday"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    62,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'At what time between 4 o’clock and 5 o’clock will the hands of a clock be together?',
    '[{"id":"opt_1","text":"4:21 9/11 min"},{"id":"opt_2","text":"4:20 min"},{"id":"opt_3","text":"4:22 min"},{"id":"opt_4","text":"4:21 5/11 min"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    63,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'Which of the following years is NOT a leap year?',
    '[{"id":"opt_1","text":"2000"},{"id":"opt_2","text":"2400"},{"id":"opt_3","text":"1900"},{"id":"opt_4","text":"2016"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    64,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'How many times in a day are the hands of a clock at right angles (90 degrees) to each other?',
    '[{"id":"opt_1","text":"22"},{"id":"opt_2","text":"24"},{"id":"opt_3","text":"44"},{"id":"opt_4","text":"48"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    65,
    'logical',
    'Part 1: Logical Reasoning (Clocks & Calendars)',
    'The calendar for the year 2007 will be identical to which year?',
    '[{"id":"opt_1","text":"2014"},{"id":"opt_2","text":"2016"},{"id":"opt_3","text":"2017"},{"id":"opt_4","text":"2018"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    66,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) All algorithms are logic. (2) No logic is emotional. Conclusions: (I) No algorithm is emotional. (II) Some logic are algorithms.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Neither follows"},{"id":"opt_4","text":"Both I and II follow"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    67,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) Some sensors are cameras. (2) Some cameras are radars. Conclusions: (I) Some sensors are radars. (II) No sensor is a radar.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Either I or II follows"},{"id":"opt_4","text":"Neither follows"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    68,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) All laptops are computers. (2) All computers are electronic. Conclusions: (I) All laptops are electronic. (II) All electronic devices are laptops.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Both follow"},{"id":"opt_4","text":"Neither follows"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    69,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) No cat is a dog. (2) No dog is a horse. Conclusions: (I) No cat is a horse. (II) Some horses are cats.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Neither follows"},{"id":"opt_4","text":"Both follow"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    70,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) All robots are machines. (2) Some machines are fast. Conclusions: (I) Some robots are fast. (II) Some fast items are machines.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Both follow"},{"id":"opt_4","text":"Neither follows"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    71,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'In a college batch of 100 students, 60 know Python, 50 know C++, and 30 know both. How many students know neither language?',
    '[{"id":"opt_1","text":"10"},{"id":"opt_2","text":"20"},{"id":"opt_3","text":"30"},{"id":"opt_4","text":"40"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    72,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) Some pens are books. (2) All books are papers. Conclusions: (I) Some pens are papers. (II) All papers are books.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Both follow"},{"id":"opt_4","text":"Neither follows"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    73,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) All flowers are trees. (2) No tree is a fruit. Conclusions: (I) No fruit is a flower. (II) Some trees are flowers.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Both I and II follow"},{"id":"opt_4","text":"Neither follows"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    74,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'In a group of 50 club members, 35 play badminton, 20 play chess, and everyone plays at least one game. How many play both games?',
    '[{"id":"opt_1","text":"5"},{"id":"opt_2","text":"10"},{"id":"opt_3","text":"15"},{"id":"opt_4","text":"20"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    75,
    'logical',
    'Part 1: Logical Reasoning (Syllogism)',
    'Statements: (1) Most engineers are thinkers. (2) Thinkers are creators. Conclusions: (I) Some engineers are creators. (II) All creators are engineers.',
    '[{"id":"opt_1","text":"Only I follows"},{"id":"opt_2","text":"Only II follows"},{"id":"opt_3","text":"Both follow"},{"id":"opt_4","text":"Neither follows"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    76,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'In a class of 45 students, Aditya’s rank is 16th from the top. What is his rank from the bottom?',
    '[{"id":"opt_1","text":"29th"},{"id":"opt_2","text":"30th"},{"id":"opt_3","text":"31st"},{"id":"opt_4","text":"28th"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    77,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'Six friends A, B, C, D, E, F are sitting in a circle facing the center. A is between B and F. D is opposite B. E is to the immediate left of D. Who is to the immediate left of C?',
    '[{"id":"opt_1","text":"A"},{"id":"opt_2","text":"B"},{"id":"opt_3","text":"D"},{"id":"opt_4","text":"F"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    78,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'In a row of boys, Deepak is 7th from the left and Madhu is 12th from the right. If they interchange positions, Deepak becomes 22nd from the left. What is the total number of boys in the row?',
    '[{"id":"opt_1","text":"31"},{"id":"opt_2","text":"33"},{"id":"opt_3","text":"34"},{"id":"opt_4","text":"35"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    79,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'Five colleagues P, Q, R, S, T sit in a line facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the exact middle?',
    '[{"id":"opt_1","text":"P"},{"id":"opt_2","text":"Q"},{"id":"opt_3","text":"S"},{"id":"opt_4","text":"T"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    80,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'A is taller than B but shorter than C. D is taller than E but shorter than B. Who is the tallest among them all?',
    '[{"id":"opt_1","text":"A"},{"id":"opt_2","text":"B"},{"id":"opt_3","text":"C"},{"id":"opt_4","text":"D"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    81,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'In a queue, Priya is 11th from the front and Rakesh is 20th from the back. If there are 5 people between them, what is the minimum possible number of people in the queue?',
    '[{"id":"opt_1","text":"24"},{"id":"opt_2","text":"26"},{"id":"opt_3","text":"36"},{"id":"opt_4","text":"34"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    82,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'Eight people sit around a circular table facing inward. P is third to the right of M and second to the left of S. Who sits directly opposite M if the table is evenly spaced?',
    '[{"id":"opt_1","text":"T"},{"id":"opt_2","text":"S"},{"id":"opt_3","text":"P"},{"id":"opt_4","text":"R"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    83,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'In a row of trees, a mango tree is 7th from either end of the row. How many trees are in the row?',
    '[{"id":"opt_1","text":"11"},{"id":"opt_2","text":"13"},{"id":"opt_3","text":"14"},{"id":"opt_4","text":"15"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    84,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'Four students W, X, Y, Z took an exam. W scored more than X. Y scored less than Z. Z scored less than X. Who scored the lowest?',
    '[{"id":"opt_1","text":"W"},{"id":"opt_2","text":"X"},{"id":"opt_3","text":"Y"},{"id":"opt_4","text":"Z"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    85,
    'logical',
    'Part 1: Logical Reasoning (Seating & Ranking)',
    'Seven runners finish a race. A finishes ahead of B but behind C. D finishes ahead of E but behind B. F finishes ahead of C. Who won the race?',
    '[{"id":"opt_1","text":"A"},{"id":"opt_2","text":"C"},{"id":"opt_3","text":"F"},{"id":"opt_4","text":"D"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    86,
    'logical',
    'Part 1: Logical Reasoning (Analogy)',
    'Binary : 10001 :: Decimal : ?',
    '[{"id":"opt_1","text":"15"},{"id":"opt_2","text":"17"},{"id":"opt_3","text":"19"},{"id":"opt_4","text":"33"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    87,
    'logical',
    'Part 1: Logical Reasoning (Odd-One-Out)',
    'Find the odd one out from the given engineering software tools:',
    '[{"id":"opt_1","text":"Compiler"},{"id":"opt_2","text":"Interpreter"},{"id":"opt_3","text":"Assembler"},{"id":"opt_4","text":"Microcontroller"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    88,
    'logical',
    'Part 1: Logical Reasoning (Analogy)',
    'Thermometer : Temperature :: Barometer : ?',
    '[{"id":"opt_1","text":"Pressure"},{"id":"opt_2","text":"Humidity"},{"id":"opt_3","text":"Velocity"},{"id":"opt_4","text":"Current"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    89,
    'logical',
    'Part 1: Logical Reasoning (Odd-One-Out)',
    'Identify the odd one out: 27, 64, 125, 144, 216',
    '[{"id":"opt_1","text":"27"},{"id":"opt_2","text":"64"},{"id":"opt_3","text":"144"},{"id":"opt_4","text":"216"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    90,
    'logical',
    'Part 1: Logical Reasoning (Analogy)',
    'Clock : Time :: Odograph : ?',
    '[{"id":"opt_1","text":"Speed"},{"id":"opt_2","text":"Distance"},{"id":"opt_3","text":"Acceleration"},{"id":"opt_4","text":"Force"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    91,
    'logical',
    'Part 1: Logical Reasoning (Odd-One-Out)',
    'Which of the following does NOT belong with the others?',
    '[{"id":"opt_1","text":"Copper"},{"id":"opt_2","text":"Silver"},{"id":"opt_3","text":"Aluminum"},{"id":"opt_4","text":"Silicon"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    92,
    'logical',
    'Part 1: Logical Reasoning (Analogy)',
    'Byte : 8 Bits :: Nibble : ?',
    '[{"id":"opt_1","text":"2 Bits"},{"id":"opt_2","text":"4 Bits"},{"id":"opt_3","text":"16 Bits"},{"id":"opt_4","text":"32 Bits"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    93,
    'logical',
    'Part 1: Logical Reasoning (Odd-One-Out)',
    'Find the odd term: Linux, macOS, Windows, Oracle',
    '[{"id":"opt_1","text":"Linux"},{"id":"opt_2","text":"macOS"},{"id":"opt_3","text":"Windows"},{"id":"opt_4","text":"Oracle"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    94,
    'logical',
    'Part 1: Logical Reasoning (Brain Teasers)',
    'If 5 robots assemble 5 circuit boards in 5 minutes, how many minutes will it take 100 robots to assemble 100 circuit boards?',
    '[{"id":"opt_1","text":"100 minutes"},{"id":"opt_2","text":"5 minutes"},{"id":"opt_3","text":"20 minutes"},{"id":"opt_4","text":"50 minutes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    95,
    'logical',
    'Part 1: Logical Reasoning (Brain Teasers)',
    'You have 8 identical-looking metal ball bearings. One is slightly heavier due to a casting flaw. What is the minimum number of balance scale weighings needed to guarantee finding the heavy ball?',
    '[{"id":"opt_1","text":"1"},{"id":"opt_2","text":"2"},{"id":"opt_3","text":"3"},{"id":"opt_4","text":"4"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    96,
    'logical',
    'Part 1: Logical Reasoning (Brain Teasers)',
    'You have a 4-minute hourglass and a 7-minute hourglass. What is the minimum total elapsed time to measure exactly 9 minutes for chemical curing?',
    '[{"id":"opt_1","text":"9 minutes"},{"id":"opt_2","text":"11 minutes"},{"id":"opt_3","text":"12 minutes"},{"id":"opt_4","text":"14 minutes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    97,
    'logical',
    'Part 1: Logical Reasoning (Brain Teasers)',
    'A bat and a ball together cost Rs. 110. The bat costs Rs. 100 more than the ball. How much does the ball cost?',
    '[{"id":"opt_1","text":"Rs. 10"},{"id":"opt_2","text":"Rs. 5"},{"id":"opt_3","text":"Rs. 15"},{"id":"opt_4","text":"Rs. 1"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    98,
    'logical',
    'Part 1: Logical Reasoning (Brain Teasers)',
    'A snail is at the bottom of a 30-meter well. Each day it climbs up 3 meters, but each night it slides down 2 meters. On which day will the snail reach the top of the well?',
    '[{"id":"opt_1","text":"30th day"},{"id":"opt_2","text":"28th day"},{"id":"opt_3","text":"29th day"},{"id":"opt_4","text":"27th day"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    99,
    'logical',
    'Part 1: Logical Reasoning (Brain Teasers)',
    'There are 3 switches outside a closed room controlling 3 light bulbs inside. You can flip switches as you wish, but can enter the room only once. How do you determine which switch controls which bulb?',
    '[{"id":"opt_1","text":"Turn on switch 1 for 10 min, turn it off, turn on switch 2, and enter: the lit bulb is 2, the warm bulb is 1, the cold unlit bulb is 3"},{"id":"opt_2","text":"Flip all switches randomly"},{"id":"opt_3","text":"Look under the door gap"},{"id":"opt_4","text":"It is physically impossible with 1 trip"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    100,
    'logical',
    'Part 1: Logical Reasoning (Brain Teasers)',
    'Two ropes each take exactly 60 minutes to burn from one end to the other, but they burn inconsistently. How can you measure exactly 45 minutes using only these two ropes and a lighter?',
    '[{"id":"opt_1","text":"Light rope 1 at both ends and rope 2 at one end simultaneously; when rope 1 burns out (30 min), light the other end of rope 2 (15 min remaining)"},{"id":"opt_2","text":"Cut both ropes in half with scissors"},{"id":"opt_3","text":"Burn rope 1 completely then burn 3/4 of rope 2"},{"id":"opt_4","text":"Light all 4 ends at once"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    101,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Who is universally celebrated as the world’s first computer programmer for writing an algorithm to compute Bernoulli numbers on Charles Babbage’s Analytical Engine in 1843?',
    '[{"id":"opt_1","text":"Ada Lovelace"},{"id":"opt_2","text":"Grace Hopper"},{"id":"opt_3","text":"Alan Turing"},{"id":"opt_4","text":"Margaret Hamilton"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    102,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'In 1947, computer pioneer Grace Hopper recorded the first actual case of a computer "bug". What was physically taped into the Harvard Mark II relay logbook?',
    '[{"id":"opt_1","text":"A real moth trapped in relay #70"},{"id":"opt_2","text":"A short-circuited copper wire"},{"id":"opt_3","text":"A burned vacuum tube"},{"id":"opt_4","text":"A spider web on the paper tape reader"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    103,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Why is the world’s technology hub in Northern California known as "Silicon Valley"?',
    '[{"id":"opt_1","text":"Because silicon is the core chemical element used to manufacture semiconductor microchips and transistors"},{"id":"opt_2","text":"Because the beaches are filled with quartz silicon sand"},{"id":"opt_3","text":"Because the first computer case was made from silicone polymer"},{"id":"opt_4","text":"Because of a famous local Silicon gold mine"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    104,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What was Google’s original research project name when founders Larry Page and Sergey Brin began developing it at Stanford University in 1996?',
    '[{"id":"opt_1","text":"BackRub (named for analyzing web backlinks)"},{"id":"opt_2","text":"WebCrawler"},{"id":"opt_3","text":"PageFinder"},{"id":"opt_4","text":"StanfordSearch"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    105,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What was the revolutionary network created in 1969 by the US Department of Defense that transmitted the first message ("LO") and formed the basis for today’s Internet?',
    '[{"id":"opt_1","text":"ARPANET"},{"id":"opt_2","text":"Ethernet"},{"id":"opt_3","text":"Usenet"},{"id":"opt_4","text":"BITNET"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    106,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Guido van Rossum released the Python programming language in 1991. What was the name "Python" actually inspired by?',
    '[{"id":"opt_1","text":"The British comedy sketch show \"Monty Python’s Flying Circus\""},{"id":"opt_2","text":"A pet rock python snake in his garden"},{"id":"opt_3","text":"An acronym for Portable Yield Threading Oriented Network"},{"id":"opt_4","text":"The ancient Greek Oracle of Delphi python"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    107,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Who invented the World Wide Web (WWW) in 1989 while working at CERN to help scientists share research data across networked computers?',
    '[{"id":"opt_1","text":"Tim Berners-Lee"},{"id":"opt_2","text":"Marc Andreessen"},{"id":"opt_3","text":"Vint Cerf"},{"id":"opt_4","text":"Steve Jobs"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    108,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'In 1991, Finnish university student Linus Torvalds announced a free open-source Unix-like operating system kernel. What did it become?',
    '[{"id":"opt_1","text":"Linux"},{"id":"opt_2","text":"Ubuntu"},{"id":"opt_3","text":"FreeBSD"},{"id":"opt_4","text":"Android OS"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    109,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Who introduced the "@" symbol into electronic mail addresses in 1971 to separate the user name from the machine name?',
    '[{"id":"opt_1","text":"Ray Tomlinson"},{"id":"opt_2","text":"Bob Kahn"},{"id":"opt_3","text":"Douglas Engelbart"},{"id":"opt_4","text":"Dennis Ritchie"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    110,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What legendary input device did Douglas Engelbart invent and demonstrate in 1968 during the "Mother of All Demos"?',
    '[{"id":"opt_1","text":"The computer mouse (carved from wood with two wheels)"},{"id":"opt_2","text":"The mechanical keyboard"},{"id":"opt_3","text":"The capacitive touchscreen"},{"id":"opt_4","text":"The laser barcode scanner"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    111,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Which company created the famous 1984 Macintosh commercial introducing the first mass-market personal computer with a graphical user interface (GUI) and mouse?',
    '[{"id":"opt_1","text":"Apple"},{"id":"opt_2","text":"IBM"},{"id":"opt_3","text":"Commodore"},{"id":"opt_4","text":"Atari"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    112,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What was the first commercial electronic spreadsheet application that made the Apple II a vital business tool in 1979?',
    '[{"id":"opt_1","text":"VisiCalc"},{"id":"opt_2","text":"Lotus 1-2-3"},{"id":"opt_3","text":"Microsoft Excel"},{"id":"opt_4","text":"Quattro Pro"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    113,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'In what year was the first iPhone unveiled by Steve Jobs, revolutionizing capacitive multi-touch smartphones?',
    '[{"id":"opt_1","text":"2007"},{"id":"opt_2","text":"2005"},{"id":"opt_3","text":"2008"},{"id":"opt_4","text":"2010"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    114,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Which pioneering computer scientist led the Bletchley Park team that cracked the German Enigma cipher during World War II and conceptualized modern computing theory?',
    '[{"id":"opt_1","text":"Alan Turing"},{"id":"opt_2","text":"John von Neumann"},{"id":"opt_3","text":"Claude Shannon"},{"id":"opt_4","text":"Norbert Wiener"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    115,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What was the name of the first programmable general-purpose electronic digital computer built in the US during WWII at the University of Pennsylvania?',
    '[{"id":"opt_1","text":"ENIAC"},{"id":"opt_2","text":"UNIVAC I"},{"id":"opt_3","text":"EDVAC"},{"id":"opt_4","text":"Colossus"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    116,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What seminal solid-state device was invented at Bell Labs in December 1947 by Bardeen, Brattain, and Shockley, replacing fragile vacuum tubes?',
    '[{"id":"opt_1","text":"The Transistor"},{"id":"opt_2","text":"The Capacitor"},{"id":"opt_3","text":"The Integrated Circuit"},{"id":"opt_4","text":"The Solar Cell"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    117,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What was the capacity of the world’s first commercial hard disk drive, the IBM 350 RAMAC released in 1956?',
    '[{"id":"opt_1","text":"About 5 Megabytes (stored across fifty 24-inch magnetic platters)"},{"id":"opt_2","text":"1 Gigabyte"},{"id":"opt_3","text":"500 Kilobytes"},{"id":"opt_4","text":"128 Megabytes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    118,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'What famous open-source license allows developers to freely use, modify, distribute, and sell software without releasing their own proprietary code?',
    '[{"id":"opt_1","text":"MIT License"},{"id":"opt_2","text":"GPLv3"},{"id":"opt_3","text":"Creative Commons BY-NC"},{"id":"opt_4","text":"Proprietary EULA"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    119,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Which legendary laboratory in Palo Alto, California developed the computer mouse, graphical desktop icons, Ethernet, and laser printing in the 1970s?',
    '[{"id":"opt_1","text":"Xerox PARC"},{"id":"opt_2","text":"Bell Labs"},{"id":"opt_3","text":"MIT Media Lab"},{"id":"opt_4","text":"IBM Research"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    120,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'In 1997, which IBM supercomputer made history by becoming the first computer to defeat reigning World Chess Champion Garry Kasparov in a classical match?',
    '[{"id":"opt_1","text":"Deep Blue"},{"id":"opt_2","text":"Watson"},{"id":"opt_3","text":"DeepMind AlphaZero"},{"id":"opt_4","text":"Big Blue"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    121,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'Why does a computer lose all data stored in RAM when powered off, but retains files on an SSD or Hard Drive?',
    '[{"id":"opt_1","text":"RAM is volatile memory requiring continuous electrical power to maintain bit states; SSDs use non-volatile flash traps"},{"id":"opt_2","text":"RAM is magnetic while SSD is optical"},{"id":"opt_3","text":"RAM automatically deletes files to save battery"},{"id":"opt_4","text":"RAM only runs during internet connection"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    122,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What is the primary architectural difference between a CPU and a GPU?',
    '[{"id":"opt_1","text":"A CPU has fewer cores optimized for sequential single-thread tasks; a GPU has thousands of smaller cores for massive parallel math"},{"id":"opt_2","text":"A CPU only handles graphics while a GPU runs the OS"},{"id":"opt_3","text":"A CPU is analog and a GPU is digital"},{"id":"opt_4","text":"A GPU does not contain transistors"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    123,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What is the purpose of the thermal paste applied between a processor chip and its cooling heatsink?',
    '[{"id":"opt_1","text":"To fill microscopic air gaps between the metal surfaces so heat transfers efficiently"},{"id":"opt_2","text":"To glue the CPU permanently to the motherboard"},{"id":"opt_3","text":"To conduct electricity into the cooling fan"},{"id":"opt_4","text":"To prevent the CPU from freezing in winter"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    124,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What does the BIOS/UEFI chip on a computer motherboard do when you first press the power button?',
    '[{"id":"opt_1","text":"Performs a Power-On Self Test (POST) and loads the operating system bootloader into memory"},{"id":"opt_2","text":"Checks your email and updates graphics drivers"},{"id":"opt_3","text":"Formats the hard disk drive"},{"id":"opt_4","text":"Controls the monitor resolution exclusively"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    125,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'Why do modern Solid State Drives (SSDs) load games and boot Windows 10x faster than mechanical Hard Disk Drives (HDDs)?',
    '[{"id":"opt_1","text":"SSDs have zero moving mechanical parts and read flash chips instantaneously without seek latency"},{"id":"opt_2","text":"SSDs compress all files by 90%"},{"id":"opt_3","text":"SSDs connect directly to the power supply without cables"},{"id":"opt_4","text":"SSDs bypass the computer CPU entirely"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    126,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What is Cache Memory (L1, L2, L3) inside a modern microprocessor?',
    '[{"id":"opt_1","text":"Small, extremely fast static RAM located right on the CPU silicon die to keep frequently used instructions"},{"id":"opt_2","text":"A cloud backup folder for photos"},{"id":"opt_3","text":"The hidden cache partition on your USB flash drive"},{"id":"opt_4","text":"Virtual memory swapped onto the hard drive"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    127,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What does the clock speed of a processor (e.g., 3.8 GHz) measure?',
    '[{"id":"opt_1","text":"The number of clock cycles (billions per second) the CPU internal clock oscillates to synchronize operations"},{"id":"opt_2","text":"The speed of the cooling fan inside the cabinet"},{"id":"opt_3","text":"How fast data travels across your home Wi-Fi"},{"id":"opt_4","text":"The battery charging rate"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    128,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'Tech Trivia: If a single binary digit (0 or 1) is called a "bit", what is a group of 8 bits called?',
    '[{"id":"opt_1","text":"A Byte"},{"id":"opt_2","text":"A Nibble"},{"id":"opt_3","text":"A Word"},{"id":"opt_4","text":"A Pixel"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    129,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'Why are liquid cooling loops (AIOs) used in high-performance workstations and gaming desktops instead of small aluminum heatsinks?',
    '[{"id":"opt_1","text":"Water has a much higher specific heat capacity than air, absorbing and dissipating high thermal wattage away from the CPU"},{"id":"opt_2","text":"Water speeds up the flow of electrons through copper pins"},{"id":"opt_3","text":"Water prevents dust from accumulating inside the PC"},{"id":"opt_4","text":"Water reduces electrical resistance to zero"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    130,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What is Overclocking in computer hardware?',
    '[{"id":"opt_1","text":"Manually configuring a CPU or GPU to run at higher clock multiplier frequencies and voltages than factory specs"},{"id":"opt_2","text":"Running two monitors at the same time"},{"id":"opt_3","text":"Keeping the PC turned on for over 24 hours"},{"id":"opt_4","text":"Replacing Windows with Linux"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    131,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What does HDMI stand for on video display cables and TV monitors?',
    '[{"id":"opt_1","text":"High-Definition Multimedia Interface"},{"id":"opt_2","text":"Heavy-Duty Motherboard Interconnect"},{"id":"opt_3","text":"High-Density Memory Integrator"},{"id":"opt_4","text":"Hyper-Digital Motion Input"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    132,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What does DisplayPort offer over older VGA and DVI computer monitor connectors?',
    '[{"id":"opt_1","text":"High refresh rates (144Hz-360Hz+), packetized digital transmission, and multi-stream daisy chaining"},{"id":"opt_2","text":"Analog radio wave transmissions"},{"id":"opt_3","text":"Direct battery charging for gaming chairs"},{"id":"opt_4","text":"Built-in wireless screen mirroring"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    133,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What is the role of the Power Supply Unit (PSU) inside a computer tower?',
    '[{"id":"opt_1","text":"Converts high-voltage alternating current (AC from wall outlet) into regulated low-voltage direct current (DC: 12V, 5V, 3.3V)"},{"id":"opt_2","text":"Generates electricity using a miniature motor"},{"id":"opt_3","text":"Acts as a Wi-Fi booster"},{"id":"opt_4","text":"Stores data when power fails"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    134,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What is RAM dual-channel architecture?',
    '[{"id":"opt_1","text":"Using two identical memory sticks simultaneously across two separate memory controller channels to double memory bandwidth"},{"id":"opt_2","text":"Plugging RAM into two different computers"},{"id":"opt_3","text":"Installing two different operating systems in memory"},{"id":"opt_4","text":"Using both Bluetooth and Wi-Fi together"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    135,
    'tech',
    'Part 2: Tech Knowledge (Hardware & Architecture)',
    'What does Moore’s Law historically state regarding microchips?',
    '[{"id":"opt_1","text":"The number of transistors on a microchip tends to double approximately every two years with falling relative cost"},{"id":"opt_2","text":"Computers double their physical size every decade"},{"id":"opt_3","text":"Internet speed doubles every month"},{"id":"opt_4","text":"Software bugs double with every new programmer"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    136,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'Why did the European Union mandate USB Type-C as the standard charging port for all smartphones, tablets, and cameras?',
    '[{"id":"opt_1","text":"To reduce electronic waste and allow consumers to use one interoperable, reversible high-speed charger across all brands"},{"id":"opt_2","text":"Because USB-C cables cannot carry viruses"},{"id":"opt_3","text":"Because Apple owned the patent on USB-C"},{"id":"opt_4","text":"To make phone screens brighter"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    137,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'Why was short-range wireless technology named "Bluetooth"?',
    '[{"id":"opt_1","text":"Named after 10th-century Danish Viking King Harald Bluetooth, who united Scandinavian tribes just as Bluetooth unites devices"},{"id":"opt_2","text":"Because the first transmitter gave off a blue indicator glow"},{"id":"opt_3","text":"Because the inventor loved eating blueberries"},{"id":"opt_4","text":"Because radio frequencies turn air molecules blue"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    138,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What does the term "Wi-Fi" officially stand for?',
    '[{"id":"opt_1","text":"Nothing: it is a catchy consumer brand name created by a branding firm, though often misattributed to Wireless Fidelity"},{"id":"opt_2","text":"Wireless Fiber-optics"},{"id":"opt_3","text":"Wide Frequency Internet"},{"id":"opt_4","text":"Worldwide Fidelity"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    139,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'Why was the QWERTY keyboard layout originally created for mechanical typewriters in the 1870s?',
    '[{"id":"opt_1","text":"To space out frequently used letter pairs so mechanical typewriter typebars would not collide and jam during fast typing"},{"id":"opt_2","text":"Because it was the most ergonomic layout for human fingers"},{"id":"opt_3","text":"To spell out \"TYPEWRITER\" on the top row"},{"id":"opt_4","text":"To make learning typing more difficult"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    140,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'Tech Riddle: "I have keys with no locks, a space with no room, and you can enter but never leave. What am I?"',
    '[{"id":"opt_1","text":"A computer keyboard"},{"id":"opt_2","text":"A flash drive"},{"id":"opt_3","text":"A secure server room"},{"id":"opt_4","text":"A database index"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    141,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What legendary hardware reset key combination was designed by David Bradley for early IBM PCs to restart without power-cycling?',
    '[{"id":"opt_1","text":"Ctrl + Alt + Delete"},{"id":"opt_2","text":"Shift + Tab + Escape"},{"id":"opt_3","text":"Alt + F4 + Space"},{"id":"opt_4","text":"Ctrl + Shift + Enter"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    142,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What technology allows you to tap your phone or debit card on a POS payment terminal without inserting or swiping?',
    '[{"id":"opt_1","text":"Near Field Communication (NFC)"},{"id":"opt_2","text":"Infrared beam"},{"id":"opt_3","text":"Long-Range RFID"},{"id":"opt_4","text":"Satellite radar"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    143,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'Why were QR codes invented by Japanese company Denso Wave in 1994?',
    '[{"id":"opt_1","text":"To track automobile parts during car manufacturing with fast 2D scanning from any angle"},{"id":"opt_2","text":"To share Wi-Fi passwords at restaurants"},{"id":"opt_3","text":"To display restaurant menus on smartphones"},{"id":"opt_4","text":"To replace credit card magnetic stripes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    144,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What is an eSIM in modern smartphones?',
    '[{"id":"opt_1","text":"A digital programmable SIM chip soldered directly onto the phone’s motherboard, eliminating physical plastic SIM cards"},{"id":"opt_2","text":"A virtual SIM stored on the cloud requiring daily login"},{"id":"opt_3","text":"An electronic battery booster"},{"id":"opt_4","text":"A satellite antenna adapter"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    145,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What does a refresh rate of 120Hz on a smartphone or monitor screen mean?',
    '[{"id":"opt_1","text":"The display refreshes the displayed image 120 times every second, making animations and scrolling feel ultra-smooth"},{"id":"opt_2","text":"The screen flashes 120 times per minute"},{"id":"opt_3","text":"The device processor runs at 120 Megahertz"},{"id":"opt_4","text":"The battery lasts for 120 hours"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    146,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What does the IP rating "IP68" on a flagship smartphone signify?',
    '[{"id":"opt_1","text":"Dust-tight protection (6) and water submersion resistance up to 1.5 meters for 30 minutes (8)"},{"id":"opt_2","text":"Internet Protocol version 68 compatibility"},{"id":"opt_3","text":"Impact Proof up to 68 meters drop height"},{"id":"opt_4","text":"Internal Processor with 68 cores"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    147,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What enables Active Noise Cancellation (ANC) in modern earbuds like AirPods and Sony headphones?',
    '[{"id":"opt_1","text":"Outward microphones detect ambient noise and speakers generate an inverted phase \"anti-noise\" sound wave that cancels it"},{"id":"opt_2","text":"Thick layers of lead insulation"},{"id":"opt_3","text":"Playing silent supersonic audio that numbs the eardrum"},{"id":"opt_4","text":"Blocking ear canals with solid glue"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    148,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'How does GPS (Global Positioning System) on your phone determine your exact coordinates on Earth?',
    '[{"id":"opt_1","text":"By calculating time-of-flight radio signals from at least 4 atomic-clock orbital satellites using trilateration"},{"id":"opt_2","text":"By reading mobile cell phone towers only"},{"id":"opt_3","text":"By measuring magnetic earth poles using compass chips"},{"id":"opt_4","text":"By bouncing laser beams off the clouds"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    149,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What is the main visual advantage of an OLED display compared to a traditional LCD IPS display?',
    '[{"id":"opt_1","text":"Each OLED pixel emits its own light and can turn off completely for true infinite contrast and deep blacks"},{"id":"opt_2","text":"OLED screens never consume any battery power"},{"id":"opt_3","text":"OLED screens can only display black and white"},{"id":"opt_4","text":"OLED screens cannot break when dropped"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    150,
    'tech',
    'Part 2: Tech Knowledge (Gadgets & Standards)',
    'What does the term "Thunderbolt" port on laptops mean?',
    '[{"id":"opt_1","text":"A high-speed hardware interface developed by Intel and Apple that carries PCIe, DisplayPort, and DC power up to 40Gbps over USB-C"},{"id":"opt_2","text":"A lightning-proof charger connector"},{"id":"opt_3","text":"A solar charging battery connector"},{"id":"opt_4","text":"An acoustic sound port for lightning storms"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    151,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does the Domain Name System (DNS) do on the internet?',
    '[{"id":"opt_1","text":"Translates human-friendly web domain names (like zairza.in) into machine-routable IP addresses (like 172.67.182.20)"},{"id":"opt_2","text":"Encrypts personal credit card numbers"},{"id":"opt_3","text":"Compresses images before downloading"},{"id":"opt_4","text":"Assigns student roll numbers"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    152,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does the "s" in HTTPS stand for and what does the padlock in your browser address bar verify?',
    '[{"id":"opt_1","text":"Secure (HTTP over TLS/SSL encryption); verifies data sent between your browser and the server is encrypted and tamper-proof"},{"id":"opt_2","text":"Speed (HTTP Server Acceleration)"},{"id":"opt_3","text":"Standard (Standard World Wide Web)"},{"id":"opt_4","text":"Social (Social Media Verified)"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    153,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'Why is Two-Factor Authentication (2FA) strongly recommended for personal college, email, and coding accounts?',
    '[{"id":"opt_1","text":"Even if an attacker steals or guesses your password, they cannot log in without your physical phone code or security key"},{"id":"opt_2","text":"It doubles your internet download speed"},{"id":"opt_3","text":"It lets you share passwords safely with friends"},{"id":"opt_4","text":"It prevents your monitor from accumulating dust"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    154,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does the standard HTTP status code "404 Not Found" mean?',
    '[{"id":"opt_1","text":"The browser successfully communicated with the web server, but the server could not locate the requested page/resource"},{"id":"opt_2","text":"Your internet connection was disconnected"},{"id":"opt_3","text":"The web server has suffered a hardware explosion"},{"id":"opt_4","text":"Your computer has been infected with malware"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    155,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'Where does over 99% of all international intercontinental internet data traffic physically travel across the world?',
    '[{"id":"opt_1","text":"Through fiber-optic submarine communication cables laid across the ocean floor"},{"id":"opt_2","text":"Through orbiting communication satellites in space"},{"id":"opt_3","text":"Through microwave cell towers"},{"id":"opt_4","text":"Through underground radio tunnels"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    156,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does "The Cloud" (e.g., AWS, Microsoft Azure, Google Cloud) physically mean in computer science?',
    '[{"id":"opt_1","text":"Massive, highly-secured, air-conditioned data center warehouses filled with racks of servers connected globally via the internet"},{"id":"opt_2","text":"Data converted into radio waves floating in the Earth’s upper atmosphere"},{"id":"opt_3","text":"Hard drives strapped to weather observation balloons"},{"id":"opt_4","text":"A futuristic quantum dimension inside computer screens"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    157,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does opening an "Incognito" or "Private Browsing" window in Google Chrome or Firefox actually do?',
    '[{"id":"opt_1","text":"It does not save your local browsing history, cookies, or form data on that computer after closing the window"},{"id":"opt_2","text":"It makes you completely invisible to website servers, Wi-Fi admins, and internet service providers"},{"id":"opt_3","text":"It encrypts your webcam video feed"},{"id":"opt_4","text":"It protects you from physical police surveillance"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    158,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is Phishing in cybersecurity?',
    '[{"id":"opt_1","text":"A deceptive attack where scammers pose as legitimate organizations via fake emails or websites to trick users into revealing passwords"},{"id":"opt_2","text":"Catching computer bugs using software nets"},{"id":"opt_3","text":"Downloading pirated movies over torrent networks"},{"id":"opt_4","text":"Overheating a computer CPU using infinite loops"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    159,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is Ransomware?',
    '[{"id":"opt_1","text":"Malicious software that encrypts a victim’s computer files and demands payment in cryptocurrency to provide the decryption key"},{"id":"opt_2","text":"Software that automatically pays your phone bills"},{"id":"opt_3","text":"An antivirus that cleans files for free"},{"id":"opt_4","text":"A tool used to speed up internet downloads"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    160,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is the primary difference between IPv4 and IPv6 internet addresses?',
    '[{"id":"opt_1","text":"IPv4 uses 32-bit addresses (~4.3 billion total) and has run out; IPv6 uses 128-bit hexadecimal addresses providing virtually infinite IPs"},{"id":"opt_2","text":"IPv6 is only for military satellites while IPv4 is for phones"},{"id":"opt_3","text":"IPv4 is wireless and IPv6 is wired Ethernet"},{"id":"opt_4","text":"IPv4 is text-based while IPv6 uses Morse code"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    161,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does a Firewall do on a computer network?',
    '[{"id":"opt_1","text":"Monitors and filters incoming and outgoing network traffic based on predetermined security rules to block unauthorized access"},{"id":"opt_2","text":"Extinguishes physical electrical fires inside the computer power supply"},{"id":"opt_3","text":"Speeds up your gaming graphics card"},{"id":"opt_4","text":"Cleans dust out of fan vents"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    162,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is a Computer Worm compared to a traditional Computer Virus?',
    '[{"id":"opt_1","text":"A worm is standalone malware that replicates itself automatically across networks without requiring user action to attach to a host file"},{"id":"opt_2","text":"A worm is made of physical biological matter"},{"id":"opt_3","text":"A worm only infects computer monitors"},{"id":"opt_4","text":"A worm cannot cause harm"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    163,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is a VPN (Virtual Private Network)?',
    '[{"id":"opt_1","text":"An encrypted software tunnel that routes your internet traffic through a remote server, masking your public IP address from local snooping"},{"id":"opt_2","text":"A special physical fiber cable plugged into your laptop"},{"id":"opt_3","text":"A private website only accessible by programmers"},{"id":"opt_4","text":"A virus scanning program"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    164,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is the role of an Internet Cookie stored by your web browser?',
    '[{"id":"opt_1","text":"A small text file saved by websites to remember login sessions, shopping carts, and user preferences"},{"id":"opt_2","text":"A virus that deletes hard drive partitions"},{"id":"opt_3","text":"A reward earned for visiting websites quickly"},{"id":"opt_4","text":"A hardware sensor inside the trackpad"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    165,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is a Distributed Denial of Service (DDoS) attack?',
    '[{"id":"opt_1","text":"Overwhelming a targeted server or website with a flood of fake internet traffic from thousands of infected botnet computers"},{"id":"opt_2","text":"Physically cutting undersea fiber cables"},{"id":"opt_3","text":"Stealing credit cards using skimmers"},{"id":"opt_4","text":"Guessing a password by trying dictionary words"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    166,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is End-to-End Encryption (E2EE) used by messaging apps like WhatsApp and Signal?',
    '[{"id":"opt_1","text":"Only the communicating sender and recipient have the cryptographic keys to decrypt messages; neither the service provider nor hackers can read them"},{"id":"opt_2","text":"Messages are only encrypted when your phone is turned off"},{"id":"opt_3","text":"Messages are stored in plain text on public Google servers"},{"id":"opt_4","text":"Messages are permanently printed on paper"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    167,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does the term "Open Source" mean in software development?',
    '[{"id":"opt_1","text":"The software source code is published publicly so anyone can inspect, modify, enhance, and learn from it"},{"id":"opt_2","text":"The software has no security passwords"},{"id":"opt_3","text":"The software only works with an open internet tab"},{"id":"opt_4","text":"The software is proprietary and owned by a single corporation"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    168,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What does the term "Bandwidth" measure in internet networking?',
    '[{"id":"opt_1","text":"The maximum data transfer capacity of a network communication channel per unit of time (e.g., Megabits per second)"},{"id":"opt_2","text":"The physical length of your Ethernet cable"},{"id":"opt_3","text":"The weight of a router in kilograms"},{"id":"opt_4","text":"The number of tabs open in your browser"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    169,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is a Zero-Day Vulnerability in cybersecurity?',
    '[{"id":"opt_1","text":"A software security flaw that is known to attackers or researchers before the software developer has created and issued a security patch"},{"id":"opt_2","text":"A virus that only works on Sundays"},{"id":"opt_3","text":"A computer bug that deletes itself in 0 days"},{"id":"opt_4","text":"A trial software program that expires in 0 days"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    170,
    'tech',
    'Part 2: Tech Knowledge (Internet & Security)',
    'What is Two-Way SSL / Mutual TLS (mTLS)?',
    '[{"id":"opt_1","text":"Both client and server authenticate each other’s cryptographic certificates before establishing a secure communication session"},{"id":"opt_2","text":"Typing your password two times in a row"},{"id":"opt_3","text":"Using two different web browsers simultaneously"},{"id":"opt_4","text":"Opening two tabs of the same website"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    171,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'In generative AI systems like ChatGPT, what does the abbreviation "GPT" actually stand for?',
    '[{"id":"opt_1","text":"Generative Pre-trained Transformer"},{"id":"opt_2","text":"General Programmed Technology"},{"id":"opt_3","text":"Global Python Terminal"},{"id":"opt_4","text":"Graph Processing Tokenizer"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    172,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'Why is semiconductor company NVIDIA the dominant hardware leader in modern artificial intelligence?',
    '[{"id":"opt_1","text":"Their graphics processing units (GPUs) and CUDA software platform excel at the massive parallel matrix multiplications needed for training neural networks"},{"id":"opt_2","text":"They are the only company that manufactures computer cases"},{"id":"opt_3","text":"They own the copyright to the Python programming language"},{"id":"opt_4","text":"Their chips are made entirely of diamond crystals"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    173,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is an "AI Hallucination" in Large Language Models (LLMs)?',
    '[{"id":"opt_1","text":"When an AI generates factually incorrect or fabricated statements while sounding completely confident and plausible"},{"id":"opt_2","text":"When a computer screen displays glowing psychedelic colors"},{"id":"opt_3","text":"When an AI model turns itself off due to heat"},{"id":"opt_4","text":"When a robot dreams of electric sheep"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    174,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is "Prompt Engineering" in the context of AI tools?',
    '[{"id":"opt_1","text":"The practice of carefully designing and structuring input queries, instructions, and context to produce the best possible output from an AI model"},{"id":"opt_2","text":"Wiring cables inside an AI server rack"},{"id":"opt_3","text":"Writing operating system drivers in Assembly"},{"id":"opt_4","text":"Soldering silicon chips on a breadboard"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    175,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'Which groundbreaking research paper published by Google researchers in 2017 introduced the "Attention" mechanism that powers modern LLMs?',
    '[{"id":"opt_1","text":"\"Attention Is All You Need\""},{"id":"opt_2","text":"\"Deep Learning in Neural Nets\""},{"id":"opt_3","text":"\"Computing Machinery and Intelligence\""},{"id":"opt_4","text":"\"Mastering the Game of Go\""}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    176,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is a "Deepfake" in modern digital media?',
    '[{"id":"opt_1","text":"Synthetic media where a person’s face, voice, or likeness is convincingly replaced or generated using deep generative neural networks"},{"id":"opt_2","text":"A low-resolution photo taken underwater"},{"id":"opt_3","text":"A fake account created on a website"},{"id":"opt_4","text":"A deleted post from a social media forum"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    177,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What does the "Turing Test", proposed by Alan Turing in 1950, seek to evaluate?',
    '[{"id":"opt_1","text":"Whether a machine can converse via text so humanly that an evaluator cannot distinguish it from a real human being"},{"id":"opt_2","text":"Whether a computer can compute 1 billion numbers in 1 second"},{"id":"opt_3","text":"Whether a computer can survive underwater"},{"id":"opt_4","text":"Whether a robot can run a marathon"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    178,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is "Computer Vision" in artificial intelligence?',
    '[{"id":"opt_1","text":"The field of AI that trains computers to interpret and understand meaningful visual information from digital images and real-time camera feeds"},{"id":"opt_2","text":"Special glasses worn by programmers when coding late at night"},{"id":"opt_3","text":"A monitor screen that tracks human eyes"},{"id":"opt_4","text":"A 4K resolution camera attached to drones"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    179,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is "Reinforcement Learning from Human Feedback" (RLHF) used to train conversational models like ChatGPT?',
    '[{"id":"opt_1","text":"Finetuning model outputs using human preferences and reward scoring so the model becomes helpful, harmless, and polite"},{"id":"opt_2","text":"Paying human workers to type all answers manually in real time"},{"id":"opt_3","text":"Having humans type computer code directly into neural weights"},{"id":"opt_4","text":"Punishing robots with electric shocks"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    180,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What are "Tokens" in Large Language Models?',
    '[{"id":"opt_1","text":"The basic units of text (words, syllables, or character fragments) that a model reads, processes, and predicts sequentially"},{"id":"opt_2","text":"Digital coins used to buy items in video games"},{"id":"opt_3","text":"Physical plastic chips used to play arcade games"},{"id":"opt_4","text":"Security badges used to enter college labs"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    181,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'Which AI research organization created Claude, focusing heavily on "Constitutional AI" safety frameworks?',
    '[{"id":"opt_1","text":"Anthropic"},{"id":"opt_2","text":"OpenAI"},{"id":"opt_3","text":"DeepMind"},{"id":"opt_4","text":"Meta AI"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    182,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is Google DeepMind’s AlphaFold celebrated for in computational biology?',
    '[{"id":"opt_1","text":"Accurately predicting the 3D folded atomic structures of nearly all known proteins from their amino acid sequences"},{"id":"opt_2","text":"Developing video game characters"},{"id":"opt_3","text":"Designing electric sports cars"},{"id":"opt_4","text":"Translating ancient hieroglyphics"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    183,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is the main purpose of autonomous vehicle perception systems combining Cameras, Radar, and LiDAR?',
    '[{"id":"opt_1","text":"To create an accurate 3D point-cloud and visual model of nearby pedestrians, vehicles, road boundaries, and obstacles in real time"},{"id":"opt_2","text":"To play movies on the car windshield"},{"id":"opt_3","text":"To take panoramic photos for social media"},{"id":"opt_4","text":"To broadcast radio stations to passing cars"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    184,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is "Overfitting" in machine learning model training?',
    '[{"id":"opt_1","text":"When a model memorizes the training data too closely (including noise), causing it to perform poorly on new, unseen test data"},{"id":"opt_2","text":"When an algorithm runs out of computer memory"},{"id":"opt_3","text":"When the cooling fan on a server spins too fast"},{"id":"opt_4","text":"When a neural network has fewer than 3 layers"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    185,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is "Synthetic Data" in AI training?',
    '[{"id":"opt_1","text":"Data artificially generated by computer simulations or algorithms rather than collected from direct real-world measurements"},{"id":"opt_2","text":"Counterfeit memory chips made of plastic"},{"id":"opt_3","text":"Fake news articles posted online"},{"id":"opt_4","text":"Data corrupted by computer viruses"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    186,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is an "Autonomous Agent" in modern AI software?',
    '[{"id":"opt_1","text":"An AI system that can independently perceive its environment, formulate sub-goals, use tools, run code, and execute multi-step tasks"},{"id":"opt_2","text":"A robot spy created for government intelligence"},{"id":"opt_3","text":"A customer service call center employee"},{"id":"opt_4","text":"A virus that deletes browser cookies"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    187,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is a "Neural Network" loosely modeled after in computer science?',
    '[{"id":"opt_1","text":"The interconnected network of biological neurons and synapses in the human brain"},{"id":"opt_2","text":"A spider web built in outdoor forests"},{"id":"opt_3","text":"The railway network of European passenger trains"},{"id":"opt_4","text":"The wiring inside a household television set"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    188,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What does the term "Open Weights" mean for AI models like Meta’s Llama series?',
    '[{"id":"opt_1","text":"The trained parameter weights are publicly downloadable and runnable on local hardware, unlike proprietary API-only models"},{"id":"opt_2","text":"The model files have no digital weight in bytes"},{"id":"opt_3","text":"The model requires zero electricity to compute"},{"id":"opt_4","text":"The model cannot be used for commercial purposes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    189,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What is "Zero-Shot Learning" in AI?',
    '[{"id":"opt_1","text":"The ability of a model to perform a task or classify inputs without having received any specific training examples for that exact task"},{"id":"opt_2","text":"Training an AI model in zero seconds"},{"id":"opt_3","text":"An AI model that always outputs zero"},{"id":"opt_4","text":"A computer game where you take zero shots"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    190,
    'tech',
    'Part 2: Tech Knowledge (AI & Modern Trends)',
    'What does "Edge AI" refer to in modern engineering?',
    '[{"id":"opt_1","text":"Running AI models directly on local physical devices (like smartphones, drones, or smart cameras) without sending data to the cloud"},{"id":"opt_2","text":"AI models that generate sharp edges on 3D models"},{"id":"opt_3","text":"AI servers placed at the outer edge of room desks"},{"id":"opt_4","text":"AI algorithms that are very close to failing"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    191,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'In August 2023, India’s Chandrayaan-3 achieved a historic soft landing near the lunar south pole. What were the names of the Lander and the Rover modules?',
    '[{"id":"opt_1","text":"Lander: Vikram, Rover: Pragyan"},{"id":"opt_2","text":"Lander: Pushpak, Rover: Aditya"},{"id":"opt_3","text":"Lander: Mangal, Rover: Gaganyaan"},{"id":"opt_4","text":"Lander: Aryabhata, Rover: Bhaskara"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    192,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What historic feat did ISRO’s Aditya-L1 spacecraft achieve in January 2024?',
    '[{"id":"opt_1","text":"Successfully inserted into a halo orbit around the Sun-Earth Lagrange Point 1 (L1) to continuously study solar coronal emissions"},{"id":"opt_2","text":"Landed on the surface of Mercury"},{"id":"opt_3","text":"Flew through the rings of Saturn"},{"id":"opt_4","text":"Drilled into the ice core of a comet"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    193,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'Which aerospace company revolutionized rocket launches by landing orbital Falcon 9 boosters upright on autonomous ocean drone ships so they can be reflown?',
    '[{"id":"opt_1","text":"SpaceX"},{"id":"opt_2","text":"Blue Origin"},{"id":"opt_3","text":"Boeing Starliner"},{"id":"opt_4","text":"Virgin Galactic"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    194,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is the name of Boston Dynamics’ famous 4-legged yellow quadruped robot dog used worldwide for industrial inspection and mapping?',
    '[{"id":"opt_1","text":"Spot"},{"id":"opt_2","text":"Atlas"},{"id":"opt_3","text":"BigDog"},{"id":"opt_4","text":"Optimus"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    195,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is the name of NASA’s flagship space telescope that uses 18 gold-coated beryllium hexagonal mirror segments to capture deep infrared views of the early universe?',
    '[{"id":"opt_1","text":"James Webb Space Telescope (JWST)"},{"id":"opt_2","text":"Hubble Space Telescope"},{"id":"opt_3","text":"Kepler Space Observatory"},{"id":"opt_4","text":"Spitzer Space Telescope"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    196,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is Gaganyaan, one of ISRO’s most ambitious upcoming missions?',
    '[{"id":"opt_1","text":"India’s first indigenous human spaceflight mission designed to send Indian astronauts (Gaganyatris) to low Earth orbit"},{"id":"opt_2","text":"An unmanned probe to explore the moons of Jupiter"},{"id":"opt_3","text":"A satellite network providing free high-speed Wi-Fi"},{"id":"opt_4","text":"An underwater nuclear submarine testing project"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    197,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is the robotic arm on the International Space Station (ISS) that maneuvers payloads, assists spacewalks, and captures visiting spacecraft called?',
    '[{"id":"opt_1","text":"Canadarm2"},{"id":"opt_2","text":"RoboHand 3000"},{"id":"opt_3","text":"EuroArm"},{"id":"opt_4","text":"TitanGripper"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    198,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What small, autonomous robotic helicopter flew 72 successful missions in the thin atmosphere of Mars alongside NASA’s Perseverance rover?',
    '[{"id":"opt_1","text":"Ingenuity"},{"id":"opt_2","text":"Opportunity"},{"id":"opt_3","text":"Spirit"},{"id":"opt_4","text":"Sojourner"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    199,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is a "Degree of Freedom" (DoF) in robotics engineering?',
    '[{"id":"opt_1","text":"The number of independent directions, axes, or joints along which a robotic arm or mechanism can move or rotate"},{"id":"opt_2","text":"How many degrees Celsius a robot can withstand"},{"id":"opt_3","text":"The battery life percentage of an autonomous vehicle"},{"id":"opt_4","text":"The warranty period of a commercial robot"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    200,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is "Inverse Kinematics" (IK) in robotics software?',
    '[{"id":"opt_1","text":"Calculating the joint angles required to position a robot’s end-effector or gripper at a desired coordinate in 3D space"},{"id":"opt_2","text":"Running a robot’s motors backward to recharge the battery"},{"id":"opt_3","text":"Flipping a robot upside down to clean sensors"},{"id":"opt_4","text":"Measuring the temperature of servo motors"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    201,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'Why do satellites and spacecraft use gold foil (multi-layer insulation or MLI blankets) on their exterior chassis?',
    '[{"id":"opt_1","text":"To reflect intense solar radiation and thermally insulate sensitive instruments from extreme temperature fluctuations in space"},{"id":"opt_2","text":"To show the high financial wealth of the space agency"},{"id":"opt_3","text":"To improve Wi-Fi signal reception back to Earth"},{"id":"opt_4","text":"To prevent asteroids from sticking to the hull"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    202,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is the purpose of an IMU (Inertial Measurement Unit) inside a drone or spacecraft flight controller?',
    '[{"id":"opt_1","text":"Combines accelerometers and gyroscopes to measure linear acceleration and angular velocity for attitude stabilization"},{"id":"opt_2","text":"Measures atmospheric oxygen levels"},{"id":"opt_3","text":"Transmits high-definition live video feeds"},{"id":"opt_4","text":"Charges the drone battery during descent"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    203,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is "Geostationary Orbit" (GEO) and why is it valuable for television broadcast and weather satellites?',
    '[{"id":"opt_1","text":"Satellites orbit at 35,786 km with an orbital period matching Earth’s 24-hr rotation, appearing stationary over the same point on Earth"},{"id":"opt_2","text":"Satellites orbit 100 meters above building roofs"},{"id":"opt_3","text":"Satellites orbit over the North Pole only"},{"id":"opt_4","text":"Satellites fly through the center of the Earth"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    204,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is the purpose of an Electronic Speed Controller (ESC) on a multirotor quadcopter drone?',
    '[{"id":"opt_1","text":"Regulates the electrical current and RPM speed delivered to each individual brushless DC motor based on flight controller commands"},{"id":"opt_2","text":"Measures how fast the drone travels across the ground"},{"id":"opt_3","text":"Controls the camera shutter speed"},{"id":"opt_4","text":"Acts as an emergency parachute deployer"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    205,
    'tech',
    'Part 2: Tech Knowledge (Space & Robotics)',
    'What is the ISS (International Space Station) and approximately how fast does it orbit around the Earth?',
    '[{"id":"opt_1","text":"A modular habitable research space station orbiting at approximately 28,000 km/h (~17,500 mph), completing one orbit every 90 minutes"},{"id":"opt_2","text":"A moon base orbiting at 500 km/h"},{"id":"opt_3","text":"A stationary satellite floating over Paris"},{"id":"opt_4","text":"A solar panel factory on Mars"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    206,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'Which umbrella organization created by the Reserve Bank of India (RBI) and Indian Banks’ Association operates the Unified Payments Interface (UPI)?',
    '[{"id":"opt_1","text":"National Payments Corporation of India (NPCI)"},{"id":"opt_2","text":"NITI Aayog"},{"id":"opt_3","text":"TRAI"},{"id":"opt_4","text":"SEBI"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    207,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is ONDC (Open Network for Digital Commerce) launched by the Government of India?',
    '[{"id":"opt_1","text":"An open-protocol network designed to unbundle e-commerce, allowing local buyers and sellers to transact regardless of app platform"},{"id":"opt_2","text":"A government-owned shopping website competing with Amazon"},{"id":"opt_3","text":"A free food delivery app for university students"},{"id":"opt_4","text":"A portal for filing income tax returns"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    208,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What technology is used by FASTag to enable automatic toll payment deduction without stopping vehicles at highway toll plazas?',
    '[{"id":"opt_1","text":"Radio Frequency Identification (RFID)"},{"id":"opt_2","text":"Bluetooth Low Energy"},{"id":"opt_3","text":"QR Code Barcode Scanner"},{"id":"opt_4","text":"Satellite Laser Radar"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    209,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is DigiLocker, an initiative under the Digital India program?',
    '[{"id":"opt_1","text":"A secure cloud-based platform for issuance and verification of authentic digital documents and certificates recognized legally as originals"},{"id":"opt_2","text":"A physical locker rented at national post offices"},{"id":"opt_3","text":"A password manager app for Android"},{"id":"opt_4","text":"A storage facility for computer server parts"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    210,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is the India Stack in digital public infrastructure?',
    '[{"id":"opt_1","text":"A set of open APIs (Aadhaar, e-KYC, e-Sign, DigiLocker, UPI) that enable presence-less, paperless, and cashless service delivery"},{"id":"opt_2","text":"A stack of supercomputers installed in Bengaluru"},{"id":"opt_3","text":"A skyscraper housing Indian IT startups"},{"id":"opt_4","text":"A programming library for Indian languages"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    211,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is BharatQR introduced by NPCI, Visa, and Mastercard?',
    '[{"id":"opt_1","text":"A common, interoperable QR code payment specification that eliminates the need for merchants to display multiple QR stickers"},{"id":"opt_2","text":"A national identification card for businesses"},{"id":"opt_3","text":"A barcode scanner used in Indian ration shops"},{"id":"opt_4","text":"A railway ticketing portal"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    212,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is the purpose of the Indian Semiconductor Mission (ISM) launched by the Government of India?',
    '[{"id":"opt_1","text":"To build a vibrant semiconductor design and fabrication ecosystem, reducing foreign reliance for microchips and electronics"},{"id":"opt_2","text":"To build computers using wood rather than silicon"},{"id":"opt_3","text":"To import older generation CRT monitors"},{"id":"opt_4","text":"To replace computer chips with paper punch cards"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    213,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is BHIM (Bharat Interface for Money)?',
    '[{"id":"opt_1","text":"A mobile payment app developed by NPCI that allows simple, direct bank-to-bank payments using the Unified Payments Interface (UPI)"},{"id":"opt_2","text":"A cryptocurrency exchange for trading Bitcoin in India"},{"id":"opt_3","text":"An online loan application for college tuition"},{"id":"opt_4","text":"A digital wallet that charges 10% fee per transaction"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    214,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is the difference between 5G Non-Standalone (NSA) and 5G Standalone (SA) deployed in India?',
    '[{"id":"opt_1","text":"5G SA uses a dedicated 5G core network end-to-end, while 5G NSA anchors 5G radio frequencies on top of existing 4G LTE core infrastructure"},{"id":"opt_2","text":"5G SA only works when you are standing still"},{"id":"opt_3","text":"5G NSA is free while 5G SA requires expensive subscriptions"},{"id":"opt_4","text":"5G SA does not support smartphones"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    215,
    'tech',
    'Part 2: Tech Knowledge (Digital India)',
    'What is the Bhashini initiative launched by the Ministry of Electronics and Information Technology (MeitY)?',
    '[{"id":"opt_1","text":"An AI-powered national language translation mission to make digital services accessible across Indian languages using voice and text"},{"id":"opt_2","text":"A government database of classical Indian literature"},{"id":"opt_3","text":"A coding language written in Sanskrit"},{"id":"opt_4","text":"A radio channel broadcasting college lectures"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    216,
    'tech',
    'Part 2: Tech Knowledge (Tech Trivia & Culture)',
    'Why are electronic junk emails and unsolicited advertising messages referred to as "SPAM"?',
    '[{"id":"opt_1","text":"Named after a famous 1970 Monty Python comedy sketch where a restaurant menu repeated the canned meat \"Spam\" incessantly over all conversations"},{"id":"opt_2","text":"Because SPAM is an acronym for System Programs And Memory"},{"id":"opt_3","text":"Because the first spam email was sent by the Hormel meat company"},{"id":"opt_4","text":"Because it stands for Super Powered Advertising Message"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    217,
    'tech',
    'Part 2: Tech Knowledge (Tech Trivia & Culture)',
    'What is "Ray Tracing" in modern computer graphics and gaming (RTX)?',
    '[{"id":"opt_1","text":"An advanced rendering technique that simulates the physical path and bounces of optical light rays to create realistic reflections, shadows, and refractions"},{"id":"opt_2","text":"A tool used to trace lines on physical circuit boards"},{"id":"opt_3","text":"An algorithm that speeds up character running animations"},{"id":"opt_4","text":"A method of connecting two gaming mice together"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    218,
    'tech',
    'Part 2: Tech Knowledge (Tech Trivia & Culture)',
    'What is the mascot of the Linux operating system?',
    '[{"id":"opt_1","text":"Tux the Penguin"},{"id":"opt_2","text":"Octocat"},{"id":"opt_3","text":"Duke the Java Mascot"},{"id":"opt_4","text":"Bugdroid"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    219,
    'tech',
    'Part 2: Tech Knowledge (Tech Trivia & Culture)',
    'What is GitHub’s famous mascot called?',
    '[{"id":"opt_1","text":"Mona the Octocat (a creature that is part cat, part octopus)"},{"id":"opt_2","text":"Clippy the Paperclip"},{"id":"opt_3","text":"Gopher the Mascot"},{"id":"opt_4","text":"Byte the Dog"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    220,
    'tech',
    'Part 2: Tech Knowledge (Tech Trivia & Culture)',
    'Why were early Android operating system releases (from Android 1.5 to Android 9) named after sweet confectionery desserts in alphabetical order (Cupcake, Donut, Eclair, Froyo, Gingerbread, Honeycomb, Ice Cream Sandwich, Jelly Bean, KitKat, Lollipop, Marshmallow, Nougat, Oreo, Pie)?',
    '[{"id":"opt_1","text":"Because the team wanted to sweeten up mobile developers’ lives and create fun, memorable internal release milestones"},{"id":"opt_2","text":"Because Google owned bakeries across California"},{"id":"opt_3","text":"Because the programmers were only allowed to eat candy during builds"},{"id":"opt_4","text":"Because of a legal agreement with confectionery brands"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    221,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Club Philosophy)',
    'What does the official Zairza motto "Wonder • Think • Create" mean to you as an engineer at OUTR?',
    '[{"id":"opt_1","text":"Cultivating genuine curiosity (Wonder), applying first-principles logic to analyze problems (Think), and building impactful real-world systems (Create)"},{"id":"opt_2","text":"Memorizing theoretical textbook formulas to secure high exam marks"},{"id":"opt_3","text":"Waiting for seniors to assign step-by-step tasks without taking initiative"},{"id":"opt_4","text":"Just a catchy marketing slogan for social media posts"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    222,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Hackathon Dynamics)',
    'It is 2:00 AM during an intense 24-hour hackathon. Your team’s database connection crashes and a teammate is panicking. What is your immediate course of action?',
    '[{"id":"opt_1","text":"Stay calm, brew a cup of coffee, pair up with the teammate to systematically trace the error logs, isolate the failing module, and divide remaining tasks"},{"id":"opt_2","text":"Publicly berate the teammate for breaking the codebase and demand they fix it alone"},{"id":"opt_3","text":"Abandon the hackathon and go to sleep in the hostel without telling anyone"},{"id":"opt_4","text":"Pretend nothing is broken and hope the judges do not test database functionality"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    223,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Receiving Feedback)',
    'During a club design review, a senior mentor points out serious security flaws and structural inefficiencies in your newly built web API or circuit schematic. How do you respond?',
    '[{"id":"opt_1","text":"Listen actively without being defensive, ask targeted technical questions to understand best engineering practices, and iterate constructively on the design"},{"id":"opt_2","text":"Take it as a personal attack, argue aggressively without data, and stop showing up to the lab"},{"id":"opt_3","text":"Verbally agree in the meeting but silently ignore all the feedback and submit the old version anyway"},{"id":"opt_4","text":"Complain to your classmates that the mentor is biased against your branch"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    224,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Academic Balance)',
    'With mid-semester examinations approaching in two weeks and an ambitious club robotics build underway, how do you manage your time effectively?',
    '[{"id":"opt_1","text":"Plan ahead by time-blocking focused study sessions daily, communicate milestone availability early to project leads, and work efficiently without last-minute cramming"},{"id":"opt_2","text":"Bunk all academic lectures to stay in the club room 24/7"},{"id":"opt_3","text":"Ghost the club project entirely without informing teammates until after exams finish"},{"id":"opt_4","text":"Ignore both studies and club tasks until the night before the exam"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    225,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Inclusivity & Mentorship)',
    'A 1st-year student from a non-CS branch (such as Civil, Textile, or Mechanical) joins your club workshop and feels intimidated because they have never written code before. What do you do?',
    '[{"id":"opt_1","text":"Encourage them warmly, explain fundamental concepts using relatable real-world analogies, pair up with them, and reassure them that curiosity matters far more than prior experience"},{"id":"opt_2","text":"Tell them that non-CS students cannot build software and advise them to quit"},{"id":"opt_3","text":"Laugh at their basic questions in front of the workshop room"},{"id":"opt_4","text":"Do their entire assignment for them so they do not learn anything"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    226,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Integrity & Ethics)',
    'Ten minutes before submitting an ideathon project, you realize a teammate pasted a complex open-source algorithm into your repo without including the original author’s license attribution. What do you do?',
    '[{"id":"opt_1","text":"Immediately add proper open-source license attribution and comments citing the original author, ensuring ethical transparency and academic compliance"},{"id":"opt_2","text":"Delete the comments and disguise the variable names to pretend your team invented it from scratch"},{"id":"opt_3","text":"Blame the teammate to the judges if caught"},{"id":"opt_4","text":"Ignore it because nobody reads open-source licenses anyway"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    227,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Team Disagreements)',
    'Your project team is split 50/50 between two different hardware sensor modules. After a thorough technical comparison, the team votes to adopt the alternate sensor over your personal preference. What is your attitude?',
    '[{"id":"opt_1","text":"Practice \"Disagree and Commit\": respect the collective decision, align with the team, and contribute 100% of your energy to make the chosen design successful"},{"id":"opt_2","text":"Actively sabotage the chosen sensor during tests so the team is forced to use your option"},{"id":"opt_3","text":"Refuse to work on the hardware module and sulk in team meetings"},{"id":"opt_4","text":"Continuously remind the team at every minor glitch that they should have picked your idea"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    228,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Cross-Wing Synergy)',
    'Why does Zairza emphasize the deep synergy between its three wings: Software, Hardware (Robotics & IoT), and Design?',
    '[{"id":"opt_1","text":"Because cutting-edge real-world products require intuitive interfaces (Design), intelligent algorithms (Software), and physical sensors/actuators (Hardware) working harmoniously"},{"id":"opt_2","text":"It does not; each wing should work in total isolation without talking to others"},{"id":"opt_3","text":"Only the software wing produces valuable work"},{"id":"opt_4","text":"Just to inflate club enrollment numbers"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    229,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Failure & Resilience)',
    'You spent three weeks building an autonomous obstacle-avoidance drone for a tech fest, but during the final arena run, a sudden motor glitch causes it to crash. How do you handle the setback?',
    '[{"id":"opt_1","text":"Analyze the telemetry flight logs and hardware damage calmly, identify the root cause, document lessons learned, and rebuild a more resilient system for the next event"},{"id":"opt_2","text":"Kick the broken drone in anger and blame the event organizers for bad arena lighting"},{"id":"opt_3","text":"Quit robotics permanently and post complaints on social media"},{"id":"opt_4","text":"Hide the damaged parts in the club closet and pretend the crash never occurred"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    230,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Ownership & Proactivity)',
    'While working in the club lab, you notice a messy soldering station with unattended hot irons and tangled jumper wires left behind by an earlier group. What do you do?',
    '[{"id":"opt_1","text":"Turn off the hot soldering iron immediately for laboratory safety, neatly organize the workspace, and gently remind members to maintain lab cleanliness"},{"id":"opt_2","text":"Leave it hot because you were not the one who used it"},{"id":"opt_3","text":"Take photos and post sarcastic comments in the general club chat"},{"id":"opt_4","text":"Throw all the expensive tools into the trash"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    231,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Continuous Learning)',
    'A new programming framework or hardware microcontroller emerges that nobody in the club has used before. How do you approach it?',
    '[{"id":"opt_1","text":"Dive into official documentation, build a small weekend prototype to test its capabilities, and document findings to share in a club knowledge-sharing session"},{"id":"opt_2","text":"Wait until it is taught in university semester curriculum five years later"},{"id":"opt_3","text":"Dismiss it as useless without investigating its technical trade-offs"},{"id":"opt_4","text":"Pretend to be an expert without ever installing it"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    232,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Handling Pressure)',
    'Your team has promised a functioning club portal demonstration to faculty patrons tomorrow, but a major API integration bug emerges at 8:00 PM. How do you proceed?',
    '[{"id":"opt_1","text":"Communicate transparently with project leads, assess the critical user paths, implement a reliable defensive fallback for the demo, and focus on stability over non-essential features"},{"id":"opt_2","text":"Cancel the meeting with faculty without explanation"},{"id":"opt_3","text":"Panic and push untested random code changes directly to production"},{"id":"opt_4","text":"Blame your team members during the live faculty presentation"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    233,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Active Listening)',
    'During an ideathon brainstorming session, a quieter 1st-year teammate attempts to suggest an innovative project idea but is repeatedly talked over by louder members. What is your reaction?',
    '[{"id":"opt_1","text":"Politely pause the conversation, invite the teammate to share their idea fully, listen attentively, and build constructively on their suggestion"},{"id":"opt_2","text":"Join in talking over them because louder voices must have better ideas"},{"id":"opt_3","text":"Ignore the discussion and scroll through your phone"},{"id":"opt_4","text":"Tell the quiet teammate that freshers should only listen"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    234,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Accountability)',
    'You accidentally apply reverse polarity to an expensive club microcontroller board and smell burnt silicon. What is your immediate response?',
    '[{"id":"opt_1","text":"Disconnect the power immediately, inform club mentors honestly about the mistake, analyze why it happened, and learn how to implement reverse-polarity protection diodes next time"},{"id":"opt_2","text":"Quickly put the fried board back into the storage drawer and pretend someone else broke it"},{"id":"opt_3","text":"Blame the manufacturer for bad quality"},{"id":"opt_4","text":"Deny ever entering the lab that afternoon"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    235,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Knowledge Sharing)',
    'You spend three days solving a very obscure bug in an embedded Linux kernel build. What is the most beneficial next step for the club?',
    '[{"id":"opt_1","text":"Write a clear, concise technical note or blog post documenting the root cause and solution in the club knowledge base for future juniors"},{"id":"opt_2","text":"Keep the solution a secret so other students will always need to ask you for help"},{"id":"opt_3","text":"Delete your bash history so nobody can copy your commands"},{"id":"opt_4","text":"Forget about it immediately after it works"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    236,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Collaboration)',
    'You are tasked with leading a 4-person induction project. How do you delegate work among your team members?',
    '[{"id":"opt_1","text":"Assess each member’s strengths, interests, and learning goals, define clear modular milestones, and hold short daily sync-ups to unblock challenges collaboratively"},{"id":"opt_2","text":"Do all the work yourself because you do not trust anyone else"},{"id":"opt_3","text":"Assign all difficult tasks to others while taking credit for the entire project"},{"id":"opt_4","text":"Tell everyone to do whatever they want with zero milestones or communication"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    237,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Conflict Resolution)',
    'Two teammates in your hackathon group have a heated argument over whether to use PostgreSQL or MongoDB for the application database. How do you resolve the deadlock?',
    '[{"id":"opt_1","text":"Ground the debate in technical data: list the project’s specific schema requirements, query patterns, and time constraints to pick the most pragmatic solution objectively"},{"id":"opt_2","text":"Encourage them to settle it with a physical arm-wrestling contest"},{"id":"opt_3","text":"Let them argue indefinitely while the hackathon clock runs out"},{"id":"opt_4","text":"Quit the team because conflict makes you uncomfortable"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    238,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Resource Stewardship)',
    'You notice that club robotics components (sensors, motors, jumper wires) frequently go missing or get tangled after project builds. What proactive initiative do you take?',
    '[{"id":"opt_1","text":"Propose and help implement a simple digital component checkout inventory system with labeled component bins to keep equipment organized and accessible"},{"id":"opt_2","text":"Complain privately without offering any constructive solution"},{"id":"opt_3","text":"Take components to your personal hostel room so nobody else can use them"},{"id":"opt_4","text":"Stop using club hardware altogether"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    239,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Empathy in Code Reviews)',
    'When reviewing a junior teammate’s first Git pull request, you find several coding formatting inconsistencies and inefficient nested loops. How do you write your review comments?',
    '[{"id":"opt_1","text":"Write encouraging, polite comments explaining the rationale behind cleaner patterns, provide helpful code documentation links, and praise the aspects they implemented well"},{"id":"opt_2","text":"Leave harsh comments like \"Who wrote this garbage? Delete this!\""},{"id":"opt_3","text":"Silently reject the pull request without giving any explanation"},{"id":"opt_4","text":"Merge the bad code without saying anything"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    240,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Workplace Culture)',
    'What type of workplace and club culture does Zairza strive to cultivate within the OUTR Bhubaneswar campus?',
    '[{"id":"opt_1","text":"An open, meritocratic, collaborative culture where curiosity is celebrated, questions are welcomed, and people build bold technology together"},{"id":"opt_2","text":"A rigid, hierarchical environment where juniors are afraid to speak to seniors"},{"id":"opt_3","text":"A competitive zero-sum culture where students hoard information"},{"id":"opt_4","text":"A casual club where no real projects are ever finished"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    241,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Ambition & Vision)',
    'Why do you want to be inducted into Zairza over other campus societies at OUTR?',
    '[{"id":"opt_1","text":"To immerse myself in a culture of relentless builders, collaborate across hardware and software, and turn ambitious theoretical concepts into functional reality"},{"id":"opt_2","text":"Just to have a certificate to put on a resume without doing any project work"},{"id":"opt_3","text":"Because my friends told me there is free food at events"},{"id":"opt_4","text":"Because I had free time on a weekday evening"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    242,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Prioritization)',
    'You have three competing deadlines tomorrow: a lab experiment write-up, a club design sprint, and a personal project. How do you prioritize your evening?',
    '[{"id":"opt_1","text":"Evaluate the true deadlines, communicate expected completion windows with stakeholders, focus deeply on the highest-impact deliverable first, and eliminate digital distractions"},{"id":"opt_2","text":"Procrastinate on social media for 5 hours while worrying about all three"},{"id":"opt_3","text":"Submit incomplete work for all three without checking quality"},{"id":"opt_4","text":"Turn off your phone and go to sleep"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    243,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Feedback to Seniors)',
    'During a team retrospective, seniors ask for candid feedback on how club workshop sessions could be improved. What do you do?',
    '[{"id":"opt_1","text":"Offer polite, thoughtful, and constructive suggestions backed by specific examples of what helped you learn most effectively"},{"id":"opt_2","text":"Remain completely silent out of fear even though you had several good ideas"},{"id":"opt_3","text":"Rude and aggressive insults without constructive alternatives"},{"id":"opt_4","text":"Say everything was perfect when you actually struggled to follow"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    244,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Celebrating Peers)',
    'A peer in your induction cohort builds an outstanding IoT automation demo that wins first prize at a tech exhibit. What is your reaction?',
    '[{"id":"opt_1","text":"Celebrate their victory genuinely, congratulate them warmly, and ask them to share how they overcame key technical hurdles so everyone can learn"},{"id":"opt_2","text":"Feel jealous and spread rumors that they copied the project online"},{"id":"opt_3","text":"Act indifferent and refuse to acknowledge their achievement"},{"id":"opt_4","text":"Complain to the judges that your project was better"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    245,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Unclear Requirements)',
    'A club mentor asks your team to design a "Smart Campus Energy Monitor" without providing detailed written specifications. How do you start?',
    '[{"id":"opt_1","text":"Schedule a brief discovery discussion with the mentor to clarify project goals, identify user needs, document assumptions, and propose an initial minimal viable architecture"},{"id":"opt_2","text":"Do nothing and wait indefinitely for a 50-page specification document"},{"id":"opt_3","text":"Build something completely unrelated and hope they like it"},{"id":"opt_4","text":"Complain that the instructions were too vague to start"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    246,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Community Engagement)',
    'When Zairza hosts its flagship annual technical symposium or hackathon, how do you see your role as a junior inductee?',
    '[{"id":"opt_1","text":"Actively volunteer, support logistics, assist visiting participants with enthusiasm, and showcase the best hospitality and engineering excellence of OUTR"},{"id":"opt_2","text":"Sit in the corner and avoid all volunteer responsibilities"},{"id":"opt_3","text":"Complain about having to wake up early for the event"},{"id":"opt_4","text":"Leave the campus and ignore the symposium"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    247,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Patience in Debugging)',
    'You have been trying to fix a compiler segmentation fault or hardware signal jitter for four hours without success. How do you prevent frustration from taking over?',
    '[{"id":"opt_1","text":"Step away for a 15-minute walk to clear your head, review your fundamental assumptions with fresh eyes, rubber-duck the problem aloud, or ask a peer for a fresh perspective"},{"id":"opt_2","text":"Smash the keyboard or kick the lab bench in frustration"},{"id":"opt_3","text":"Delete the entire project repository permanently"},{"id":"opt_4","text":"Give up on engineering and declare that computers are broken"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    248,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Curiosity Beyond Branch)',
    'You are enrolled in Electrical Engineering, but a club workshop on 3D Blender modeling and UI/UX design is scheduled this weekend. What is your perspective?',
    '[{"id":"opt_1","text":"Attend with an open mind, because understanding user experience and physical product aesthetic makes you a far more versatile and well-rounded engineer"},{"id":"opt_2","text":"Refuse to attend because electrical engineers should only look at wires"},{"id":"opt_3","text":"Attend only to distract other attendees"},{"id":"opt_4","text":"Dismiss design as irrelevant to engineering"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    249,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Self-Care & Burnout)',
    'After three continuous days of intense hacking, you feel physically exhausted and mentally depleted. What is the responsible choice for both you and your team?',
    '[{"id":"opt_1","text":"Get a full night of restorative sleep, hydrate, and return with renewed cognitive focus, recognizing that burnout degrades code quality and health"},{"id":"opt_2","text":"Drink six energy drinks and push through until you collapse during the presentation"},{"id":"opt_3","text":"Pretend you are fine while making catastrophic coding errors"},{"id":"opt_4","text":"Quit the team abruptly due to exhaustion"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    250,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Respecting Diversity)',
    'Your project team includes students from diverse cultural backgrounds, mother tongues, and technical preparation levels. How do you build team cohesion?',
    '[{"id":"opt_1","text":"Foster an inclusive environment where everyone communicates respectfully, values different perspectives, and supports each other’s unique strengths"},{"id":"opt_2","text":"Form exclusionary cliques and only talk in your local dialect"},{"id":"opt_3","text":"Make insensitive jokes about people from different regions"},{"id":"opt_4","text":"Refuse to collaborate with people outside your branch"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    251,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Long-Term Commitment)',
    'Being a part of Zairza is a multi-year journey of learning, building, and eventually mentoring the next generation of freshers. Are you prepared for this commitment?',
    '[{"id":"opt_1","text":"Yes, I am excited to learn diligently now, contribute to ambitious society builds, and give back by mentoring incoming freshers in future years"},{"id":"opt_2","text":"No, I only want to stay for one month until I get a certificate"},{"id":"opt_3","text":"I will disappear whenever real project work is assigned"},{"id":"opt_4","text":"I am only joining because my parents asked me to"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    252,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Handling Praise)',
    'Following a successful project demonstration, faculty and guests shower your team with praise and awards. How do you carry yourself?',
    '[{"id":"opt_1","text":"Stay humble, acknowledge every teammate’s individual contribution, thank mentors for their guidance, and stay focused on building even greater things"},{"id":"opt_2","text":"Brag arrogantly to everyone on campus that you did it all by yourself"},{"id":"opt_3","text":"Belittle other teams whose projects did not win awards"},{"id":"opt_4","text":"Stop attending workshops because you think you know everything"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    253,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Documentation Mindset)',
    'Why does Zairza require all induction projects to have clean README documentation, architecture diagrams, and installation guides?',
    '[{"id":"opt_1","text":"Because undocumented code is unusable code; clear documentation ensures projects can be audited, maintained, and expanded by future students"},{"id":"opt_2","text":"Just to make students waste time typing text"},{"id":"opt_3","text":"Because faculty only read English and never run software"},{"id":"opt_4","text":"To make the project repository look heavier in megabytes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    254,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Resourcefulness)',
    'When building a prototype on a limited student budget, a required custom sensor bracket is not available locally. What do you do?',
    '[{"id":"opt_1","text":"Use rapid prototyping: design a 3D model in CAD and 3D print it in the club lab, or laser-cut an acrylic prototype creatively"},{"id":"opt_2","text":"Cancel the entire project immediately"},{"id":"opt_3","text":"Demand that the club buy a Rs. 50,000 industrial machine for a single bracket"},{"id":"opt_4","text":"Wait for two months for an imported part to arrive"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    255,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Humility in Learning)',
    'A 1st-year classmate who learned to code in school points out an edge case bug in a script you wrote. What is your reaction?',
    '[{"id":"opt_1","text":"Thank them sincerely for catching the bug, review the edge case together, and update the test suite to prevent regressions"},{"id":"opt_2","text":"Argue that because you are older or have higher marks, your code cannot have bugs"},{"id":"opt_3","text":"Silently revert their fix because your pride is hurt"},{"id":"opt_4","text":"Ignore the bug until it crashes in production"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    256,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Mentoring Juniors)',
    'When you become a senior in your 2nd and 3rd year, how do you plan to support incoming freshers who enter the club?',
    '[{"id":"opt_1","text":"Be approachable, conduct hands-on beginner-friendly bootcamps, provide patient code reviews, and inspire them to build without fear of failure"},{"id":"opt_2","text":"Intimidate them to prove how smart I am"},{"id":"opt_3","text":"Ignore them and let them figure everything out alone"},{"id":"opt_4","text":"Assign them menial personal chores outside club scope"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    257,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Constructive Disagreement)',
    'You strongly believe a project should be built using TypeScript instead of plain JavaScript for type safety, while your teammate prefers plain JS. How do you discuss it?',
    '[{"id":"opt_1","text":"Present a clear comparison highlighting developer velocity vs bug-catch trade-offs, offer to write the initial type definitions, and agree on a consensus that serves the project timeline"},{"id":"opt_2","text":"Refuse to write a single line of code unless your way is chosen"},{"id":"opt_3","text":"Insult your teammate for not knowing TypeScript"},{"id":"opt_4","text":"Silently rename all files without telling the team"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    258,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Grace Under Failure)',
    'Your team submits a proposal for an external national innovation grant, but the application is rejected in the first round. What is your takeaway?',
    '[{"id":"opt_1","text":"Request feedback if possible, analyze the winning proposals to identify gaps in your pitch or prototype validation, and refine the idea for the next opportunity"},{"id":"opt_2","text":"Assume the competition was rigged and give up on grant applications"},{"id":"opt_3","text":"Blame your college faculty for the rejection"},{"id":"opt_4","text":"Delete all project files in frustration"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    259,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (Safety in Hardware Labs)',
    'Before powering on a high-voltage motor driver or custom lithium-polymer (LiPo) battery pack, what protocol do you strictly follow?',
    '[{"id":"opt_1","text":"Double-check polarity and wiring with a digital multimeter, ensure proper fuse ratings, keep a fire-safe LiPo bag nearby, and verify with a lab lead"},{"id":"opt_2","text":"Plug it directly into the wall outlet and hope for the best"},{"id":"opt_3","text":"Touch the exposed copper terminals with your fingers to see if it feels warm"},{"id":"opt_4","text":"Turn on all switches at maximum current simultaneously"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    260,
    'hr',
    'Part 3: Coffee Test & Cultural Alignment (The Zairza Spirit)',
    'Ultimately, what makes someone a true "Zairzite" at OUTR?',
    '[{"id":"opt_1","text":"An unquenchable thirst for learning, a collaborative heart, the courage to tackle hard technical challenges, and a commitment to creating real impact"},{"id":"opt_2","text":"Having the most expensive laptop in the classroom"},{"id":"opt_3","text":"Bragging on LinkedIn about events never attended"},{"id":"opt_4","text":"Memorizing definitions without building anything"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

-- ============================================================================
-- ISOLATED ANSWER KEYS SEED (260 KEYS)
-- ============================================================================

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    1,
    'opt_3',
    'These are squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. The next prime is 17, and 17^2 = 289.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    2,
    'opt_2',
    'Pattern alternates: +5, -2, +5, -2, +5, -2. So 12 + 5 = 17.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    3,
    'opt_2',
    'Pattern is n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42, 7*8=56.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    4,
    'opt_1',
    'Pattern is n^3 - 1: 1^3-1=0, 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1=342.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    5,
    'opt_2',
    'Fibonacci sequence where each term is the sum of the two preceding terms: 13 + 21 = 34.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    6,
    'opt_3',
    'Pattern is x * 2 + 1: 5*2+1=11, 11*2+1=23, 23*2+1=47, 47*2+1=95, 95*2+1=191.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    7,
    'opt_1',
    'Consecutive prime numbers. The prime immediately following 17 is 19.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    8,
    'opt_1',
    'Differences are doubling powers of 2 subtracted each step: -4, -8, -16, -32, -64. 40 - 64 = -24.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    9,
    'opt_2',
    'Pattern is n^n: 1^1=1, 2^2=4, 3^3=27, 4^4=256, 5^5=3125.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    10,
    'opt_2',
    'Differences are powers of 3 times 4 (4, 12, 36, 108, 324). 170 + 324 = 494.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    11,
    'opt_2',
    'Each term is multiplied by 1.5 (3/2): 40.5 * 1.5 = 60.75.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    12,
    'opt_1',
    'Pattern is x * 2 + 1, x * 2 + 2, x * 2 + 3... 122 * 2 + 5 = 249.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    13,
    'opt_2',
    'Alternating squares and cubes: 1^2, 2^3, 3^2, 4^3, 5^2, 6^3, 7^2 = 49.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    14,
    'opt_2',
    'Pattern is n^2 + 1: 8^2 + 1 = 65.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    15,
    'opt_2',
    'Multiplication factors increase by 0.5: *0.5, *1, *1.5, *2, *2.5. 120 * 2.5 = 300.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    16,
    'opt_2',
    'Each letter advances by +3 positions: B(2)->E(5)->H(8)->K(11)->N(14)->Q(17).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    17,
    'opt_1',
    'Subtractions increase by 1: -3, -4, -5, -6. N(14) - 6 = H(8).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    18,
    'opt_1',
    'Pairs of opposite letters from start and end of the English alphabet: E pairs with V.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    19,
    'opt_2',
    'Increments increase by 1: +2, +3, +4, +5, +6. O(15) + 6 = U(21).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    20,
    'opt_2',
    'First letter +1 (J,K,L,M->N), middle letter +1 (A,B,C,D->E), third letter +1 (K,L,M,N->O). Result is NEO.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    21,
    'opt_1',
    'Letters: Z(-2)->X(-2)->V(-2)->T(-2)->R. Numbers: factorial 1, 2, 6, 24, 120. Ending letter: A->B->C->D->E. Result is R120E.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    22,
    'opt_2',
    'Multiples of 3 in the alphabet: R(18) + 3 = U(21).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    23,
    'opt_1',
    'Each pair has a gap of 2 letters (D-F), and between pairs is +1 step. RT -> +1 is U, and +2 is X, yielding UX.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    24,
    'opt_1',
    'First letter decreases by 2: Y, W, U, S, Q. Second letter increases by 2: B, D, F, H, J. Result is QJ.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    25,
    'opt_1',
    'Letters shift by +2 (H->J, J->L), number increases by +2 (8->10). Result is J10L.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    26,
    'opt_1',
    'Letters shifted: Z(+1)->A, A(+2)->C, I(+2)->K, R(+2)->T, Z(+2)->B, A(+2)->C. Following the pattern for INDUCT gives KPFWEV.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    27,
    'opt_1',
    'First two letters are shifted forward by +2, remaining letters stay unchanged: D(+2)->F, R(+2)->T, ONE -> FTQPG.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    28,
    'opt_1',
    'Word is split in two halves and letters are inverted in each half: FRAC -> CARF, TION -> NOIT. CARFNOIT.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    29,
    'opt_1',
    'Sum of letter positions: P(16) + I(9) + G(7) = 32.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    30,
    'opt_1',
    'Each letter is shifted forward by +2: F(+2)->H, I(+2)->K, R(+2)->T, E(+2)->G. Result is HKTG.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    31,
    'opt_2',
    'Each letter is shifted backward by -1: S->R, O->N, U->T, N->M, D->C => RNTMC.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    32,
    'opt_1',
    'Direct alphabetic index substitution: V=22, E=5, N=14, U=21, S=19.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    33,
    'opt_1',
    'Letters shifted by +2: R(+2)->T, A(+2)->C, I(+2)->P, N(+2)->K => TCPK.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    34,
    'opt_1',
    'Each letter is shifted by +2: A->C, P->R, P->R, L->N, E->G => CRRNG.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    35,
    'opt_1',
    '''3'' is in both ''hot filtered coffee'' and ''very hot day'', so 3 = hot. ''5'' is in ''day and night'' and ''very hot day'', so 5 = day. Hence ''6'' stands for ''very''.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    36,
    'opt_2',
    'Only son of Suresh''s mother is Suresh himself. Therefore, the boy is Suresh''s son, making Suresh the Father.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    37,
    'opt_3',
    'A is daughter of C, and C is daughter of D. Hence, A is the granddaughter of D.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    38,
    'opt_2',
    'The only daughter of Vipin''s mother-in-law is Vipin''s wife. The girl''s mother is Vipin''s wife, so Vipin is her Father.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    39,
    'opt_4',
    'The gender of Q is not explicitly mentioned (Q could be daughter or son). Hence, ''Q is T’s son'' cannot be definitely asserted.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    40,
    'opt_1',
    '''My father''s son'' with no siblings means the speaker himself. So ''that man''s father is me'', meaning the portrait is of his son.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    41,
    'opt_1',
    'A / C means A is sister of C (female). C * B means C is son of B. Therefore, A is the daughter of B.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    42,
    'opt_1',
    'Ananya''s brother''s only sister is Ananya herself. Her son''s father is her Husband.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    43,
    'opt_3',
    'K is the child of F, but K''s gender is unspecified. Thus, K is either Son or Daughter.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    44,
    'opt_3',
    'Brother of her mother is her maternal uncle. The son of her uncle is her Cousin.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    45,
    'opt_2',
    'B and R are both children of Q (R daughter, B son). M is sister of B, so M is also daughter of Q. Therefore, R is the Sister of M.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    46,
    'opt_2',
    'Horizontal displacement = sqrt(12^2 + 5^2) = 13m. Total 3D displacement = sqrt(13^2 + 13^2) = 13*sqrt(2) approx 18.38m.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    47,
    'opt_2',
    'North-South: +20 - 35 = -15m (South). East-West: +30 + 15 = +45m (East). Position is South-East.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    48,
    'opt_4',
    'At sunrise, the sun is in the East, so shadows fall toward the West. If West is to his right, Amit is facing South.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    49,
    'opt_2',
    'Flying South then left (East) then left (North) cancels vertical travel: remaining displacement is 20 km East.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    50,
    'opt_2',
    'The compass is rotated by 135 degrees counter-clockwise. West rotated 135 degrees counter-clockwise becomes South-East.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    51,
    'opt_2',
    'North-South: 10 - 6 = 4 km North. East: 3 km. Distance = sqrt(4^2 + 3^2) = 5 km North-East.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    52,
    'opt_2',
    'In the evening, sun is in the West, so shadows fall toward the East. Since Mohit’s shadow is to his right, Mohit is facing North. Therefore, Sumit (facing Mohit) is facing South.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    53,
    'opt_1',
    'East-West positions: -15 + 15 = 0. North-South positions: -20 - 12 = -32m. He is 32m directly South of X.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    54,
    'opt_2',
    'Shortest displacement = sqrt(8^2 + 6^2) = sqrt(64 + 36) = sqrt(100) = 10 km.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    55,
    'opt_2',
    'Normally at 6 PM the hour hand points South. Since it points North, the clock is rotated 180 degrees. At 9:15, the minute hand normally points East (at 3). Rotated 180 degrees, it points West.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    56,
    'opt_2',
    'Angle = |30*H - 5.5*M| = |30(3) - 5.5(15)| = |90 - 82.5| = 7.5 degrees.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    57,
    'opt_2',
    'Angle = |30(8) - 5.5(20)| = |240 - 110| = 130 degrees.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    58,
    'opt_2',
    'The hands coincide 11 times in every 12 hours (due to the 11-1 overlap), which totals 22 times in 24 hours.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    59,
    'opt_2',
    '2024 is a leap year (366 days = 52 weeks + 2 odd days). Adding 2 days to Monday gives Wednesday.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    60,
    'opt_1',
    'From 7 AM to 1 PM is 6 hours = 360 minutes. 360 / 3 = 120 intervals. 120 * 5s = 600s = 10 minutes. The clock displays 1:10 PM.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    61,
    'opt_2',
    '61 divided by 7 leaves a remainder of 5 odd days. Friday + 5 days = Wednesday.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    62,
    'opt_1',
    'Time = (30 * H) / (11/2) = (30 * 4) / 5.5 = 120 / (11/2) = 240/11 = 21 9/11 minutes past 4.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    63,
    'opt_3',
    'Century years must be divisible by 400 to be leap years. 1900 is divisible by 4 and 100, but not by 400.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    64,
    'opt_3',
    'Hands are at right angles twice an hour, but only 4 times between 2-4 and 8-10. This totals 22 times in 12 hours, or 44 times in 24 hours.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    65,
    'opt_4',
    'Non-leap year following a non-leap year repeats after 11 years (when sum of odd days equals a multiple of 7): 2007 + 11 = 2018.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    66,
    'opt_4',
    'Since all algorithms belong inside logic, and logic has zero intersection with emotional, no algorithm is emotional (I). Also, some logic are algorithms (II). Both follow.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    67,
    'opt_3',
    'Between sensors and radars there is no definite link, but they form a complementary pair (Some + No). Hence, either I or II must follow.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    68,
    'opt_1',
    'Universal positive transitive logic: Laptops subset Computers subset Electronic implies All laptops are electronic. The converse is invalid.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    69,
    'opt_3',
    'Two negative premises yield no definite categorical conclusion.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    70,
    'opt_2',
    'From "Some machines are fast", conversion directly yields "Some fast items are machines" (II). Robots and fast have no guaranteed overlap.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    71,
    'opt_2',
    'Total knowing at least one = 60 + 50 - 30 = 80. Students knowing neither = 100 - 80 = 20.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    72,
    'opt_1',
    'Pens intersect Books, and Books are fully contained in Papers, so Pens must intersect Papers (I). All papers are books is not guaranteed.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    73,
    'opt_3',
    'Flowers are inside Trees, and Trees do not touch Fruits, so no Fruit is a Flower. Also, some Trees are Flowers. Both follow.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    74,
    'opt_1',
    'n(B union C) = n(B) + n(C) - n(B intersect C) => 50 = 35 + 20 - x => x = 5.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    75,
    'opt_1',
    '''Most'' is equivalent to ''Some''. Some engineers are thinkers, and all thinkers are creators, hence Some engineers are creators (I).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    76,
    'opt_2',
    'Rank from bottom = Total - Rank from top + 1 = 45 - 16 + 1 = 30th.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    77,
    'opt_2',
    'Arrangement clockwise around circle: A -> B -> D -> E -> C -> F. To the immediate left of C is B.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    78,
    'opt_2',
    'Deepak''s new position (22) is Madhu''s former position (12th from right). Total = 22 + 12 - 1 = 33.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    79,
    'opt_3',
    'The line from left to right is: P -> T -> S -> Q -> R. The person in the middle is S.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    80,
    'opt_3',
    'Heights in descending order: C > A > B > D > E. C is the tallest.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    81,
    'opt_1',
    'Minimum overlap formula = (11 + 20) - (5 + 2) = 31 - 7 = 24.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    82,
    'opt_1',
    'With 8 seats, opposite is 4 positions away. Computing positions relative to M placed at seat 1 places T at seat 5.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    83,
    'opt_2',
    'Total = 7 + 7 - 1 = 13 trees.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    84,
    'opt_3',
    'Score order: W > X > Z > Y. Y scored the lowest.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    85,
    'opt_3',
    'Order from fastest: F > C > A > B > D > E. F won the race.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    86,
    'opt_2',
    '10001 in binary is 16 + 1 = 17 in base-10 decimal.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    87,
    'opt_4',
    'Compiler, Interpreter, and Assembler are language translation software; Microcontroller is an integrated hardware chip.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    88,
    'opt_1',
    'A thermometer measures temperature; a barometer measures atmospheric pressure.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    89,
    'opt_3',
    '27(3^3), 64(4^3), 125(5^3), 216(6^3) are all perfect cubes. 144 is a square (12^2) but not a cube.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    90,
    'opt_2',
    'An odograph (or odometer) measures distance travelled, just as a clock measures time.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    91,
    'opt_4',
    'Copper, Silver, and Aluminum are electrical conductors; Silicon is a semiconductor.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    92,
    'opt_2',
    'A byte contains 8 bits; a nibble contains exactly 4 bits.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    93,
    'opt_4',
    'Linux, macOS, and Windows are operating systems; Oracle is a relational database/software enterprise.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    94,
    'opt_2',
    '1 robot takes 5 minutes to assemble 1 board. Hence, 100 robots working concurrently will finish 100 boards in 5 minutes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    95,
    'opt_2',
    'Divide into 3 groups (3, 3, 2). Weigh 3 against 3. If equal, weigh the remaining 2. If unequal, weigh 1 against 1 from the heavier group. Guaranteed in 2 weighings.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    96,
    'opt_1',
    'Start both at time 0. At min 4, flip the 4-min timer. At min 7 (4-min has 1 min left), flip 7-min. At min 8, 4-min ends (7-min ran 1 min). Flip 7-min back to run for 1 min. 8 + 1 = 9 minutes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    97,
    'opt_2',
    'Bat + Ball = 110. Bat = Ball + 100. 2 * Ball + 100 = 110 => 2 * Ball = 10 => Ball = Rs. 5.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    98,
    'opt_2',
    'Net gain is 1 meter per day. At the end of day 27, it is at 27 meters. On day 28, it climbs 3 meters to reach 30 meters and exits before sliding.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    99,
    'opt_1',
    'Incandescent/heat physics: Bulb 2 is currently glowing, Bulb 1 is hot to the touch from being on for 10 minutes, and Bulb 3 is cold and off.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    100,
    'opt_1',
    'Rope 1 lit at both ends burns in 30 minutes. At that exact moment, lighting the second end of rope 2 burns its remaining 30 minutes of fuel in 15 minutes: 30 + 15 = 45 minutes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    101,
    'opt_1',
    'Ada Lovelace recognized that Babbage’s Analytical Engine could manipulate symbols beyond basic arithmetic and published the first machine algorithm in 1843.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    102,
    'opt_1',
    'Grace Hopper’s team discovered an actual moth trapped between the points of relay #70 in the Harvard Mark II electromechanical computer.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    103,
    'opt_1',
    'Journalist Don Hoefler coined the term in 1971 because Santa Clara county was home to pioneering semiconductor companies like Fairchild, Intel, and AMD.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    104,
    'opt_1',
    'Page and Brin originally named the search engine BackRub because the system analyzed incoming backlinks to measure web page relevance.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    105,
    'opt_1',
    'ARPANET (Advanced Research Projects Agency Network) launched packet-switching communications between UCLA and Stanford in October 1969.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    106,
    'opt_1',
    'Guido van Rossum was a big fan of the BBC comedy show Monty Python’s Flying Circus and wanted a name that sounded fun and irreverent.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    107,
    'opt_1',
    'Sir Tim Berners-Lee invented the World Wide Web, HTML, URL syntax, and the HTTP protocol at CERN in 1989.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    108,
    'opt_1',
    'Linus Torvalds created Linux, which today powers over 85% of global internet servers, supercomputers, and the core of Android.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    109,
    'opt_1',
    'Ray Tomlinson chose the "@" symbol on the ARPANET Model 33 Teletype because it represented "at" and was rarely used in usernames.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    110,
    'opt_1',
    'Douglas Engelbart demonstrated the first computer mouse in 1968, housing two wheels perpendicular to each other inside a wooden shell.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    111,
    'opt_1',
    'Apple Computer introduced the Macintosh in 1984, bringing graphical windows, menus, and the mouse into mainstream homes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    112,
    'opt_1',
    'VisiCalc (created by Dan Bricklin and Bob Frankston) transformed computers from hobbyist toys into indispensable corporate tools.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    113,
    'opt_1',
    'Steve Jobs unveiled the original iPhone at Macworld on January 9, 2007, combining an iPod, a mobile phone, and a breakthrough internet communicator.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    114,
    'opt_1',
    'Alan Turing designed the Bombe machines to decrypt Enigma messages and defined the foundational Turing Machine concept in 1936.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    115,
    'opt_1',
    'ENIAC (Electronic Numerical Integrator and Computer) was completed in 1945, using over 17,000 vacuum tubes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    116,
    'opt_1',
    'The point-contact transistor revolutionized electronics, earning the 1956 Nobel Prize in Physics and enabling the modern microchip era.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    117,
    'opt_1',
    'The IBM 350 RAMAC stored approximately 5 million 6-bit characters (around 3.75 to 5 MB) across 50 huge discs and weighed over a ton.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    118,
    'opt_1',
    'The MIT License is one of the most permissive open-source licenses, requiring only attribution while permitting commercial closed-source use.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    119,
    'opt_1',
    'Xerox PARC (Palo Alto Research Center) pioneered GUI windows, WYSIWYG editing, Ethernet networking, and object-oriented programming.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    120,
    'opt_1',
    'IBM Deep Blue defeated Garry Kasparov 3.5 to 2.5 in a six-game match in May 1997.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    121,
    'opt_1',
    'RAM is volatile memory designed for ultra-high-speed temporary calculations; non-volatile flash storage in SSDs traps electrons without power.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    122,
    'opt_1',
    'CPUs excel at complex serial logic and operating system orchestration; GPUs execute thousands of parallel mathematical matrix operations simultaneously.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    123,
    'opt_1',
    'Air is a poor heat conductor. Thermal paste fills microscopic imperfections on the metal surfaces to ensure efficient heat transfer into the radiator fins.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    124,
    'opt_1',
    'The UEFI/BIOS firmware initializes motherboard hardware components (POST) and locates the bootloader on the storage drive.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    125,
    'opt_1',
    'Mechanical hard drives must physically swing a magnetic read head across spinning platters; SSDs access semiconductor NAND flash memory instantaneously.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    126,
    'opt_1',
    'CPU cache (SRAM) operates at processor clock speeds (nanoseconds) to prevent the CPU from stalling while waiting for main DDR RAM.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    127,
    'opt_1',
    'A 3.8 GHz CPU executes 3.8 billion clock cycles per second, pacing internal transistor switching and instruction pipelines.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    128,
    'opt_1',
    '8 bits form 1 Byte (sufficient to represent 256 unique numbers or one ASCII character). 4 bits is a nibble.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    129,
    'opt_1',
    'Liquid coolant absorbs large thermal loads directly at the copper block and pumps it to large external radiator fins exposed to fan airflow.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    130,
    'opt_1',
    'Overclocking increases hardware frequency and voltage beyond rated specifications to achieve higher performance, generating extra heat.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    131,
    'opt_1',
    'HDMI transmits uncompressed digital audio and video signals over a single cable.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    132,
    'opt_1',
    'DisplayPort transmits data in micro-packets (like Ethernet) and supports multi-monitor daisy chaining and ultra-high variable refresh rates.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    133,
    'opt_1',
    'The PSU steps down and rectifies mains AC power into clean, regulated DC voltage rails that delicate computer microelectronics require.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    134,
    'opt_1',
    'Dual-channel memory doubles the communication width from 64-bit to 128-bit, drastically increasing throughput to the CPU.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    135,
    'opt_1',
    'Gordon Moore (co-founder of Intel) observed in 1965 that semiconductor manufacturing shrinks transistor gates, doubling density roughly every 18-24 months.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    136,
    'opt_1',
    'The universal USB-C mandate prevents thousands of tons of electronic cable waste by ensuring chargers and cords work across all manufacturers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    137,
    'opt_1',
    'Intel engineer Jim Kardach proposed Bluetooth as a temporary code name after King Harald Bluetooth, who united Scandinavian kingdoms.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    138,
    'opt_1',
    'The Wi-Fi Alliance hired branding firm Interbrand in 1999 to create a friendly consumer name; it was never an official technical acronym.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    139,
    'opt_1',
    'Christopher Sholes designed the QWERTY layout to slow down typing collisions between adjacent mechanical metal arms that jammed paper scrolls.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    140,
    'opt_1',
    'A computer keyboard has letter and number keys, a Space bar, and an Enter key.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    141,
    'opt_1',
    'David Bradley designed Ctrl+Alt+Del as a quick warm reboot interrupt that could not be pressed accidentally with one hand.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    142,
    'opt_1',
    'NFC enables two electronic devices to communicate securely over distances of 4 cm or less via high-frequency radio induction.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    143,
    'opt_1',
    'Denso Wave engineer Masahiro Hara designed 2D Quick Response codes to track vehicle components during Toyota production.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    144,
    'opt_1',
    'An embedded SIM (eSIM) is reprogrammable firmware on a surface-mount chip, allowing users to switch carriers remotely without inserting plastic trays.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    145,
    'opt_1',
    '120Hz means the display hardware draws 120 distinct frames per second, providing fluid motion compared to standard 60Hz screens.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    146,
    'opt_1',
    'In Ingress Protection ratings, 6 denotes complete dust tightness and 8 denotes resistance against continuous water immersion under specified manufacturer depths.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    147,
    'opt_1',
    'ANC uses phase cancellation (destructive interference): inverse sound waves collide with incoming background noise to neutralize sound pressure waves.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    148,
    'opt_1',
    'Trilateration requires signals from a minimum of 4 satellites to resolve latitude, longitude, altitude, and atomic clock receiver time offsets.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    149,
    'opt_1',
    'OLED pixels are organic light emitting diodes that self-illuminate; when displaying black, pixels turn off entirely without light bleed from a backlight.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    150,
    'opt_1',
    'Thunderbolt tunnels PCIe data and DisplayPort video multiplexed across USB-C cables at speeds reaching 40 to 80 Gbps.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    151,
    'opt_1',
    'DNS acts as the phonebook of the internet, resolving memorable alphanumeric URLs into numerical IP addresses understood by routers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    152,
    'opt_1',
    'HTTPS encrypts communication between the client and web server using TLS, preventing eavesdropping or man-in-the-middle packet tampering.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    153,
    'opt_1',
    '2FA requires something you know (password) plus something you possess (authenticator code or security key), thwarting over 99% of automated attacks.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    154,
    'opt_1',
    'HTTP 404 is a standard client-side error status indicating that the destination server is reachable, but the specific URL endpoint does not exist.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    155,
    'opt_1',
    'Over 1.4 million kilometers of high-capacity fiber-optic undersea cables crisscross ocean beds, carrying virtually all cross-continent internet traffic.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    156,
    'opt_1',
    'The Cloud is simply someone else’s industrial-scale computers: giant data centers with redundant power, high-speed fiber backbones, and enterprise storage.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    157,
    'opt_1',
    'Incognito mode only prevents local history and session cookies from persisting on the client machine; network admins and external websites still see your IP and traffic.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    158,
    'opt_1',
    'Phishing relies on social engineering to trick victims into handing over sensitive credentials or clicking malicious links.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    159,
    'opt_1',
    'Ransomware holds user files hostage through asymmetric cryptographic encryption until extortion ransoms are paid.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    160,
    'opt_1',
    'IPv4 has 2^32 (~4.3 billion) addresses. IPv6 provides 2^128 (approx 340 undecillion) addresses, ensuring every connected gadget has a unique public IP.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    161,
    'opt_1',
    'A firewall forms a barrier between trusted internal networks and untrusted external traffic by inspecting packet headers and ports.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    162,
    'opt_1',
    'Viruses require a human to run an infected host file; worms exploit network vulnerabilities to self-replicate independently.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    163,
    'opt_1',
    'A VPN encrypts device traffic and routes it through an intermediary server, shielding packet contents on public Wi-Fi networks.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    164,
    'opt_1',
    'HTTP cookies allow stateless web protocols to remember stateful sessions, user preferences, and shopping carts.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    165,
    'opt_1',
    'DDoS attacks use botnets of compromised IoT devices or computers to flood target servers with bandwidth packets until they crash.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    166,
    'opt_1',
    'E2EE encrypts data directly on the sender’s device and only decrypts it on the recipient’s device, keeping intermediate telecom servers blind to the contents.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    167,
    'opt_1',
    'Open-source software fosters peer collaboration, public security audits, and community-driven improvements.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    168,
    'opt_1',
    'Bandwidth represents the theoretical throughput capacity of a connection (how much data can flow per second, like water pipe diameter).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    169,
    'opt_1',
    'A Zero-Day flaw gives developers zero days of advance warning to prepare a defensive patch before potential active exploitation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    170,
    'opt_1',
    'mTLS ensures zero-trust security by verifying certificates on both the client side and the server side before initiating encrypted traffic.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    171,
    'opt_1',
    'GPT stands for Generative (creates new text), Pre-trained (trained on massive text corpora), Transformer (neural network architecture using self-attention).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    172,
    'opt_1',
    'NVIDIA GPUs feature thousands of tensor cores tailored for tensor math, supported by the mature CUDA computing ecosystem.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    173,
    'opt_1',
    'Hallucinations occur because LLMs predict mathematically probable sequences of tokens rather than accessing an active cognitive model of verified truth.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    174,
    'opt_1',
    'Prompt engineering guides the stochastic generation of LLMs by setting constraints, roles, few-shot examples, and chain-of-thought structures.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    175,
    'opt_1',
    'The 2017 paper "Attention Is All You Need" introduced the Transformer architecture, replacing recurrent networks with parallel self-attention.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    176,
    'opt_1',
    'Deepfakes use generative adversarial networks (GANs) and diffusion models to realistically fabricate video and audio of human beings.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    177,
    'opt_1',
    'The Imitation Game (Turing Test) tests whether a computer’s natural language responses can be distinguished from those of a human.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    178,
    'opt_1',
    'Computer vision uses convolutional networks and vision transformers to perform object detection, semantic segmentation, and scene understanding.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    179,
    'opt_1',
    'RLHF aligns raw base token-prediction models with human intentions by training a reward model based on human evaluator rankings.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    180,
    'opt_1',
    'Tokenizers (like Byte-Pair Encoding) break text into sub-word tokens. 1,000 English words typically correspond to approximately 1,333 tokens.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    181,
    'opt_1',
    'Anthropic was founded by former OpenAI researchers to pioneer Constitutional AI and transparent safety architectures.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    182,
    'opt_1',
    'AlphaFold solved a 50-year grand challenge in structural biology, accelerating drug discovery and biological engineering worldwide.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    183,
    'opt_1',
    'Sensor fusion merges high-resolution visual feeds with millimeter-wave radar and pulsed-laser LiDAR distance maps for navigation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    184,
    'opt_1',
    'Overfitting occurs when high-capacity models fit arbitrary noise in training samples, failing to generalize to real-world test inputs.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    185,
    'opt_1',
    'Synthetic data expands training corpora for scenarios where real data is scarce, hazardous, or privacy-restricted (e.g., self-driving edge cases).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    186,
    'opt_1',
    'AI agents leverage LLM reasoning to decompose goals, call external APIs, evaluate intermediate results, and iterate autonomously.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    187,
    'opt_1',
    'Artificial neural networks use mathematical nodes and adjustable synaptic weights inspired by biological neural firing mechanisms.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    188,
    'opt_1',
    'Open-weights models allow researchers and developers to run, fine-tune, and inspect model parameters locally on their own machines.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    189,
    'opt_1',
    'Zero-shot learning relies on rich pre-trained conceptual representations to generalize to new prompts without fine-tuned examples.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    190,
    'opt_1',
    'Edge AI delivers ultra-low latency, preserves user privacy, and works without an active internet connection by computing locally on-device.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    191,
    'opt_1',
    'The lander was named Vikram (honoring Dr. Vikram Sarabhai) and the 6-wheeled robotic rover was named Pragyan (Sanskrit for "Wisdom").'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    192,
    'opt_1',
    'Aditya-L1 was placed in a halo orbit around L1 (1.5 million km from Earth) to observe the Sun continuously without eclipses.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    193,
    'opt_1',
    'SpaceX pioneered rocket stage reusability, landing and re-flying individual Falcon 9 first stages over 20 times each.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    194,
    'opt_1',
    'Spot is Boston Dynamics’ agile quadruped robot that traverses rough terrain, climbs stairs, and performs automated industrial site inspections.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    195,
    'opt_1',
    'The James Webb Space Telescope orbits the Sun at Lagrange Point 2 (L2), observing faint infrared light from the earliest galaxies.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    196,
    'opt_1',
    'Gaganyaan aims to demonstrate human spaceflight capability by launching a crew of 3 to a 400 km orbit for a 3-day mission.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    197,
    'opt_1',
    'Canadarm2 (the Mobile Servicing System) is Canada’s premier contribution to the ISS, serving as a 17-meter-long robotic manipulator.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    198,
    'opt_1',
    'Ingenuity achieved the first powered, controlled aerodynamic flight on another planet in April 2021.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    199,
    'opt_1',
    'A 6-DoF robotic arm can position and orient its end-effector in three translational axes (X, Y, Z) and three rotational axes (Roll, Pitch, Yaw).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    200,
    'opt_1',
    'Forward kinematics calculates position from joint angles; Inverse Kinematics calculates the required joint angles to place a tool at a target point.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    201,
    'opt_1',
    'Multi-Layer Insulation (MLI) blankets made of aluminized Mylar and Kapton protect spacecraft from extreme radiative temperature swings.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    202,
    'opt_1',
    'The IMU provides high-rate angular velocity and acceleration data essential for flight stability and dead-reckoning navigation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    203,
    'opt_1',
    'In GEO, the satellite rotates at the exact rotational speed of the Earth, allowing ground dishes to point at a fixed location in the sky without tracking motors.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    204,
    'opt_1',
    'ESCs translate throttle signals from the flight controller into 3-phase AC power pulses that drive brushless drone motors.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    205,
    'opt_1',
    'The ISS orbits in Low Earth Orbit (~400 km altitude) at ~7.66 km/s, allowing crew members to witness 16 sunrises and sunsets every day.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    206,
    'opt_1',
    'NPCI was established in 2008 to operate retail payment and settlement systems in India, launching UPI in 2016.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    207,
    'opt_1',
    'ONDC is an open network specification (based on the Beckn protocol) that democratizes e-commerce by decoupling buyer and seller applications.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    208,
    'opt_1',
    'FASTag uses passive RFID technology affixed to the windscreen, read by toll plaza antennas to deduct tolls from linked prepaid accounts.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    209,
    'opt_1',
    'DigiLocker provides citizens with cloud storage tied to their Aadhaar, enabling paperless verification under the IT Act.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    210,
    'opt_1',
    'India Stack is the collective moniker for identity, payments, and data-governance APIs powering digital transformation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    211,
    'opt_1',
    'BharatQR is an integrated QR code system enabling merchants to accept payments from RuPay, Visa, and Mastercard through a single unified QR.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    212,
    'opt_1',
    'The ISM provides capital incentives to establish commercial silicon fabs, packaging plants, and compound semiconductor foundries in India.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    213,
    'opt_1',
    'BHIM was launched by Prime Minister Narendra Modi in December 2016 to facilitate seamless, direct bank payments.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    214,
    'opt_1',
    '5G Standalone provides true ultra-low latency, network slicing, and edge compute without legacy 4G core EPC dependencies.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    215,
    'opt_1',
    'Bhashini builds open-source AI language models and datasets to bridge language barriers across 22 scheduled Indian languages.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    216,
    'opt_1',
    'In a 1970 Monty Python sketch, Vikings chant "Spam, Spam, Spam" until no other dialogue can be heard; early internet users adopted it for repetitive newsgroup posts.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    217,
    'opt_1',
    'Ray tracing models light transport physically: calculating light rays bouncing off mirrors, water surfaces, and materials in real time.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    218,
    'opt_1',
    'Linus Torvalds chose Tux the Penguin as the official Linux mascot after being playfully pecked by a penguin at an Australian zoo.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    219,
    'opt_1',
    'Mona the Octocat was designed by graphic artist Simon Oxley to represent the collaborative, multi-tentacled nature of code collaboration.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    220,
    'opt_1',
    'Google named Android releases after desserts because smartphones sweeten our daily lives, maintaining alphabetical order for 10 years until Android 10.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    221,
    'opt_1',
    'Zairza’s core philosophy is the journey from raw curiosity to disciplined engineering analysis to working hardware, software, and design prototypes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    222,
    'opt_1',
    'High-pressure builds require emotional resilience, supportive pair-debugging, and structured log tracing over panic or finger-pointing.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    223,
    'opt_1',
    'Constructive technical feedback is the fastest catalyst for engineering growth; detaching ego from code is essential for professional maturity.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    224,
    'opt_1',
    'A true Zairza member maintains academic responsibility through transparent schedule planning and early communication with project teammates.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    225,
    'opt_1',
    'Engineering innovation at Zairza thrives on interdisciplinary collaboration; curiosity, hunger to learn, and peer empathy trump past background.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    226,
    'opt_1',
    'Engineering integrity requires rigorous honesty, respect for intellectual property, and adherence to open-source licensing standards.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    227,
    'opt_1',
    '"Disagree and Commit" enables high-performing engineering teams to debate passionately using data, but unite completely behind the final execution.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    228,
    'opt_1',
    'The greatest technology breakthroughs occur at the intersection of disciplines: a robot needs microelectronics, cloud intelligence, and ergonomic design.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    229,
    'opt_1',
    'Resilience and blameless post-mortem analysis are what turn failed experiments into future engineering triumphs.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    230,
    'opt_1',
    'True ownership means caring for shared spaces, laboratory safety, and collective club resources without waiting to be told.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    231,
    'opt_1',
    'Curiosity and self-driven exploratory prototyping keep an engineering society at the bleeding edge of technological evolution.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    232,
    'opt_1',
    'Under tight deadlines, disciplined engineers prioritize core stability, defensive fallbacks, and transparent communication over chaotic panic.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    233,
    'opt_1',
    'High-performing teams actively solicit input from all voices, ensuring psychological safety and discovering innovative insights from diverse team members.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    234,
    'opt_1',
    'Mistakes happen in engineering labs. Immediate honesty, intellectual accountability, and learning how to protect circuits build trust and competence.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    235,
    'opt_1',
    'The strength of Zairza lies in compounding institutional knowledge: documented solutions turn individual discoveries into club-wide superpowers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    236,
    'opt_1',
    'Effective leadership empowers team members, aligns tasks with personal growth goals, and fosters clear milestone tracking.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    237,
    'opt_1',
    'Professional engineering conflicts are resolved through objective architectural requirements and data-driven trade-offs, not personal pride.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    238,
    'opt_1',
    'Proactive problem solving and establishing sustainable organizational systems protect valuable shared club hardware.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    239,
    'opt_1',
    'Empathetic code reviews provide constructive guidance, explain the "why" behind best practices, and build confidence in aspiring junior developers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    240,
    'opt_1',
    'Zairza stands for curiosity, open-door mentorship, creative boldness, and a collaborative brotherhood/sisterhood of engineers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    241,
    'opt_1',
    'Induction into Zairza is a commitment to passion, first-principles creation, and pushing the boundaries of what student engineers can build.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    242,
    'opt_1',
    'High-tempo engineers manage stress through realistic triage, ruthless focus, and eliminating peripheral distractions.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    243,
    'opt_1',
    'Constructive two-way feedback between juniors and seniors fosters continuous organizational improvement and mutual respect.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    244,
    'opt_1',
    'A secure and mature engineer celebrates peers’ triumphs, recognizing that rising tides lift the entire community.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    245,
    'opt_1',
    'Ambiguous real-world engineering problems are tackled by proactively asking clarifying questions, formulating hypotheses, and validating early prototypes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    246,
    'opt_1',
    'Flagship events are team efforts where every member’s energetic contribution reflects the society’s reputation and hospitality.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    247,
    'opt_1',
    'Debugging endurance requires knowing when to take a cognitive reset, question core assumptions, and use collaborative rubber-duck debugging.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    248,
    'opt_1',
    'Versatile modern innovators understand that industrial design, user experience, and aesthetic polish differentiate great hardware and software products.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    249,
    'opt_1',
    'Sustainable peak performance requires balancing intense sprints with necessary physical recovery and healthy habits.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    250,
    'opt_1',
    'Diversity in team perspectives breeds creative innovation; mutual respect and inclusive camaraderie are non-negotiable club values.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    251,
    'opt_1',
    'Zairza’s enduring legacy is built on a continuum of mentorship: passionate freshers become skilled builders who nurture future cohorts.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    252,
    'opt_1',
    'True engineering excellence is accompanied by humility, gratitude toward mentors, and an eagerness to keep leveling up.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    253,
    'opt_1',
    'Documentation is the bridge between a temporary hack and a lasting engineering contribution that can be built upon by future engineers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    254,
    'opt_1',
    'Engineering resourcefulness (jugaad guided by rigorous design) turns constraints into opportunities for rapid prototyping and innovation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    255,
    'opt_1',
    'Code has no hierarchy; the best engineers care about code correctness and robust engineering over who pointed out the fix.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    256,
    'opt_1',
    'The hallmark of great leaders is creating more leaders; lifting others up is the core responsibility of senior members at Zairza.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    257,
    'opt_1',
    'Persuasion in engineering requires demonstrating pragmatic value, offering to shoulder the setup burden, and respecting team velocity.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    258,
    'opt_1',
    'Rejection is redirection; analyzing gaps in validation and market fit turns early grant setbacks into compelling future pitches.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    259,
    'opt_1',
    'Hardware laboratory safety is paramount: verifying wiring with multimeters and respecting chemical LiPo power safety protect human lives and equipment.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    260,
    'opt_1',
    'Being a Zairzite is defined by curiosity, craftsmanship, camaraderie, and turning bold ideas into reality: Wonder • Think • Create.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;
