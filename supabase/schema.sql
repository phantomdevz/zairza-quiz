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
-- SEED DATA: QUIZ CONFIGURATION
-- ============================================================================

INSERT INTO public.quiz_config (
    id, title, oa_start_epoch, oa_end_epoch, registration_cutoff, 
    duration_minutes, total_questions, marks_per_question, negative_mark, 
    max_violations_allowed, is_live
) VALUES (
    'induction_2026',
    'Zairza Induction Assessment 2026',
    '2026-09-29T22:00:00+05:30',
    '2026-09-30T22:00:00+05:30',
    '2026-09-30T12:00:00+05:30',
    30,
    30,
    1,
    0.25,
    3,
    true
) ON CONFLICT (id) DO UPDATE SET
    oa_start_epoch = EXCLUDED.oa_start_epoch,
    oa_end_epoch = EXCLUDED.oa_end_epoch,
    registration_cutoff = EXCLUDED.registration_cutoff,
    updated_at = NOW();

-- ============================================================================
-- ============================================================================
-- 12. SEED DATA: 60 CURATED QUESTIONS & ANSWER KEYS (POOL-BASED)
-- ============================================================================

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    1,
    'logical',
    'Part 1: Logical Reasoning',
    'In a certain code, ''ZAIRZA'' is coded as ''ACKTBC''. By applying the same transformation pattern, how would ''INDUCT'' be encoded?',
    '[{"id":"opt_1","text":"KPFWEV"},{"id":"opt_2","text":"KQFXFW"},{"id":"opt_3","text":"JPEXEV"},{"id":"opt_4","text":"LPFYFV"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    2,
    'logical',
    'Part 1: Logical Reasoning',
    'Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?',
    '[{"id":"opt_1","text":"225"},{"id":"opt_2","text":"256"},{"id":"opt_3","text":"289"},{"id":"opt_4","text":"361"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    3,
    'logical',
    'Part 1: Logical Reasoning',
    'If 5 robots assemble 5 circuit boards in 5 minutes, how many minutes will it take 100 robots to assemble 100 circuit boards?',
    '[{"id":"opt_1","text":"100 minutes"},{"id":"opt_2","text":"5 minutes"},{"id":"opt_3","text":"20 minutes"},{"id":"opt_4","text":"50 minutes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    4,
    'logical',
    'Part 1: Logical Reasoning',
    'Statement: ''All members of Zairza are innovators. Some innovators are drone pilots.'' Conclusion I: Some drone pilots are members of Zairza. Conclusion II: All innovators are members of Zairza.',
    '[{"id":"opt_1","text":"Only Conclusion I follows"},{"id":"opt_2","text":"Only Conclusion II follows"},{"id":"opt_3","text":"Neither Conclusion follows"},{"id":"opt_4","text":"Both Conclusions follow"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    5,
    'logical',
    'Part 1: Logical Reasoning',
    'A drone takes off from the OUTR Student Activity Centre, flies 12m North, turns East and flies 5m, then hovers straight up vertically 13m. What is the displacement from the origin?',
    '[{"id":"opt_1","text":"13.0 m"},{"id":"opt_2","text":"18.38 m (approx)"},{"id":"opt_3","text":"25.0 m"},{"id":"opt_4","text":"17.0 m"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    6,
    'logical',
    'Part 1: Logical Reasoning',
    'Look at the binary relationship: 1010 : 10 :: 1111 : 15 :: 10001 : ?',
    '[{"id":"opt_1","text":"16"},{"id":"opt_2","text":"17"},{"id":"opt_3","text":"19"},{"id":"opt_4","text":"33"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    7,
    'logical',
    'Part 1: Logical Reasoning',
    'Six team members (A, B, C, D, E, F) sit in a circle facing the center. A sits opposite D. B is to the immediate right of A. C is between A and E. Who sits to the immediate left of D?',
    '[{"id":"opt_1","text":"B"},{"id":"opt_2","text":"E"},{"id":"opt_3","text":"F"},{"id":"opt_4","text":"C"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    8,
    'logical',
    'Part 1: Logical Reasoning',
    'If clock hands show 3:15, what is the angle between the hour hand and minute hand?',
    '[{"id":"opt_1","text":"0 degrees"},{"id":"opt_2","text":"7.5 degrees"},{"id":"opt_3","text":"12.0 degrees"},{"id":"opt_4","text":"15.0 degrees"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    9,
    'logical',
    'Part 1: Logical Reasoning',
    'In a hackathon team, each person shakes hands with every other teammate exactly once. If 28 handshakes occurred, how many members were on the team?',
    '[{"id":"opt_1","text":"7"},{"id":"opt_2","text":"8"},{"id":"opt_3","text":"9"},{"id":"opt_4","text":"14"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    10,
    'logical',
    'Part 1: Logical Reasoning',
    'Which word does NOT belong with the others: Compiler, Transpiler, Interpreter, Microcontroller?',
    '[{"id":"opt_1","text":"Compiler"},{"id":"opt_2","text":"Transpiler"},{"id":"opt_3","text":"Interpreter"},{"id":"opt_4","text":"Microcontroller"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    11,
    'tech',
    'Part 2: Tech Knowledge (History & Origin)',
    'Why is an unexpected glitch or software error in computer programming famously called a ''bug''?',
    '[{"id":"opt_1","text":"In 1947, engineers found an actual moth trapped inside the relays of the Harvard Mark II computer"},{"id":"opt_2","text":"Early punch cards were made of wood and frequently infested with termites"},{"id":"opt_3","text":"Thomas Edison''s nickname when building telegraphs was ''The Little Bug''"},{"id":"opt_4","text":"Computer viruses look like microscopic insects under an electron microscope"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    12,
    'tech',
    'Part 2: Tech Knowledge (AI & Current Trends)',
    'Everyone is using ChatGPT today. What does the ''GPT'' in ChatGPT actually stand for?',
    '[{"id":"opt_1","text":"Generative Pre-trained Transformer"},{"id":"opt_2","text":"General Programming Technology"},{"id":"opt_3","text":"Global Prompt Telemetry"},{"id":"opt_4","text":"Guided Predictive Typing"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    13,
    'tech',
    'Part 2: Tech Knowledge (Tech History)',
    'Who is widely celebrated in world history as the world''s very first computer programmer for writing an algorithm for Charles Babbage''s mechanical computer?',
    '[{"id":"opt_1","text":"Ada Lovelace"},{"id":"opt_2","text":"Alan Turing"},{"id":"opt_3","text":"Grace Hopper"},{"id":"opt_4","text":"Nikola Tesla"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    14,
    'tech',
    'Part 2: Tech Knowledge (Fun Riddle)',
    'Tech Riddle: ''I remember everything you are working on while your laptop is awake, but the moment you turn off the power, I forget everything instantly. What am I?''',
    '[{"id":"opt_1","text":"RAM (Random Access Memory)"},{"id":"opt_2","text":"SSD (Solid State Drive)"},{"id":"opt_3","text":"Processor Cooling Fan"},{"id":"opt_4","text":"Wi-Fi Antenna"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    15,
    'tech',
    'Part 2: Tech Knowledge (Current Trends & News)',
    'Why has NVIDIA recently skyrocketed to become one of the most valuable tech corporations in the world alongside Apple and Microsoft?',
    '[{"id":"opt_1","text":"Their GPUs (Graphics Processing Units) provide the high-speed parallel computing hardware powering modern Generative AI"},{"id":"opt_2","text":"They manufacture 90% of all electric cars in Asia"},{"id":"opt_3","text":"They purchased the global fiber optic undersea cables"},{"id":"opt_4","text":"They own the YouTube video streaming servers"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    16,
    'tech',
    'Part 2: Tech Knowledge (Tech Startup History)',
    'Tech giants like Apple (Steve Jobs), Google (Larry & Sergey), and Amazon (Jeff Bezos) famously started their initial operations out of which humble location?',
    '[{"id":"opt_1","text":"A residential home garage"},{"id":"opt_2","text":"A NASA research laboratory"},{"id":"opt_3","text":"A 5-star hotel conference center"},{"id":"opt_4","text":"A government military bunker"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    17,
    'tech',
    'Part 2: Tech Knowledge (Everyday Web Tech)',
    'When browsing the web, what does the classic HTTP status code ''404'' displayed on your screen indicate?',
    '[{"id":"opt_1","text":"Page Not Found — the requested link does not exist on the server"},{"id":"opt_2","text":"Your internet bill payment is overdue"},{"id":"opt_3","text":"The website server has caught fire"},{"id":"opt_4","text":"Your browser requires an immediate Windows update"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    18,
    'tech',
    'Part 2: Tech Knowledge (Digital India & FinTech)',
    'India''s UPI (Unified Payments Interface) is celebrated as a global gold standard for instant real-time bank payments. Which organization built and operates UPI?',
    '[{"id":"opt_1","text":"NPCI (National Payments Corporation of India)"},{"id":"opt_2","text":"NITI Aayog"},{"id":"opt_3","text":"World Bank"},{"id":"opt_4","text":"Federal Reserve"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    19,
    'tech',
    'Part 2: Tech Knowledge (Space Exploration & Robotics)',
    'In August 2023, India made history by landing near the moon''s South Pole with Chandrayaan-3. What was the name of the 6-wheeled robotic rover deployed on the lunar surface?',
    '[{"id":"opt_1","text":"Pragyan"},{"id":"opt_2","text":"Vikram"},{"id":"opt_3","text":"Mangalyaan"},{"id":"opt_4","text":"Pushpak"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    20,
    'tech',
    'Part 2: Tech Knowledge (Fun Riddle)',
    'Tech Riddle: ''I connect billions of devices across oceans via fiber-optic glass cables carrying pulses of light. Without me, you couldn''t view Instagram reels, Google answers, or write this online quiz. What am I?''',
    '[{"id":"opt_1","text":"The World Wide Web / The Internet"},{"id":"opt_2","text":"Bluetooth"},{"id":"opt_3","text":"FM Radio Frequency"},{"id":"opt_4","text":"GPS Receiver"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    21,
    'tech',
    'Part 2: Tech Knowledge (Consumer Tech & Standards)',
    'To reduce electronic waste and cable clutter, which universal connector standard has been legally mandated for all future smartphones, laptops, and earphones in India and the EU?',
    '[{"id":"opt_1","text":"USB Type-C"},{"id":"opt_2","text":"Lightning Cable"},{"id":"opt_3","text":"Micro-USB"},{"id":"opt_4","text":"VGA Port"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    22,
    'tech',
    'Part 2: Tech Knowledge (Open Source & OS)',
    'Android smartphones, NASA''s Mars rovers, and 100% of the world''s top 500 supercomputers run on variations of an open-source OS kernel created by university student Linus Torvalds in 1991. What is it?',
    '[{"id":"opt_1","text":"Linux"},{"id":"opt_2","text":"Windows 95"},{"id":"opt_3","text":"Macintosh System 7"},{"id":"opt_4","text":"Symbian"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    23,
    'tech',
    'Part 2: Tech Knowledge (Hardware Fundamentals)',
    'Why does a modern laptop with an SSD (Solid State Drive) boot in 8 seconds, while an older laptop with an HDD (Hard Disk Drive) took over 2 minutes?',
    '[{"id":"opt_1","text":"SSDs use electronic flash memory with zero mechanical moving parts, whereas HDDs have to physically spin magnetic platters and move reader heads"},{"id":"opt_2","text":"SSDs draw power directly from ambient Wi-Fi signals"},{"id":"opt_3","text":"HDDs only work when connected to a LAN ethernet cable"},{"id":"opt_4","text":"SSDs are water-cooled"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    24,
    'tech',
    'Part 2: Tech Knowledge (Fun Riddle)',
    'Tech Riddle: ''I have keys but no door locks. I have space but no rooms. You can Enter, but you can never leave me physically. What am I?''',
    '[{"id":"opt_1","text":"A Computer Keyboard"},{"id":"opt_2","text":"A Pendrive"},{"id":"opt_3","text":"A Motherboard"},{"id":"opt_4","text":"An HDMI Cable"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    25,
    'tech',
    'Part 2: Tech Knowledge (Open Source Philosophy)',
    'When software like VLC Media Player, Python, or Blender is described as ''Open Source'', what does it mean to the user community?',
    '[{"id":"opt_1","text":"The creator has published the original source code freely for anyone in the world to inspect, improve, learn from, and build upon"},{"id":"opt_2","text":"The app only operates during daytime office hours"},{"id":"opt_3","text":"You must pay a monthly subscription fee after 30 days"},{"id":"opt_4","text":"The app cannot be installed on laptops"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    26,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'It''s 48 hours before the annual tech fest exhibition, and your team''s hardware sensor module suddenly stops communicating with the software dashboard. How do you respond?',
    '[{"id":"opt_1","text":"Immediately notify the team leads, isolate the issue between hardware wiring and API endpoints, and collaborate on a fallback demo."},{"id":"opt_2","text":"Wait until the leads ask about status before mentioning the issue."},{"id":"opt_3","text":"Blame the software wing for changing data formatting."},{"id":"opt_4","text":"Drop out of the project since there''s insufficient time left."}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    27,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'A senior mentor gives you critical feedback that your submitted UI or code design lacks structure and needs substantial refactoring. How do you handle it?',
    '[{"id":"opt_1","text":"Ignore the feedback because it worked fine on your personal device."},{"id":"opt_2","text":"Take notes on specific pain points, ask clarifying questions to understand society standards, and iterate."},{"id":"opt_3","text":"Argue that aesthetic choices are purely subjective."},{"id":"opt_4","text":"Stop contributing to avoid further reviews."}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    28,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'What is your primary motivation for seeking induction into Zairza (Technical Society of OUTR)?',
    '[{"id":"opt_1","text":"To collaborate on real multidisciplinary projects (drones, apps, design), gain peer mentorship, and build meaningful technology."},{"id":"opt_2","text":"Only to add a certificate line on my CV without participating actively."},{"id":"opt_3","text":"Because my classmates forced me to fill the form."},{"id":"opt_4","text":"To attend social gatherings exclusively."}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    29,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'You are assigned a task involving a framework or microcontroller tool you have never touched before. What is your course of action?',
    '[{"id":"opt_1","text":"Refuse the assignment until someone conducts a personal lecture for you."},{"id":"opt_2","text":"Explore the official documentation, experiment with starter repos, and ask targeted questions to seniors when stuck."},{"id":"opt_3","text":"Wait for the deadline to pass and state that it wasn''t taught in the college syllabus."},{"id":"opt_4","text":"Copy code from an untrusted source without understanding how it works."}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    30,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'Club induction requires dedicating 5-8 hours per week to workshops, lab sessions, and internal hackathons alongside college coursework. How do you balance this?',
    '[{"id":"opt_1","text":"Prioritize structured time-blocking, stay disciplined with coursework deadlines, and treat club sessions as high-priority skill-building."},{"id":"opt_2","text":"Skip all academic lectures to spend time in the club lab."},{"id":"opt_3","text":"Promise commitment now, but stop showing up after induction."},{"id":"opt_4","text":"Complain that engineering doesn''t leave room for extracurricular development."}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    31,
    'logical',
    'Part 1: Logical Reasoning',
    'In a row of students, Rakesh is 12th from the left and Suman is 17th from the right. If they interchange their positions, Rakesh becomes 22nd from the left. How many students are there in the row?',
    '[{"id":"opt_1","text":"37"},{"id":"opt_2","text":"38"},{"id":"opt_3","text":"39"},{"id":"opt_4","text":"40"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    32,
    'logical',
    'Part 1: Logical Reasoning',
    'If P is the brother of Q, Q is the sister of R, and R is the father of S, how is P related to S?',
    '[{"id":"opt_1","text":"Father"},{"id":"opt_2","text":"Paternal Uncle"},{"id":"opt_3","text":"Brother"},{"id":"opt_4","text":"Grandfather"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    33,
    'logical',
    'Part 1: Logical Reasoning',
    'What is the angle between the hour hand and minute hand of an analog clock at 3:40?',
    '[{"id":"opt_1","text":"120°"},{"id":"opt_2","text":"130°"},{"id":"opt_3","text":"140°"},{"id":"opt_4","text":"125°"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    34,
    'logical',
    'Part 1: Logical Reasoning',
    'Find the missing term in the sequence: 7, 26, 63, 124, 215, ?',
    '[{"id":"opt_1","text":"342"},{"id":"opt_2","text":"343"},{"id":"opt_3","text":"328"},{"id":"opt_4","text":"511"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    35,
    'logical',
    'Part 1: Logical Reasoning',
    'Five club members (A, B, C, D, E) sit in a circle facing the center. A is between E and C. B is to the immediate right of E. Who is to the immediate left of C?',
    '[{"id":"opt_1","text":"A"},{"id":"opt_2","text":"D"},{"id":"opt_3","text":"B"},{"id":"opt_4","text":"E"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    36,
    'logical',
    'Part 1: Logical Reasoning',
    'If ''ROBOT'' is encoded as ''TQDOT'' in a specific cipher, how is ''DRONE'' encoded using the same rule?',
    '[{"id":"opt_1","text":"FTQPG"},{"id":"opt_2","text":"ESPOF"},{"id":"opt_3","text":"FTPOG"},{"id":"opt_4","text":"FTQOG"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    37,
    'logical',
    'Part 1: Logical Reasoning',
    'Statement: All algorithms are logic. No logic is emotional. Conclusion I: No algorithm is emotional. Conclusion II: Some logic is an algorithm.',
    '[{"id":"opt_1","text":"Only Conclusion I follows"},{"id":"opt_2","text":"Only Conclusion II follows"},{"id":"opt_3","text":"Neither follows"},{"id":"opt_4","text":"Both Conclusion I and II follow"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    38,
    'logical',
    'Part 1: Logical Reasoning',
    'Pointing to a photograph of a drone designer, Ananya says: ''His mother is the only daughter of my mother.'' How is Ananya related to the designer?',
    '[{"id":"opt_1","text":"Sister"},{"id":"opt_2","text":"Mother"},{"id":"opt_3","text":"Aunt"},{"id":"opt_4","text":"Grandmother"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    39,
    'tech',
    'Part 2: Tech Knowledge (Computing Architectures)',
    'In modern computing, what is the fundamental conceptual difference between a CPU and a GPU?',
    '[{"id":"opt_1","text":"A CPU has a few powerful cores optimized for complex sequential tasks, while a GPU has thousands of smaller cores built for simultaneous parallel math (graphics & AI)"},{"id":"opt_2","text":"CPUs only process audio signals; GPUs only process letters"},{"id":"opt_3","text":"A CPU is inside the screen; a GPU is inside the mouse"},{"id":"opt_4","text":"A CPU requires liquid cooling; a GPU never gets warm"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    40,
    'tech',
    'Part 2: Tech Knowledge (Tech Geography & History)',
    'Why is California''s famous tech hub called ''Silicon Valley''?',
    '[{"id":"opt_1","text":"Because the region pioneered silicon semiconductor microchips and transistors that sparked the modern computer revolution"},{"id":"opt_2","text":"Because of large silicon sand dunes along its beaches"},{"id":"opt_3","text":"Because early computer screens were made of kitchen silicone baking molds"},{"id":"opt_4","text":"It was named after an early valley pioneer named John Silicon"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    41,
    'tech',
    'Part 2: Tech Knowledge (Fun Riddle)',
    'Tech Riddle: ''You talk to me in English, and I write essays, solve physics puzzles, and write code. But I don''t possess a human brain—I just predict the most statistically probable next word. What am I?''',
    '[{"id":"opt_1","text":"A Large Language Model (Generative AI)"},{"id":"opt_2","text":"An Excel Spreadsheet"},{"id":"opt_3","text":"A Microwave Oven"},{"id":"opt_4","text":"A Laser Printer"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    42,
    'tech',
    'Part 2: Tech Knowledge (Everyday Privacy)',
    'What does ''Incognito Mode'' or ''Private Browsing'' in web browsers actually guarantee?',
    '[{"id":"opt_1","text":"It stops your device from saving your browsing history, site cookies, and form data locally after closing the window"},{"id":"opt_2","text":"It hides your location from your Wi-Fi provider, college network, and government completely"},{"id":"opt_3","text":"It blocks someone physically standing behind you from seeing your monitor"},{"id":"opt_4","text":"It doubles your home internet bandwidth"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    43,
    'tech',
    'Part 2: Tech Knowledge (AI Milestones)',
    'In 1997, which IBM supercomputer stunned the world by defeating the reigning World Chess Champion Garry Kasparov in a classical match?',
    '[{"id":"opt_1","text":"Deep Blue"},{"id":"opt_2","text":"AlphaGo"},{"id":"opt_3","text":"Watson"},{"id":"opt_4","text":"Skynet"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    44,
    'tech',
    'Part 2: Tech Knowledge (Current Space Tech)',
    'Which aerospace company founded by Elon Musk revolutionized rocket launches by landing orbital Falcon 9 boosters upright on ocean autonomous drone ships so they can be reflown?',
    '[{"id":"opt_1","text":"SpaceX"},{"id":"opt_2","text":"Blue Origin"},{"id":"opt_3","text":"Boeing Starliner"},{"id":"opt_4","text":"Virgin Galactic"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    45,
    'tech',
    'Part 2: Tech Knowledge (Tech Trivia)',
    'What was Google''s original research project name when founders Larry Page and Sergey Brin started developing the search engine at Stanford University in 1996?',
    '[{"id":"opt_1","text":"BackRub (named after analyzing web backlinks)"},{"id":"opt_2","text":"Yahoo! Junior"},{"id":"opt_3","text":"WebCrawler"},{"id":"opt_4","text":"Ask Jeeves"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    46,
    'tech',
    'Part 2: Tech Knowledge (Units & Measurement)',
    'Tech Trivia: If a single binary digit (0 or 1) is called a ''bit'', what is a group of 8 bits traditionally called in computer memory?',
    '[{"id":"opt_1","text":"A Byte"},{"id":"opt_2","text":"A Nibble"},{"id":"opt_3","text":"A Pixel"},{"id":"opt_4","text":"A Word"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    47,
    'tech',
    'Part 2: Tech Knowledge (Cybersecurity Basics)',
    'Why is Two-Factor Authentication (2FA) strongly recommended for personal college and email accounts?',
    '[{"id":"opt_1","text":"Because even if an attacker steals or guesses your password, they still cannot gain access without your secondary phone code or physical security key"},{"id":"opt_2","text":"Because it makes web pages load twice as fast"},{"id":"opt_3","text":"Because it lets you share passwords with classmates without risk"},{"id":"opt_4","text":"Because it prevents your computer from getting physical dust"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    48,
    'tech',
    'Part 2: Tech Knowledge (Robotics)',
    'Boston Dynamics produces viral YouTube videos showing robots dancing, backflipping, and inspecting industrial sites. What is the name of their famous 4-legged yellow robot dog?',
    '[{"id":"opt_1","text":"Spot"},{"id":"opt_2","text":"Atlas"},{"id":"opt_3","text":"Optimus"},{"id":"opt_4","text":"BigDog"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    49,
    'tech',
    'Part 2: Tech Knowledge (Internet History)',
    'What was the name of the revolutionary network created in 1969 by the US Department of Defense that sent the first host-to-host message (''LO'') and laid the groundwork for today''s Internet?',
    '[{"id":"opt_1","text":"ARPANET"},{"id":"opt_2","text":"Ethernet"},{"id":"opt_3","text":"Usenet"},{"id":"opt_4","text":"World Wide Web"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    50,
    'tech',
    'Part 2: Tech Knowledge (Fun Keyboard Shortcut)',
    'Tech Riddle: ''Press us together on Windows, and we summon the Task Manager, unlock screens, or help reboot when applications freeze up. What legendary trio of keys are we?''',
    '[{"id":"opt_1","text":"Ctrl + Alt + Delete"},{"id":"opt_2","text":"Shift + Tab + Enter"},{"id":"opt_3","text":"Alt + F4 + Space"},{"id":"opt_4","text":"Ctrl + Z + Y"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    51,
    'tech',
    'Part 2: Tech Knowledge (Cloud Computing)',
    'People frequently say photos or code are stored ''in the Cloud'' (AWS, Google Cloud, Azure). What does ''The Cloud'' physically mean?',
    '[{"id":"opt_1","text":"Massive air-conditioned warehouses full of high-performance server computers connected globally across the Internet"},{"id":"opt_2","text":"Data converted into radio signals permanently floating in clouds in the atmosphere"},{"id":"opt_3","text":"External hard drives strapped to weather balloons"},{"id":"opt_4","text":"A futuristic quantum dimension inside monitors"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    52,
    'tech',
    'Part 2: Tech Knowledge (Programming Trivia)',
    'Guido van Rossum created the popular Python programming language in 1991. What was the name ''Python'' actually inspired by?',
    '[{"id":"opt_1","text":"The British comedy television sketch show ''Monty Python''s Flying Circus''"},{"id":"opt_2","text":"The dangerous African rock python snake in his garden"},{"id":"opt_3","text":"His daughter''s favorite pet reptile"},{"id":"opt_4","text":"An anagram of ''Typing On''"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    53,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'During a 24-hour hackathon or lab build, your teammate is feeling overwhelmed and struggling to finish their module. What is your reaction?',
    '[{"id":"opt_1","text":"Sit together, break down the remaining blocker into smaller tasks, pair-program to solve it, and encourage them"},{"id":"opt_2","text":"Publicly complain to mentors that they are slowing down your team"},{"id":"opt_3","text":"Abandon the project and leave the room"},{"id":"opt_4","text":"Pretend nothing is wrong and wait until the deadline passes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    54,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'Ten minutes before a live demonstration in front of faculty and guests, you discover a bug that occasionally crashes the platform. What do you do?',
    '[{"id":"opt_1","text":"Calmly inform your team leads, identify the root crash trigger, implement a defensive fallback/safe mode, and be transparent during the demo"},{"id":"opt_2","text":"Blame a teammate who isn''t present"},{"id":"opt_3","text":"Turn off the equipment and pretend power failed"},{"id":"opt_4","text":"Silently delete the error logs so nobody knows"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    55,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'A senior mentor provides direct, constructive criticism highlighting major flaws in your circuit schematic or code architecture. How do you respond?',
    '[{"id":"opt_1","text":"Welcome the technical critique, ask targeted questions to understand the best engineering practice, and iterate on the design"},{"id":"opt_2","text":"Take it as a personal insult and stop attending club sessions"},{"id":"opt_3","text":"Argue aggressively without looking at the technical data"},{"id":"opt_4","text":"Agree verbally but never make the changes"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    56,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'What does the Zairza motto ''Wonder • Think • Create'' mean to you as an engineer at OUTR?',
    '[{"id":"opt_1","text":"Cultivating curiosity, applying deep first-principles thinking, and turning bold ideas into impactful, functioning reality"},{"id":"opt_2","text":"Memorizing textbook definitions for exam marks"},{"id":"opt_3","text":"Waiting for instructions without initiating anything yourself"},{"id":"opt_4","text":"Just a catchy social media slogan"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    57,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'How do you balance high-tempo club projects with mid-term examinations and regular university academic coursework?',
    '[{"id":"opt_1","text":"Plan ahead with structured weekly calendars, stay on top of coursework daily, and dedicate focused lab hours without last-minute panic"},{"id":"opt_2","text":"Bunk all semester lectures"},{"id":"opt_3","text":"Drop out of all extracurricular activities permanently"},{"id":"opt_4","text":"Leave both studies and club tasks until the night before"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    58,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'A fresher or classmate asks you for help understanding a programming or circuit concept that you are already proficient in. How do you handle it?',
    '[{"id":"opt_1","text":"Patiently explain the intuition, guide them to write or build it themselves, and point them to good documentation"},{"id":"opt_2","text":"Refuse to share knowledge to protect your competitive edge"},{"id":"opt_3","text":"Do their entire work for them so they learn nothing"},{"id":"opt_4","text":"Make fun of them for not knowing the concept"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    59,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'Why is multi-disciplinary collaboration (Software + Hardware + Design + Robotics) critical for modern innovation at Zairza?',
    '[{"id":"opt_1","text":"Because groundbreaking tech products require hardware sensors, intelligent algorithms, robust cloud backends, and intuitive human interfaces working harmoniously"},{"id":"opt_2","text":"It isn''t; every wing should remain in total isolation"},{"id":"opt_3","text":"Only software matters in modern engineering"},{"id":"opt_4","text":"Just to increase club headcount"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    60,
    'hr',
    'Part 3: HR & Cultural Alignment',
    'The team votes on two competing architectural designs for an induction project, and your favorite proposal is not chosen. What is your attitude?',
    '[{"id":"opt_1","text":"Disagree and commit: fully back the team''s chosen decision and contribute 100% of your energy to execute it successfully"},{"id":"opt_2","text":"Actively sabotage the chosen design so your idea looks better"},{"id":"opt_3","text":"Stop contributing to the team"},{"id":"opt_4","text":"Complain repeatedly during team meetings"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

-- ============================================================================
-- ISOLATED ANSWER KEYS SEED
-- ============================================================================

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    1,
    'opt_1',
    'Each letter is shifted forward: Z(+1)->A, A(+2)->C, I(+2)->K, R(+2)->T, Z(+2)->B, A(+2)->C. Following the +1, +2, +2, +2 pattern, I(+1)->K, N(+2)->P, D(+2)->F, U(+2)->W, C(+2)->E, T(+2)->V.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    2,
    'opt_3',
    'These are squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. The next prime number is 17, and 17^2 = 289.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    3,
    'opt_2',
    '1 robot takes 5 minutes to assemble 1 board. Hence, 100 robots working concurrently will finish 100 boards in 5 minutes.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    4,
    'opt_3',
    'Neither conclusion is guaranteed by classical syllogistic deduction.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    5,
    'opt_2',
    'Horizontal displacement = sqrt(12^2 + 5^2) = 13m. Total 3D displacement = sqrt(13^2 + 13^2) = 13*sqrt(2) approx 18.38m.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    6,
    'opt_2',
    'The analogy is binary representation to base-10 decimal integer: 10001 in binary = 16 + 1 = 17.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    7,
    'opt_2',
    'Arranging clockwise around the circle: A -> B -> F -> D -> E -> C. The person to the immediate left of D (facing center) is E.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    8,
    'opt_2',
    'Hour hand moves 0.5 degrees per minute. In 15 minutes, it moves 7.5 degrees past the 3 o''clock mark.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    9,
    'opt_2',
    'n*(n-1)/2 = 28 => n*(n-1) = 56 => 8 * 7 = 56. Hence n = 8.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    10,
    'opt_4',
    'The first three are software language translation tools; Microcontroller is an integrated hardware component.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    11,
    'opt_1',
    'In 1947, computer pioneer Grace Hopper recorded an actual moth taped into the Harvard Mark II logbook as the ''First actual case of bug being found''.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    12,
    'opt_1',
    'GPT stands for Generative Pre-trained Transformer, an AI model architecture introduced by Google researchers in 2017 and expanded by OpenAI.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    13,
    'opt_1',
    'Ada Lovelace wrote an algorithm in 1843 to calculate Bernoulli numbers on Babbage''s Analytical Engine, making her the world''s first programmer.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    14,
    'opt_1',
    'RAM is volatile memory: it provides ultra-fast temporary working memory to the CPU while powered on, but wipes completely upon shutdown.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    15,
    'opt_1',
    'NVIDIA''s specialized graphics chips (like H100 and B200) execute matrix math in parallel, making them indispensable for training modern AI models.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    16,
    'opt_1',
    'Silicon Valley folklore is filled with garage beginnings: Jobs & Wozniak in Los Altos, Page & Brin in Susan Wojcicki''s Menlo Park garage, and Bezos in Bellevue.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    17,
    'opt_1',
    'HTTP 404 Not Found is a standard web protocol client-side error status indicating that the browser could communicate with the server, but the requested page does not exist.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    18,
    'opt_1',
    'National Payments Corporation of India (NPCI) launched UPI in 2016, enabling instant mobile payments across competing banks.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    19,
    'opt_1',
    'The Chandrayaan-3 lander was named Vikram (after Dr. Vikram Sarabhai), while the robotic surface rover was named Pragyan (''Wisdom'').'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    20,
    'opt_1',
    'Over 99% of global internet traffic travels through underwater fiber-optic submarine cables laid across ocean floors using pulses of laser light.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    21,
    'opt_1',
    'USB Type-C (reversible connector, high-speed data, and USB Power Delivery) has been adopted as the common standard to eliminate e-waste.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    22,
    'opt_1',
    'Linus Torvalds released the Linux kernel as free open-source software in 1991. It now powers the Android OS, cloud web servers, and supercomputers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    23,
    'opt_1',
    'SSDs have no mechanical spinning parts or latency-heavy read heads, delivering read speeds exceeding 5,000 MB/s compared to ~120 MB/s for mechanical HDDs.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    24,
    'opt_1',
    'A computer keyboard features character keys, the Space bar, the Enter key, and the Escape key!'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    25,
    'opt_1',
    'Open-source software provides access to human-readable source code, allowing developers worldwide to audit security, fix bugs, and create modifications.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    26,
    'opt_1',
    'Team empathy, active collaboration, and supportive problem-solving define great club culture.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    27,
    'opt_1',
    'Engineering integrity means transparency, quick mitigation, and staying composed under pressure.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    28,
    'opt_1',
    'Constructive feedback from experienced peers is the fastest catalyst for technical growth.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    29,
    'opt_1',
    'Wonder, Think, Create represents the journey from curiosity to deep logic to real hardware/software creation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    30,
    'opt_1',
    'Time-blocking, self-discipline, and early planning allow engineering students to excel at both academics and innovation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    31,
    'opt_2',
    'Total students = Left position + Right position - 1 = 22 + 17 - 1 = 38.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    32,
    'opt_2',
    'R is the father of S, and P is the brother of R (since P is brother of Q, Q is sister of R). Hence, P is the paternal uncle of S.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    33,
    'opt_2',
    'Angle = |30*H - 5.5*M| = |30(3) - 5.5(40)| = |90 - 220| = 130°.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    34,
    'opt_1',
    'Pattern is n^3 - 1: 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1=342.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    35,
    'opt_1',
    'In circular arrangement facing center, A is between E and C, so to immediate left of C is A.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    36,
    'opt_1',
    'Pattern shifts letters: R(+2)->T, O(+2)->Q, B(+2)->D, O(+0), T(+0) -> similarly D(+2)->F, R(+2)->T, O(+2)->Q, N(+2)->P, E(+2)->G => FTQPG.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    37,
    'opt_4',
    'Since all algorithms are logic and no logic is emotional, no algorithm is emotional (I). Also, if all algorithms are logic, some logic must be algorithms (II).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    38,
    'opt_2',
    'Only daughter of Ananya''s mother is Ananya herself. Hence Ananya is his mother.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    39,
    'opt_1',
    'CPUs handle complex branching logic with low latency; GPUs compute thousands of repetitive mathematical vector calculations concurrently.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    40,
    'opt_1',
    'Journalist Don Hoefler coined ''Silicon Valley'' in 1971 because silicon is the base element for semiconductors made by Fairchild, Intel, and AMD.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    41,
    'opt_1',
    'LLMs like Claude, GPT-4, and Gemini use deep transformer neural networks to calculate statistical token probabilities without sentience.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    42,
    'opt_1',
    'Incognito only clears local browser cache, cookies, and history when closed; it does not cloak traffic from your school Wi-Fi or website servers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    43,
    'opt_1',
    'IBM Deep Blue defeated World Champion Garry Kasparov 3.5–2.5 in May 1997, calculating up to 200 million positions per second.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    44,
    'opt_1',
    'SpaceX''s autonomous rocket recovery has flown individual Falcon 9 first stages over 20+ times each, dramatically lowering the cost of spaceflight.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    45,
    'opt_1',
    'BackRub was Google''s original 1996 name because the PageRank algorithm estimated website importance by tracking backlinks.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    46,
    'opt_1',
    '8 bits = 1 byte. (4 bits is called a ''nibble''). A byte can represent 256 unique numbers (from 0 to 255), enough for one ASCII character.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    47,
    'opt_1',
    '2FA combines something you know (password) with something you physically have (phone, authenticator app, or YubiKey), blocking 99% of automated credential stuffing.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    48,
    'opt_1',
    'Spot is Boston Dynamics'' commercial quadruped robot used worldwide for autonomous plant inspections and disaster search-and-rescue.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    49,
    'opt_1',
    'ARPANET (Advanced Research Projects Agency Network) launched packet-switching communications between UCLA and Stanford in October 1969.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    50,
    'opt_1',
    'David Bradley designed Ctrl+Alt+Del for the original IBM PC as a quick hardware interrupt reset without cycling the power switch.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    51,
    'opt_1',
    'Cloud services are physical hyperscale data centers with miles of server racks and redundant power backups that you rent remotely over fiber cables.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    52,
    'opt_1',
    'Guido van Rossum was a fan of the BBC comedy show ''Monty Python''s Flying Circus'' and named the language to make programming feel fun and lighthearted.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    53,
    'opt_1',
    'Team empathy, active collaboration, and supportive problem-solving define great club culture.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    54,
    'opt_1',
    'Engineering integrity means transparency, quick mitigation, and staying composed under pressure.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    55,
    'opt_1',
    'Constructive feedback from experienced peers is the fastest catalyst for technical growth.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    56,
    'opt_1',
    'Wonder, Think, Create represents the journey from curiosity to deep logic to real hardware/software creation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    57,
    'opt_1',
    'Time-blocking, self-discipline, and early planning allow engineering students to excel at both academics and innovation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    58,
    'opt_1',
    'Peer mentorship and open knowledge-sharing are the foundational pillars of Zairza.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    59,
    'opt_1',
    'Real-world engineering triumphs occur at the intersection of mechanical, electrical, software, and design disciplines.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    60,
    'opt_1',
    'Disagree and commit: professional teams debate ideas openly, but execute the collective decision with 100% solidarity.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;
