-- ============================================================================
-- WORKING IMPORT - No reliance on unique constraints
-- Uses WHERE NOT EXISTS pattern instead of ON CONFLICT
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: CREATE GRADE VII COURSES
-- ============================================================================

DO $$
DECLARE
  v_subject_id uuid;
BEGIN
  -- Math course
  SELECT id INTO v_subject_id FROM subjects WHERE code = 'math';
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'math-7-fundamentals') THEN
    INSERT INTO courses (id, subject_id, grade_id, slug, title_ka, title_en, description_ka, order_index)
    VALUES (
      gen_random_uuid(),
      v_subject_id,
      7,
      'math-7-fundamentals',
      'VII კლასი – მათემატიკა',
      'Grade VII – Mathematics',
      'რიცხვები, ალგებრა, გეომეტრია, პროცენტები და გეომეტრიული ფიგურები',
      1
    );
  END IF;

  -- Biology course
  SELECT id INTO v_subject_id FROM subjects WHERE code = 'bio';
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'biology-7-fundamentals') THEN
    INSERT INTO courses (id, subject_id, grade_id, slug, title_ka, title_en, description_ka, order_index)
    VALUES (
      gen_random_uuid(),
      v_subject_id,
      7,
      'biology-7-fundamentals',
      'VII კლასი – ბიოლოგია',
      'Grade VII – Biology',
      'უჯრედი, ორგანიზმი, ეკოსისტემა და ბიომრავალფეროვნება',
      1
    );
  END IF;

  -- History course
  SELECT id INTO v_subject_id FROM subjects WHERE code = 'hist';
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'history-7-fundamentals') THEN
    INSERT INTO courses (id, subject_id, grade_id, slug, title_ka, title_en, description_ka, order_index)
    VALUES (
      gen_random_uuid(),
      v_subject_id,
      7,
      'history-7-fundamentals',
      'VII კლასი – ისტორია',
      'Grade VII – History',
      'ქრონოლოგია, საქართველოსა და მსოფლიოს ისტორია',
      1
    );
  END IF;

  -- Geography course
  SELECT id INTO v_subject_id FROM subjects WHERE code = 'geo';
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'geography-7-fundamentals') THEN
    INSERT INTO courses (id, subject_id, grade_id, slug, title_ka, title_en, description_ka, order_index)
    VALUES (
      gen_random_uuid(),
      v_subject_id,
      7,
      'geography-7-fundamentals',
      'VII კლასი – გეოგრაფია',
      'Grade VII – Geography',
      'დედამიწა, კონტინენტები, კლიმატი და ბუნებრივი რესურსები',
      1
    );
  END IF;

  -- English course
  SELECT id INTO v_subject_id FROM subjects WHERE code = 'en_lang';
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'english-7-fundamentals') THEN
    INSERT INTO courses (id, subject_id, grade_id, slug, title_ka, title_en, description_ka, order_index)
    VALUES (
      gen_random_uuid(),
      v_subject_id,
      7,
      'english-7-fundamentals',
      'VII კლასი – ინგლისური',
      'Grade VII – English',
      'ლექსიკა, გრამატიკა, წინადადებები და დიალოგები',
      1
    );
  END IF;

  -- Georgian Language course
  SELECT id INTO v_subject_id FROM subjects WHERE code = 'ka_lang';
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'georgian-7-fundamentals') THEN
    INSERT INTO courses (id, subject_id, grade_id, slug, title_ka, title_en, description_ka, order_index)
    VALUES (
      gen_random_uuid(),
      v_subject_id,
      7,
      'georgian-7-fundamentals',
      'VII კლასი – ქართული',
      'Grade VII – Georgian Language',
      'გრამატიკა, ტექსტის ანალიზი და ლიტერატურული ხერხები',
      1
    );
  END IF;

  RAISE NOTICE '✅ Courses created';
END $$;

-- ============================================================================
-- STEP 2: CREATE LESSONS (without ON CONFLICT)
-- ============================================================================

DO $$
DECLARE
  v_course_id uuid;
BEGIN
  -- Math lesson
  SELECT id INTO v_course_id FROM courses WHERE slug = 'math-7-fundamentals';
  IF v_course_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE slug = 'math-7-basics') THEN
    INSERT INTO lessons (id, course_id, slug, title_ka, title_en, order_index, summary_ka, estimated_minutes)
    VALUES (
      gen_random_uuid(),
      v_course_id,
      'math-7-basics',
      'ძირითადი ცნებები',
      'Basic Concepts',
      1,
      'რიცხვები, ოპერაციები, გეომეტრია, პროცენტები',
      20
    );
  END IF;

  -- Biology lesson
  SELECT id INTO v_course_id FROM courses WHERE slug = 'biology-7-fundamentals';
  IF v_course_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE slug = 'biology-7-basics') THEN
    INSERT INTO lessons (id, course_id, slug, title_ka, title_en, order_index, summary_ka, estimated_minutes)
    VALUES (
      gen_random_uuid(),
      v_course_id,
      'biology-7-basics',
      'ბიოლოგიის საფუძვლები',
      'Biology Fundamentals',
      1,
      'უჯრედი, ორგანიზმები, ეკოსისტემები',
      20
    );
  END IF;

  -- History lesson
  SELECT id INTO v_course_id FROM courses WHERE slug = 'history-7-fundamentals';
  IF v_course_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE slug = 'history-7-basics') THEN
    INSERT INTO lessons (id, course_id, slug, title_ka, title_en, order_index, summary_ka, estimated_minutes)
    VALUES (
      gen_random_uuid(),
      v_course_id,
      'history-7-basics',
      'ისტორიის საფუძვლები',
      'History Fundamentals',
      1,
      'ქრონოლოგია, ისტორიული პერიოდები',
      20
    );
  END IF;

  -- Geography lesson
  SELECT id INTO v_course_id FROM courses WHERE slug = 'geography-7-fundamentals';
  IF v_course_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE slug = 'geography-7-basics') THEN
    INSERT INTO lessons (id, course_id, slug, title_ka, title_en, order_index, summary_ka, estimated_minutes)
    VALUES (
      gen_random_uuid(),
      v_course_id,
      'geography-7-basics',
      'გეოგრაფიის საფუძვლები',
      'Geography Fundamentals',
      1,
      'დედამიწა, კონტინენტები, კლიმატი',
      20
    );
  END IF;

  -- English lesson
  SELECT id INTO v_course_id FROM courses WHERE slug = 'english-7-fundamentals';
  IF v_course_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE slug = 'english-7-basics') THEN
    INSERT INTO lessons (id, course_id, slug, title_ka, title_en, order_index, summary_ka, estimated_minutes)
    VALUES (
      gen_random_uuid(),
      v_course_id,
      'english-7-basics',
      'English Basics',
      'English Basics',
      1,
      'ძირითადი ლექსიკა და გრამატიკა',
      20
    );
  END IF;

  -- Georgian lesson
  SELECT id INTO v_course_id FROM courses WHERE slug = 'georgian-7-fundamentals';
  IF v_course_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE slug = 'georgian-7-basics') THEN
    INSERT INTO lessons (id, course_id, slug, title_ka, title_en, order_index, summary_ka, estimated_minutes)
    VALUES (
      gen_random_uuid(),
      v_course_id,
      'georgian-7-basics',
      'ქართული ენის საფუძვლები',
      'Georgian Language Fundamentals',
      1,
      'გრამატიკა, ტექსტის ანალიზი',
      20
    );
  END IF;

  RAISE NOTICE '✅ Lessons created';
END $$;

COMMIT;

-- ============================================================================
-- VERIFICATION & SUMMARY
-- ============================================================================

DO $$
DECLARE
  subject_count integer;
  course_count integer;
  lesson_count integer;
BEGIN
  SELECT COUNT(*) INTO subject_count FROM subjects WHERE code IN ('math', 'bio', 'hist', 'geo', 'en_lang', 'ka_lang');
  SELECT COUNT(*) INTO course_count FROM courses WHERE grade_id = 7;
  SELECT COUNT(*) INTO lesson_count FROM lessons WHERE slug LIKE '%-7-basics';
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════╗';
  RAISE NOTICE '║    🎉 SETUP COMPLETE & VERIFIED!      ║';
  RAISE NOTICE '╚════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Infrastructure Summary:';
  RAISE NOTICE '   ✅ Subjects: % (math, bio, hist, geo, en_lang, ka_lang)', subject_count;
  RAISE NOTICE '   ✅ Grade VII Courses: %', course_count;
  RAISE NOTICE '   ✅ Lessons: %', lesson_count;
  RAISE NOTICE '';
  
  IF course_count >= 6 AND lesson_count >= 6 THEN
    RAISE NOTICE '🎯 READY TO IMPORT 120 QUESTIONS!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 NEXT STEPS:';
    RAISE NOTICE '   1. Open: web-seed-tool.html (double-click)';
    RAISE NOTICE '   2. Process each markdown file:';
    RAISE NOTICE '';
    RAISE NOTICE '🗂️  Lesson Slugs:';
    RAISE NOTICE '   • მათემატიკა.md    → math-7-basics';
    RAISE NOTICE '   • ბიოლოგია.md      → biology-7-basics';
    RAISE NOTICE '   • ისტორია.md       → history-7-basics';
    RAISE NOTICE '   • გეოგრაფია.md     → geography-7-basics';
    RAISE NOTICE '   • ინგლისური.md     → english-7-basics';
    RAISE NOTICE '   • ქართული.md       → georgian-7-basics';
    RAISE NOTICE '';
    RAISE NOTICE '⏱️  Time needed: ~15 minutes';
    RAISE NOTICE '';
    RAISE NOTICE '✨ Verify after import:';
    RAISE NOTICE '   SELECT COUNT(*) FROM questions;  -- Should be 120';
    RAISE NOTICE '   SELECT COUNT(*) FROM question_options;  -- Should be 480';
  ELSE
    RAISE WARNING '⚠️  Expected 6 courses and 6 lessons, got % and %', course_count, lesson_count;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════';
END $$;

-- Show created structure
SELECT 
  s.name_ka as subject,
  c.title_ka as course,
  l.title_ka as lesson,
  l.slug as use_this_slug_in_web_tool
FROM subjects s
JOIN courses c ON s.id = c.subject_id
JOIN lessons l ON c.id = l.course_id
WHERE c.grade_id = 7
ORDER BY s.name_ka;
