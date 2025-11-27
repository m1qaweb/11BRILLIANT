-- ============================================================================
-- MIGRATION: Add Grades and Question Options
-- Date: 2024-11-19
-- Purpose: Support grade-level organization (I-IX) and MCQ option storage
-- 
-- Changes:
-- 1. Create `grades` table (9 grades from I კლასი to IX კლასი)
-- 2. Create `question_options` table (for MCQ choices)
-- 3. Add `grade_id` to `courses` table (link courses to grades)
-- 4. Create indexes for performance
-- 5. Set up RLS policies
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. GRADES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.grades (
  id smallint PRIMARY KEY CHECK (id BETWEEN 1 AND 9),
  label_ka text NOT NULL UNIQUE,
  label_en text NOT NULL UNIQUE,
  age_range text,
  description_ka text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.grades IS 'Georgian school grades (I-IX classes)';
COMMENT ON COLUMN public.grades.label_ka IS 'Georgian label: I კლასი, VII კლასი, etc.';
COMMENT ON COLUMN public.grades.age_range IS 'Typical age range: 6-7, 12-13, etc.';

-- Insert grade data
INSERT INTO public.grades (id, label_ka, label_en, age_range, description_ka) VALUES
  (1, 'I კლასი', 'Grade 1', '6-7', 'დაწყებითი საფეხური'),
  (2, 'II კლასი', 'Grade 2', '7-8', 'დაწყებითი საფეხური'),
  (3, 'III კლასი', 'Grade 3', '8-9', 'დაწყებითი საფეხური'),
  (4, 'IV კლასი', 'Grade 4', '9-10', 'დაწყებითი საფეხური'),
  (5, 'V კლასი', 'Grade 5', '10-11', 'საბაზო საფეხური'),
  (6, 'VI კლასი', 'Grade 6', '11-12', 'საბაზო საფეხური'),
  (7, 'VII კლასი', 'Grade 7', '12-13', 'საბაზო საფეხური'),
  (8, 'VIII კლასი', 'Grade 8', '13-14', 'საბაზო საფეხური'),
  (9, 'IX კლასი', 'Grade 9', '14-15', 'საბაზო საფეხური')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. QUESTION OPTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.question_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  label_ka text NOT NULL,
  label_en text,
  is_correct boolean NOT NULL DEFAULT false,
  order_index smallint NOT NULL,
  explanation_ka text,
  explanation_en text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_question_order UNIQUE(question_id, order_index)
);

COMMENT ON TABLE public.question_options IS 'Multiple choice options for questions';
COMMENT ON COLUMN public.question_options.order_index IS 'Display order: 0=ა, 1=ბ, 2=გ, 3=დ';
COMMENT ON COLUMN public.question_options.explanation_ka IS 'Why this answer is correct/incorrect';

-- ============================================================================
-- 3. UPDATE COURSES TABLE
-- ============================================================================

-- Add grade_id foreign key
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS grade_id smallint REFERENCES public.grades(id);

-- Set default for existing courses
UPDATE public.courses SET grade_id = 7 WHERE grade_id IS NULL;

-- Make grade_id required
ALTER TABLE public.courses ALTER COLUMN grade_id SET NOT NULL;

-- Add Georgian fields to courses if not exist
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title_ka text;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description_ka text;

-- Update existing data (copy from title to title_ka if title_ka is null)
UPDATE public.courses SET title_ka = title WHERE title_ka IS NULL;

-- 3.5. Add Georgian fields to questions table
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS stem_ka text;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS difficulty_level smallint CHECK (difficulty_level BETWEEN 1 AND 3);

-- Copy existing data
UPDATE public.questions SET stem_ka = prompt_md WHERE stem_ka IS NULL;
UPDATE public.questions SET difficulty_level = CASE 
  WHEN difficulty = 'easy' THEN 1
  WHEN difficulty = 'medium' THEN 2
  WHEN difficulty = 'hard' THEN 3
  ELSE 2
END WHERE difficulty_level IS NULL;

-- Add Georgian fields to lessons table  
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title_ka text;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS summary_ka text;

-- Update existing data
UPDATE public.lessons SET title_ka = title WHERE title_ka IS NULL;
UPDATE public.lessons SET summary_ka = summary WHERE summary_ka IS NULL;

-- ============================================================================
-- 4. CREATE INDEXES
-- ============================================================================

-- Courses: filter by subject and grade
CREATE INDEX IF NOT EXISTS idx_courses_subject_grade 
ON public.courses(subject_id, grade_id);

-- Courses: filter by grade only
CREATE INDEX IF NOT EXISTS idx_courses_grade 
ON public.courses(grade_id);

-- Question options: fetch all options for a question
CREATE INDEX IF NOT EXISTS idx_question_options_question_id 
ON public.question_options(question_id);

-- Question options: filter correct answers
CREATE INDEX IF NOT EXISTS idx_question_options_correct 
ON public.question_options(question_id, is_correct);

-- Question options: ordered fetch
CREATE INDEX IF NOT EXISTS idx_question_options_order 
ON public.question_options(question_id, order_index);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

-- Grades: Public read access (everyone can view grades)
DROP POLICY IF EXISTS "Grades are viewable by everyone" ON public.grades;
CREATE POLICY "Grades are viewable by everyone"
  ON public.grades
  FOR SELECT
  USING (true);

-- Question options: Public read access (part of course content)
DROP POLICY IF EXISTS "Question options are viewable by everyone" ON public.question_options;
CREATE POLICY "Question options are viewable by everyone"
  ON public.question_options
  FOR SELECT
  USING (true);

-- Note: Write access to grades/options should be admin-only (handled via service role key)

-- ============================================================================
-- 6. VERIFICATION QUERIES (for testing)
-- ============================================================================

-- Verify grades inserted
DO $$
DECLARE
  grade_count integer;
BEGIN
  SELECT COUNT(*) INTO grade_count FROM public.grades;
  
  IF grade_count = 9 THEN
    RAISE NOTICE '✅ Successfully inserted 9 grades';
  ELSE
    RAISE WARNING '⚠️  Expected 9 grades, found %', grade_count;
  END IF;
END $$;

-- Verify courses have grade_id
DO $$
DECLARE
  courses_without_grade integer;
BEGIN
  SELECT COUNT(*) INTO courses_without_grade 
  FROM public.courses 
  WHERE grade_id IS NULL;
  
  IF courses_without_grade = 0 THEN
    RAISE NOTICE '✅ All courses have grade_id assigned';
  ELSE
    RAISE WARNING '⚠️  Found % courses without grade_id', courses_without_grade;
  END IF;
END $$;

-- Verify question_options table structure
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'question_options'
  ) THEN
    RAISE NOTICE '✅ question_options table created successfully';
  ELSE
    RAISE WARNING '⚠️  question_options table not found';
  END IF;
END $$;

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Run these queries to verify migration:
-- 
-- 1. Check grades:
--    SELECT * FROM grades ORDER BY id;
-- 
-- 2. Check courses with grades:
--    SELECT c.title, g.label_ka, s.title as subject
--    FROM courses c
--    JOIN grades g ON c.grade_id = g.id
--    JOIN subjects s ON c.subject_id = s.id;
-- 
-- 3. Check table structure:
--    \d question_options
--
-- ============================================================================
