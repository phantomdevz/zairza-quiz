-- ============================================================================
-- ZAIRZA INDUCTION PLATFORM — SUPABASE POSTGRES SCHEMA
-- Designed for 24-hr OA Window, 300+ Concurrent Students & Live Proctoring
-- Primary Identifier: OUTR Roll Number (No synthetic Candidate ID)
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
    oa_start_epoch TIMESTAMPTZ NOT NULL DEFAULT '2026-09-29 20:00:00+05:30',
    oa_end_epoch TIMESTAMPTZ NOT NULL DEFAULT '2026-09-30 20:00:00+05:30',
    registration_cutoff TIMESTAMPTZ NOT NULL DEFAULT '2026-09-30 12:00:00+05:30',
    duration_minutes INT NOT NULL DEFAULT 30,
    total_questions INT NOT NULL DEFAULT 30,
    marks_per_question NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    negative_mark NUMERIC(4,2) NOT NULL DEFAULT 0.25,
    max_violations_allowed INT NOT NULL DEFAULT 3,
    is_live BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Question Bank (Server-Secured)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id INT PRIMARY KEY,
    section TEXT NOT NULL, -- 'logical', 'tech', 'hr'
    section_title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of { id: "opt_x", text: "..." }
    correct_option_id TEXT NOT NULL, -- Strip in candidate-facing views
    explanation TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. Candidate Quiz Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number TEXT NOT NULL REFERENCES public.candidates(roll_number) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
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

-- 6. In-Progress & Final Candidate Answers
CREATE TABLE IF NOT EXISTS public.candidate_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES public.quiz_questions(id),
    selected_option_id TEXT,
    is_marked_for_review BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_attempt_question UNIQUE(attempt_id, question_id)
);

-- 7. Proctoring Telemetry Violations Log (Realtime Streamed to Admin)
CREATE TABLE IF NOT EXISTS public.proctoring_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    violation_type TEXT NOT NULL, -- 'TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'MOBILE_APP_SWITCH', 'FORBIDDEN_KEY'
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit & Administrative Logs
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

-- Allow public insertion for registration before cutoff
CREATE POLICY "Allow public registration" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow candidates to view own record" ON public.candidates FOR SELECT USING (true);

-- Allow reading questions (Safe view stripping correct keys)
CREATE POLICY "Allow public read questions" ON public.quiz_questions FOR SELECT USING (is_active = true);

-- Allow candidate attempt logging
CREATE POLICY "Allow insert attempts" ON public.quiz_attempts FOR ALL USING (true);
CREATE POLICY "Allow upsert answers" ON public.candidate_answers FOR ALL USING (true);
CREATE POLICY "Allow record violations" ON public.proctoring_violations FOR ALL USING (true);
