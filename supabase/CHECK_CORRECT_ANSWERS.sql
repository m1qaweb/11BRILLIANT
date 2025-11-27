-- Check how correct answers are stored in the database
-- This will help diagnose why answer validation might fail

-- 1. Check a sample question with its correct_answer field
SELECT 
    q.id,
    q.stem_ka,
    q.type,
    q.correct_answer,
    json_agg(
        json_build_object(
            'id', qo.id,
            'label_ka', qo.label_ka,
            'is_correct', qo.is_correct,
            'order_index', qo.order_index
        ) ORDER BY qo.order_index
    ) as options
FROM questions q
LEFT JOIN question_options qo ON qo.question_id = q.id
WHERE q.type = 'single_choice'
GROUP BY q.id, q.stem_ka, q.type, q.correct_answer
LIMIT 3;

-- 2. Check if correct_answer field is populated
SELECT 
    COUNT(*) as total_questions,
    COUNT(correct_answer) as questions_with_correct_answer,
    COUNT(*) - COUNT(correct_answer) as questions_without_correct_answer
FROM questions;

-- 3. See what format correct_answer is stored in
SELECT DISTINCT 
    jsonb_typeof(correct_answer) as answer_type,
    correct_answer
FROM questions
WHERE correct_answer IS NOT NULL
LIMIT 5;
