-- Clean database - keep only the 6 basic lessons with 120 questions
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Check what will be deleted
-- ============================================

-- See all lessons (to verify which will be deleted)
SELECT 
    id,
    slug,
    title_ka,
    course_id,
    (SELECT COUNT(*) FROM questions WHERE lesson_id = lessons.id) as question_count
FROM lessons
ORDER BY slug;

-- PAUSE HERE - Review the output above
-- The 6 lessons to KEEP are:
-- - biology-7-basics
-- - math-7-basics
-- - history-7-basics
-- - geography-7-basics
-- - english-7-basics
-- - georgian-7-basics

-- ============================================
-- STEP 2: Delete questions NOT in the 6 basic lessons
-- ============================================

DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete question_options for questions outside the 6 basic lessons
    DELETE FROM question_options
    WHERE question_id IN (
        SELECT q.id
        FROM questions q
        JOIN lessons l ON q.lesson_id = l.id
        WHERE l.slug NOT IN (
            'biology-7-basics',
            'math-7-basics',
            'history-7-basics',
            'geography-7-basics',
            'english-7-basics',
            'georgian-7-basics'
        )
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ Deleted % question options', deleted_count;
    
    -- Delete questions outside the 6 basic lessons
    DELETE FROM questions
    WHERE lesson_id IN (
        SELECT id
        FROM lessons
        WHERE slug NOT IN (
            'biology-7-basics',
            'math-7-basics',
            'history-7-basics',
            'geography-7-basics',
            'english-7-basics',
            'georgian-7-basics'
        )
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ Deleted % questions', deleted_count;
    
    -- Delete lessons except the 6 basic ones
    DELETE FROM lessons
    WHERE slug NOT IN (
        'biology-7-basics',
        'math-7-basics',
        'history-7-basics',
        'geography-7-basics',
        'english-7-basics',
        'georgian-7-basics'
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE '✓ Deleted % lessons', deleted_count;
    
    RAISE NOTICE '✅ Cleanup complete!';
END $$;

-- ============================================
-- STEP 3: Verify what remains
-- ============================================

-- Check remaining lessons
SELECT 
    l.slug as lesson_slug,
    l.title_ka as lesson_title,
    c.slug as course_slug,
    s.code as subject_code,
    COUNT(q.id) as question_count,
    COUNT(qo.id) as option_count
FROM lessons l
JOIN courses c ON l.course_id = c.id
JOIN subjects s ON c.subject_id = s.id
LEFT JOIN questions q ON q.lesson_id = l.id
LEFT JOIN question_options qo ON qo.question_id = q.id
GROUP BY l.id, l.slug, l.title_ka, c.slug, s.code
ORDER BY s.code;

-- Summary counts
SELECT 
    (SELECT COUNT(*) FROM lessons) as total_lessons,
    (SELECT COUNT(*) FROM questions) as total_questions,
    (SELECT COUNT(*) FROM question_options) as total_options;

-- Expected result:
-- total_lessons: 6
-- total_questions: 120 (20 per lesson)
-- total_options: 480 (4 per question)
