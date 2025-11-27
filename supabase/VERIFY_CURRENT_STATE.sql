-- ============================================================================
-- VERIFY CURRENT STATE - Check subjects, courses, lessons, questions
-- ============================================================================

-- 1. Overview of all subjects
SELECT 
  s.code,
  s.name_ka,
  COUNT(DISTINCT c.id) as courses,
  COUNT(DISTINCT l.id) as lessons,
  COUNT(q.id) as questions
FROM subjects s
LEFT JOIN courses c ON s.id = c.subject_id
LEFT JOIN lessons l ON c.id = l.course_id
LEFT JOIN questions q ON l.id = q.lesson_id
WHERE s.code IS NOT NULL
GROUP BY s.id, s.code, s.name_ka
ORDER BY s.code;

-- 2. Detailed lesson information
SELECT 
  s.code as subject,
  s.name_ka as subject_name,
  l.slug as lesson_slug,
  l.title_ka as lesson_title,
  COUNT(q.id) as question_count
FROM subjects s
JOIN courses c ON s.id = c.subject_id
JOIN lessons l ON c.id = l.course_id
LEFT JOIN questions q ON l.id = q.lesson_id
WHERE s.code IS NOT NULL
GROUP BY s.code, s.name_ka, l.id, l.slug, l.title_ka
ORDER BY s.code, l.slug;

-- 3. Check which lessons exist
SELECT 
  l.id,
  l.slug,
  l.title_ka,
  c.slug as course_slug,
  s.code as subject_code
FROM lessons l
JOIN courses c ON l.course_id = c.id
JOIN subjects s ON c.subject_id = s.id
WHERE s.code IN ('math', 'bio', 'hist', 'geo', 'en_lang', 'ka_lang')
ORDER BY s.code;

-- 4. Check lesson IDs for math, bio, hist
SELECT 
  s.code,
  l.id as lesson_id,
  l.slug as lesson_slug,
  COUNT(q.id) as questions
FROM subjects s
JOIN courses c ON s.id = c.subject_id  
JOIN lessons l ON c.id = l.course_id
LEFT JOIN questions q ON l.id = q.lesson_id
WHERE s.code IN ('math', 'bio', 'hist')
GROUP BY s.code, l.id, l.slug
ORDER BY s.code;
