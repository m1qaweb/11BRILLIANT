-- ============================================================================
-- FIX ALL SUBJECTS - Comprehensive Fix for Missing Questions
-- Date: 2024-11-19
-- Purpose: Ensure ALL subjects have proper data and questions appear
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Update subjects table with correct codes and Georgian names
-- ============================================================================

-- First, check if we need to add missing columns
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS name_ka text;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS name_en text;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS description text;

-- Update or insert each subject individually
DO $$
DECLARE
  subject_exists boolean;
BEGIN
  -- Math
  SELECT EXISTS(SELECT 1 FROM public.subjects WHERE code = 'math') INTO subject_exists;
  IF subject_exists THEN
    UPDATE public.subjects SET name_ka = 'მათემატიკა', name_en = 'Mathematics', description = 'რიცხვები, ალგებრა, გეომეტრია' WHERE code = 'math';
  ELSE
    INSERT INTO public.subjects (code, name_ka, name_en, description) VALUES ('math', 'მათემატიკა', 'Mathematics', 'რიცხვები, ალგებრა, გეომეტრია');
  END IF;

  -- Biology
  SELECT EXISTS(SELECT 1 FROM public.subjects WHERE code = 'bio') INTO subject_exists;
  IF subject_exists THEN
    UPDATE public.subjects SET name_ka = 'ბიოლოგია', name_en = 'Biology', description = 'უჯრედი, ორგანიზმები, ეკოსისტემები' WHERE code = 'bio';
  ELSE
    INSERT INTO public.subjects (code, name_ka, name_en, description) VALUES ('bio', 'ბიოლოგია', 'Biology', 'უჯრედი, ორგანიზმები, ეკოსისტემები');
  END IF;

  -- History
  SELECT EXISTS(SELECT 1 FROM public.subjects WHERE code = 'hist') INTO subject_exists;
  IF subject_exists THEN
    UPDATE public.subjects SET name_ka = 'ისტორია', name_en = 'History', description = 'საქართველოსა და მსოფლიოს ისტორია' WHERE code = 'hist';
  ELSE
    INSERT INTO public.subjects (code, name_ka, name_en, description) VALUES ('hist', 'ისტორია', 'History', 'საქართველოსა და მსოფლიოს ისტორია');
  END IF;

  -- Geography
  SELECT EXISTS(SELECT 1 FROM public.subjects WHERE code = 'geo') INTO subject_exists;
  IF subject_exists THEN
    UPDATE public.subjects SET name_ka = 'გეოგრაფია', name_en = 'Geography', description = 'დედამიწა, კლიმატი, რესურსები' WHERE code = 'geo';
  ELSE
    INSERT INTO public.subjects (code, name_ka, name_en, description) VALUES ('geo', 'გეოგრაფია', 'Geography', 'დედამიწა, კლიმატი, რესურსები');
  END IF;

  -- English
  SELECT EXISTS(SELECT 1 FROM public.subjects WHERE code = 'en_lang') INTO subject_exists;
  IF subject_exists THEN
    UPDATE public.subjects SET name_ka = 'ინგლისური', name_en = 'English', description = 'ინგლისური ენის საფუძვლები' WHERE code = 'en_lang';
  ELSE
    INSERT INTO public.subjects (code, name_ka, name_en, description) VALUES ('en_lang', 'ინგლისური', 'English', 'ინგლისური ენის საფუძვლები');
  END IF;

  -- Georgian
  SELECT EXISTS(SELECT 1 FROM public.subjects WHERE code = 'ka_lang') INTO subject_exists;
  IF subject_exists THEN
    UPDATE public.subjects SET name_ka = 'ქართული', name_en = 'Georgian', description = 'ქართული ენა და ლიტერატურა' WHERE code = 'ka_lang';
  ELSE
    INSERT INTO public.subjects (code, name_ka, name_en, description) VALUES ('ka_lang', 'ქართული', 'Georgian', 'ქართული ენა და ლიტერატურა');
  END IF;
END $$;

-- If slug column exists and code doesn't, copy slug to code
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'slug')
     AND NOT EXISTS (SELECT FROM public.subjects WHERE code IS NOT NULL LIMIT 1) THEN
    UPDATE public.subjects SET code = slug WHERE code IS NULL;
  END IF;
END $$;

-- Add unique constraint on code if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'subjects_code_key' AND conrelid = 'public.subjects'::regclass
  ) THEN
    ALTER TABLE public.subjects ADD CONSTRAINT subjects_code_key UNIQUE (code);
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Verify courses exist for all subjects
-- ============================================================================

-- Add potentially missing columns to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_ka text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description_ka text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS difficulty text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS grade_id smallint;

-- Add potentially missing columns to lessons table
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title_ka text;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS summary_ka text;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS order_index integer;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS estimated_minutes integer;

-- For each subject, ensure there's at least one course
DO $$
DECLARE
  subject_record RECORD;
  course_exists boolean;
BEGIN
  FOR subject_record IN 
    SELECT id, code, name_ka FROM public.subjects WHERE code IS NOT NULL
  LOOP
    -- Check if course exists for this subject
    SELECT EXISTS (
      SELECT 1 FROM public.courses WHERE subject_id = subject_record.id
    ) INTO course_exists;
    
    IF NOT course_exists THEN
      RAISE NOTICE 'Creating course for subject: %', subject_record.name_ka;
      
      -- Create a default course for this subject
      INSERT INTO public.courses (
        subject_id, 
        grade_id, 
        slug, 
        title, 
        title_ka,
        short_description,
        description_ka,
        difficulty,
        is_published
      ) VALUES (
        subject_record.id,
        7, -- Default to grade 7
        subject_record.code || '_course',
        subject_record.name_ka || ' - VII კლასი',
        subject_record.name_ka || ' - VII კლასი',
        subject_record.name_ka || ' - ძირითადი კურსი',
        subject_record.name_ka || ' - ძირითადი კურსი VII კლასისთვის',
        'beginner',
        true
      );
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- STEP 3: Verify lessons exist for all courses
-- ============================================================================

-- For each course without lessons, create a default lesson
DO $$
DECLARE
  course_record RECORD;
  lesson_exists boolean;
BEGIN
  FOR course_record IN 
    SELECT c.id, c.title_ka, c.slug, s.code as subject_code
    FROM public.courses c
    JOIN public.subjects s ON c.subject_id = s.id
  LOOP
    -- Check if lessons exist for this course
    SELECT EXISTS (
      SELECT 1 FROM public.lessons WHERE course_id = course_record.id
    ) INTO lesson_exists;
    
    IF NOT lesson_exists THEN
      RAISE NOTICE 'Creating lesson for course: %', course_record.title_ka;
      
      -- Create a default lesson with subject-specific title
      INSERT INTO public.lessons (
        course_id,
        slug,
        title,
        title_ka,
        summary,
        summary_ka,
        order_index,
        estimated_minutes,
        is_published
      ) VALUES (
        course_record.id,
        course_record.subject_code || '-7-basics',
        'Basics',
        CASE course_record.subject_code
          WHEN 'math' THEN 'მათემატიკის საფუძვლები'
          WHEN 'bio' THEN 'ბიოლოგიის საფუძვლები'
          WHEN 'hist' THEN 'ისტორიის საფუძვლები'
          WHEN 'geo' THEN 'გეოგრაფიის საფუძვლები'
          WHEN 'en_lang' THEN 'ინგლისურის საფუძვლები'
          WHEN 'ka_lang' THEN 'ქართულის საფუძვლები'
          ELSE 'საფუძვლები'
        END,
        'Fundamental concepts',
        'საბაზო კონცეფციები და ძირითადი სავარჯიშოები',
        1,
        20,
        true
      );
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- STEP 4: Update lesson titles to use Georgian fields
-- ============================================================================

-- Copy title to title_ka if title_ka is null
UPDATE public.lessons 
SET title_ka = title 
WHERE title_ka IS NULL AND title IS NOT NULL;

-- Copy summary to summary_ka if summary_ka is null
UPDATE public.lessons 
SET summary_ka = summary 
WHERE summary_ka IS NULL AND summary IS NOT NULL;

-- Update lesson titles to use subject-specific "საფუძვლები" pattern
UPDATE public.lessons l
SET title_ka = CASE 
  WHEN l.slug LIKE 'math-%' THEN 'მათემატიკის საფუძვლები'
  WHEN l.slug LIKE 'bio-%' THEN 'ბიოლოგიის საფუძვლები'
  WHEN l.slug LIKE 'hist-%' THEN 'ისტორიის საფუძვლები'
  WHEN l.slug LIKE 'geo-%' THEN 'გეოგრაფიის საფუძვლები'
  WHEN l.slug LIKE 'en_lang-%' THEN 'ინგლისურის საფუძვლები'
  WHEN l.slug LIKE 'ka_lang-%' THEN 'ქართულის საფუძვლები'
  ELSE l.title_ka
END
WHERE l.title_ka = 'ძირითადი ცნებები' OR l.slug IN ('math-7-basics', 'bio-7-basics', 'hist-7-basics');

-- ============================================================================
-- STEP 5: Verification - Count questions per subject
-- ============================================================================

DO $$
DECLARE
  subject_record RECORD;
  question_count integer;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VERIFICATION: Questions per Subject';
  RAISE NOTICE '========================================';
  
  FOR subject_record IN 
    SELECT s.code, s.name_ka, s.id
    FROM public.subjects s
    WHERE s.code IS NOT NULL
    ORDER BY s.code
  LOOP
    -- Count questions for this subject
    SELECT COUNT(*) INTO question_count
    FROM public.questions q
    JOIN public.lessons l ON q.lesson_id = l.id
    JOIN public.courses c ON l.course_id = c.id
    WHERE c.subject_id = subject_record.id;
    
    RAISE NOTICE '% (%): % questions', 
      subject_record.name_ka, 
      subject_record.code, 
      question_count;
      
    IF question_count = 0 THEN
      RAISE WARNING '⚠️  NO QUESTIONS found for %!', subject_record.name_ka;
    END IF;
  END LOOP;
  
  RAISE NOTICE '========================================';
END $$;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to check the fix)
-- ============================================================================

-- 1. Check all subjects have code
-- SELECT code, name_ka, name_en FROM subjects ORDER BY code;

-- 2. Check all subjects have courses  
-- SELECT s.code, s.name_ka, COUNT(c.id) as course_count
-- FROM subjects s
-- LEFT JOIN courses c ON s.id = c.subject_id
-- GROUP BY s.id, s.code, s.name_ka
-- ORDER BY s.code;

-- 3. Check all courses have lessons
-- SELECT c.title_ka, c.slug, COUNT(l.id) as lesson_count
-- FROM courses c
-- LEFT JOIN lessons l ON c.id = l.course_id
-- WHERE c.is_published = true
-- GROUP BY c.id, c.title_ka, c.slug
-- ORDER BY c.title_ka;

-- 4. Check question distribution
-- SELECT 
--   s.code,
--   s.name_ka,
--   COUNT(DISTINCT c.id) as courses,
--   COUNT(DISTINCT l.id) as lessons,
--   COUNT(q.id) as questions
-- FROM subjects s
-- LEFT JOIN courses c ON s.id = c.subject_id
-- LEFT JOIN lessons l ON c.id = l.course_id
-- LEFT JOIN questions q ON l.id = q.lesson_id
-- GROUP BY s.id, s.code, s.name_ka
-- ORDER BY s.code;
