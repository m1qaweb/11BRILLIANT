-- ============================================================================
-- DELETE: Three Specific Grade VII Courses
-- Date: 2024-11-19
-- Purpose: Remove Math, Biology, and History courses from Grade 7
-- ============================================================================

BEGIN;

-- Delete the three courses by their slugs
-- This will cascade delete related lessons and questions due to foreign key constraints

DELETE FROM courses 
WHERE slug IN (
    'math-7-fundamentals',
    'biology-7-fundamentals',
    'history-7-fundamentals'
);

-- Verify deletion
SELECT 
    'Courses remaining:' as status,
    COUNT(*) as count 
FROM courses 
WHERE grade_id = 7;

COMMIT;

-- ============================================================================
-- ALTERNATIVE: If you want to keep the courses but unpublish them instead:
-- ============================================================================
-- BEGIN;
-- 
-- UPDATE courses 
-- SET is_published = false
-- WHERE slug IN (
--     'math-7-fundamentals',
--     'biology-7-fundamentals',
--     'history-7-fundamentals'
-- );
-- 
-- COMMIT;
