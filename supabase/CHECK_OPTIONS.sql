-- Check if question options exist in database
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check how many questions exist
SELECT COUNT(*) as question_count FROM questions;

-- 2. Check how many options exist
SELECT COUNT(*) as option_count FROM question_options;

-- 3. Check a sample question with its options
SELECT 
    q.id as question_id,
    q.stem_ka,
    q.type,
    q.difficulty_level,
    (
        SELECT COUNT(*) 
        FROM question_options qo 
        WHERE qo.question_id = q.id
    ) as option_count
FROM questions q
ORDER BY q.order_index
LIMIT 5;

-- 4. Check sample options for first question
SELECT 
    qo.id,
    qo.question_id,
    qo.label_ka,
    qo.is_correct,
    qo.order_index
FROM question_options qo
WHERE qo.question_id = (SELECT id FROM questions ORDER BY order_index LIMIT 1)
ORDER BY qo.order_index;

-- 5. Check table structure for question_options
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'question_options'
ORDER BY ordinal_position;

-- 6. Full sample - one question with all options
SELECT 
    q.id,
    q.stem_ka as question_text,
    json_agg(
        json_build_object(
            'id', qo.id,
            'label_ka', qo.label_ka,
            'is_correct', qo.is_correct,
            'order_index', qo.order_index
        ) ORDER BY qo.order_index
    ) as options
FROM questions q
LEFT JOIN question_options qo ON q.id = qo.question_id
WHERE q.lesson_id = (SELECT id FROM lessons WHERE slug = 'biology-7-basics')
GROUP BY q.id, q.stem_ka
LIMIT 1;
