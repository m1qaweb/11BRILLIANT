-- Check what will be deleted BEFORE running cleanup
-- Run this FIRST to see what will be removed

-- ============================================
-- Lessons that will be KEPT (6 basic lessons)
-- ============================================
SELECT 
    'KEEP' as action,
    l.id,
    l.slug,
    l.title_ka,
    c.slug as course_slug,
    s.code as subject_code,
    COUNT(DISTINCT q.id) as question_count
FROM lessons l
JOIN courses c ON l.course_id = c.id
JOIN subjects s ON c.subject_id = s.id
LEFT JOIN questions q ON q.lesson_id = l.id
WHERE l.slug IN (
    'biology-7-basics',
    'math-7-basics',
    'history-7-basics',
    'geography-7-basics',
    'english-7-basics',
    'georgian-7-basics'
)
GROUP BY l.id, l.slug, l.title_ka, c.slug, s.code
ORDER BY s.code;

-- ============================================
-- Lessons that will be DELETED
-- ============================================
SELECT 
    'DELETE' as action,
    l.id,
    l.slug,
    l.title_ka,
    c.slug as course_slug,
    s.code as subject_code,
    COUNT(DISTINCT q.id) as question_count
FROM lessons l
JOIN courses c ON l.course_id = c.id
JOIN subjects s ON c.subject_id = s.id
LEFT JOIN questions q ON q.lesson_id = l.id
WHERE l.slug NOT IN (
    'biology-7-basics',
    'math-7-basics',
    'history-7-basics',
    'geography-7-basics',
    'english-7-basics',
    'georgian-7-basics'
)
GROUP BY l.id, l.slug, l.title_ka, c.slug, s.code
ORDER BY s.code;

-- ============================================
-- Summary of what will happen
-- ============================================
SELECT 
    'BEFORE CLEANUP' as status,
    (SELECT COUNT(*) FROM lessons) as total_lessons,
    (SELECT COUNT(*) FROM lessons WHERE slug IN (
        'biology-7-basics', 'math-7-basics', 'history-7-basics',
        'geography-7-basics', 'english-7-basics', 'georgian-7-basics'
    )) as lessons_to_keep,
    (SELECT COUNT(*) FROM lessons WHERE slug NOT IN (
        'biology-7-basics', 'math-7-basics', 'history-7-basics',
        'geography-7-basics', 'english-7-basics', 'georgian-7-basics'
    )) as lessons_to_delete,
    (SELECT COUNT(*) FROM questions) as total_questions,
    (SELECT COUNT(*) FROM questions WHERE lesson_id IN (
        SELECT id FROM lessons WHERE slug IN (
            'biology-7-basics', 'math-7-basics', 'history-7-basics',
            'geography-7-basics', 'english-7-basics', 'georgian-7-basics'
        )
    )) as questions_to_keep,
    (SELECT COUNT(*) FROM questions WHERE lesson_id IN (
        SELECT id FROM lessons WHERE slug NOT IN (
            'biology-7-basics', 'math-7-basics', 'history-7-basics',
            'geography-7-basics', 'english-7-basics', 'georgian-7-basics'
        )
    )) as questions_to_delete;
