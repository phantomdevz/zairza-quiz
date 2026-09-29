import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection to:', url);

const supabase = createClient(url, key);

async function check() {
  try {
    const { data, error } = await supabase.from('candidates').select('*').limit(1);
    if (error) {
      console.log('Query result for candidates table:', error.message, 'Code:', error.code);
    } else {
      console.log('Successfully queried candidates table! Count:', data.length);
    }

    const { data: qData, error: qError } = await supabase.from('quiz_questions').select('*').limit(1);
    if (qError) {
      console.log('Query result for quiz_questions table:', qError.message, 'Code:', qError.code);
    } else {
      console.log('Successfully queried quiz_questions table! Count:', qData.length);
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

check();
