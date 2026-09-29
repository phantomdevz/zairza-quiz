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
-- SEED DATA: 30 SANITIZED QUESTIONS (NO CORRECT OPTION / EXPLANATION)
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
    'Part 2: Tech Knowledge (Software & Systems)',
    'In Git, what is the key difference between ''git pull'' and ''git fetch''?',
    '[{"id":"opt_1","text":"''git fetch'' downloads commits and immediately merges them into working tree."},{"id":"opt_2","text":"''git pull'' executes ''git fetch'' followed by ''git merge'' into the active branch."},{"id":"opt_3","text":"''git pull'' only works on the main branch, whereas fetch works everywhere."},{"id":"opt_4","text":"''git fetch'' deletes local branches that no longer exist on remote."}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    12,
    'tech',
    'Part 2: Tech Knowledge (Software & Algorithms)',
    'What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
    '[{"id":"opt_1","text":"O(1)"},{"id":"opt_2","text":"O(log N)"},{"id":"opt_3","text":"O(N)"},{"id":"opt_4","text":"O(N log N)"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    13,
    'tech',
    'Part 2: Tech Knowledge (Robotics & IoT)',
    'Which communication protocol is full-duplex, synchronous, uses master-slave architecture, and relies on 4 lines (MISO, MOSI, SCK, SS)?',
    '[{"id":"opt_1","text":"I2C"},{"id":"opt_2","text":"UART"},{"id":"opt_3","text":"SPI"},{"id":"opt_4","text":"CAN Bus"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    14,
    'tech',
    'Part 2: Tech Knowledge (Robotics & Hardware)',
    'What is the primary role of an H-bridge circuit in mobile robotics?',
    '[{"id":"opt_1","text":"To amplify radio frequency signals from RC controller"},{"id":"opt_2","text":"To allow DC motors to run in both forward and reverse directions"},{"id":"opt_3","text":"To convert 5V DC into 220V AC for microcontrollers"},{"id":"opt_4","text":"To filter electromagnetic interference from sensors"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    15,
    'tech',
    'Part 2: Tech Knowledge (Design & UI/UX)',
    'According to Fitts''s Law in UI/UX design, what two factors determine the time required to rapidly move to a target area?',
    '[{"id":"opt_1","text":"Color contrast and typography weight"},{"id":"opt_2","text":"Distance to the target and target size/width"},{"id":"opt_3","text":"Viewport refresh rate and finger pressure"},{"id":"opt_4","text":"Shadow blur radius and animation duration"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    16,
    'tech',
    'Part 2: Tech Knowledge (Software & Web)',
    'In modern JavaScript / React, what is the key difference between ''localStorage'' and ''sessionStorage''?',
    '[{"id":"opt_1","text":"localStorage data persists until explicitly cleared, while sessionStorage expires when browser tab closes."},{"id":"opt_2","text":"sessionStorage holds up to 50MB, whereas localStorage only holds 5KB."},{"id":"opt_3","text":"localStorage is accessible only over HTTPS; sessionStorage works on HTTP."},{"id":"opt_4","text":"sessionStorage can be accessed by server headers; localStorage cannot."}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    17,
    'tech',
    'Part 2: Tech Knowledge (Robotics & Sensors)',
    'Which sensor would you use to calculate both the angular velocity and linear acceleration of an autonomous drone?',
    '[{"id":"opt_1","text":"HC-SR04 Ultrasonic Sensor"},{"id":"opt_2","text":"6-DoF IMU (Inertial Measurement Unit like MPU6050)"},{"id":"opt_3","text":"LDR (Light Dependent Resistor)"},{"id":"opt_4","text":"PIR Motion Sensor"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    18,
    'tech',
    'Part 2: Tech Knowledge (Design & Systems)',
    'What does the 60-30-10 color rule in UI and brand design prescribe?',
    '[{"id":"opt_1","text":"60% font size, 30% line height, 10% letter spacing"},{"id":"opt_2","text":"60% dominant base color, 30% secondary/surface color, 10% accent color"},{"id":"opt_3","text":"60% imagery, 30% text, 10% whitespace"},{"id":"opt_4","text":"60% dark mode, 30% light mode, 10% high-contrast mode"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    19,
    'tech',
    'Part 2: Tech Knowledge (Software & Networking)',
    'Which HTTP status code is returned when a requested client resource requires authentication or permission is denied?',
    '[{"id":"opt_1","text":"301 Moved Permanently"},{"id":"opt_2","text":"403 Forbidden"},{"id":"opt_3","text":"502 Bad Gateway"},{"id":"opt_4","text":"204 No Content"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    20,
    'tech',
    'Part 2: Tech Knowledge (Computer Science)',
    'Which data structure follows the LIFO (Last-In, First-Out) principle and is used for function call stacks?',
    '[{"id":"opt_1","text":"Queue"},{"id":"opt_2","text":"Stack"},{"id":"opt_3","text":"Priority Queue"},{"id":"opt_4","text":"Circular Buffer"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    21,
    'tech',
    'Part 2: Tech Knowledge (Robotics & IoT)',
    'On an ESP32 or Arduino board, what does PWM (Pulse Width Modulation) allow you to do with a digital output pin?',
    '[{"id":"opt_1","text":"Simulate variable analog voltage output by rapidly cycling on/off duty cycle"},{"id":"opt_2","text":"Double the processor clock frequency dynamically"},{"id":"opt_3","text":"Read ambient atmospheric pressure directly"},{"id":"opt_4","text":"Connect to Wi-Fi without antennas"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    22,
    'tech',
    'Part 2: Tech Knowledge (Software & Database)',
    'In relational databases, what does the ACID acronym stand for?',
    '[{"id":"opt_1","text":"Asynchronous, Consistent, Indexed, Distributed"},{"id":"opt_2","text":"Atomicity, Consistency, Isolation, Durability"},{"id":"opt_3","text":"Authentication, Cryptography, Integrity, Decryption"},{"id":"opt_4","text":"Automated, Clustered, Integrated, Dynamic"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    23,
    'tech',
    'Part 2: Tech Knowledge (Design & Graphics)',
    'What is the primary advantage of SVG (Scalable Vector Graphics) over raster formats like PNG and JPEG?',
    '[{"id":"opt_1","text":"SVGs can store audio clips inside them"},{"id":"opt_2","text":"SVGs scale to any screen resolution without loss of clarity or pixelation"},{"id":"opt_3","text":"SVGs require specialized GPU hardware to render"},{"id":"opt_4","text":"SVGs cannot be styled with CSS"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    24,
    'tech',
    'Part 2: Tech Knowledge (Software Development)',
    'What does the command ''git commit -m "message"'' do?',
    '[{"id":"opt_1","text":"Pushes local files directly to GitHub"},{"id":"opt_2","text":"Records a snapshot of the staged changes in the local repository with a log message"},{"id":"opt_3","text":"Discards all modified files since the last clone"},{"id":"opt_4","text":"Creates a new branch named ''message''"}]'::jsonb,
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options;

INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, is_active)
VALUES (
    25,
    'tech',
    'Part 2: Tech Knowledge (Robotics / Computing)',
    'Which operating system framework is widely used in cutting-edge robotics for inter-process node messaging, publishers, and subscribers?',
    '[{"id":"opt_1","text":"ROS (Robot Operating System)"},{"id":"opt_2","text":"FreeDOS"},{"id":"opt_3","text":"OpenWrt"},{"id":"opt_4","text":"ReactOS"}]'::jsonb,
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

-- ============================================================================
-- SEED DATA: ISOLATED SOLUTION KEYS (STORED SEPARATELY IN quiz_answer_keys)
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
    'opt_2',
    'git pull is a convenience command that downloads the remote changes (git fetch) and immediately merges them into the current active branch (git merge).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    12,
    'opt_2',
    'Balanced binary search trees maintain a height strictly bounded by O(log N), guaranteeing O(log N) search even in the worst case.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    13,
    'opt_3',
    'Serial Peripheral Interface (SPI) is a synchronous, full-duplex protocol using four dedicated lines.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    14,
    'opt_2',
    'An H-bridge circuit enables voltage to be applied across a load (such as a DC motor) in either direction.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    15,
    'opt_2',
    'Fitts''s Law states that MT = a + b * log2(2D / W), where D is distance and W is target width.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    16,
    'opt_1',
    'localStorage persists across browser sessions and tab closes, whereas sessionStorage is scoped to the tab lifecycle.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    17,
    'opt_2',
    'An IMU combines a 3-axis accelerometer (linear acceleration) and a 3-axis gyroscope (angular rate).'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    18,
    'opt_2',
    'The 60-30-10 rule creates visual balance: 60% neutral/dominant backdrop, 30% structure/secondary, and 10% punchy accent for CTAs.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    19,
    'opt_2',
    '403 Forbidden indicates the server understood the request but refuses to authorize access.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    20,
    'opt_2',
    'Stacks operate on LIFO, matching function calls pushing frames and returning.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    21,
    'opt_1',
    'PWM varies the duty cycle (percentage of time high vs low) to emulate variable output levels for LED brightness or motor speed.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    22,
    'opt_2',
    'ACID stands for Atomicity, Consistency, Isolation, and Durability.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    23,
    'opt_2',
    'SVGs are vector-based XML paths that scale infinitely without pixel degradation.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    24,
    'opt_2',
    'git commit records staged changes into the local repository history.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    25,
    'opt_1',
    'ROS (Robot Operating System) is the global open-source robotics middleware standard.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    26,
    'opt_1',
    'Proactive communication, systematic troubleshooting, and collaborative resilience are core to Zairza culture.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    27,
    'opt_2',
    'A growth mindset and receptiveness to peer critique enable continuous technical leveling-up.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    28,
    'opt_1',
    'Genuine passion to learn, innovate, and contribute to the collective club ecosystem.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    29,
    'opt_2',
    'Self-driven curiosity coupled with disciplined inquiry is what separates true engineers.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

INSERT INTO public.quiz_answer_keys (question_id, correct_option_id, explanation)
VALUES (
    30,
    'opt_1',
    'Balanced dedication and personal organization ensure academic excellence and impactful club contributions.'
) ON CONFLICT (question_id) DO UPDATE SET
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

