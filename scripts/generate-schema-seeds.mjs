import fs from 'fs';
import { INITIAL_QUESTIONS, QUIZ_CONFIG } from '../src/data/mockQuizData.js';

let sql = `
-- ============================================================================
-- SEED DATA: QUIZ CONFIGURATION & 30 QUESTIONS ACROSS 3 PARTS
-- ============================================================================

INSERT INTO public.quiz_config (
    id, title, oa_start_epoch, oa_end_epoch, registration_cutoff, 
    duration_minutes, total_questions, marks_per_question, negative_mark, 
    max_violations_allowed, is_live
) VALUES (
    'induction_2026',
    '${QUIZ_CONFIG.title}',
    '${QUIZ_CONFIG.oaStartEpoch}',
    '${QUIZ_CONFIG.oaEndEpoch}',
    '${QUIZ_CONFIG.registrationCutoffEpoch}',
    ${QUIZ_CONFIG.durationMinutes},
    ${QUIZ_CONFIG.totalQuestions},
    ${QUIZ_CONFIG.marksPerQuestion},
    ${QUIZ_CONFIG.negativeMark},
    ${QUIZ_CONFIG.maxViolationsAllowed},
    true
) ON CONFLICT (id) DO UPDATE SET
    oa_start_epoch = EXCLUDED.oa_start_epoch,
    oa_end_epoch = EXCLUDED.oa_end_epoch,
    registration_cutoff = EXCLUDED.registration_cutoff,
    updated_at = NOW();

`;

INITIAL_QUESTIONS.forEach((q) => {
  const optionsJson = JSON.stringify(q.options).replace(/'/g, "''");
  const prompt = q.prompt.replace(/'/g, "''");
  const explanation = (q.explanation || '').replace(/'/g, "''");
  const sectionTitle = q.sectionTitle.replace(/'/g, "''");

  sql += `INSERT INTO public.quiz_questions (id, section, section_title, prompt, options, correct_option_id, explanation, is_active)
VALUES (
    ${q.id},
    '${q.section}',
    '${sectionTitle}',
    '${prompt}',
    '${optionsJson}'::jsonb,
    '${q.correctOptionId}',
    '${explanation}',
    true
) ON CONFLICT (id) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options,
    correct_option_id = EXCLUDED.correct_option_id,
    explanation = EXCLUDED.explanation;

`;
});

const existingSchema = fs.readFileSync('supabase/schema.sql', 'utf8');
const finalSchema = existingSchema.split('-- ============================================================================\n-- SEED DATA')[0] + sql;

fs.writeFileSync('supabase/schema.sql', finalSchema);
console.log('Successfully updated supabase/schema.sql with all 30 questions and quiz config seed!');
