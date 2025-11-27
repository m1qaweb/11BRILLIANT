-- ============================================================================
-- IMPORT MATH QUESTIONS - 20 Questions
-- Run this in Supabase SQL Editor after FIX_ALL_SUBJECTS.sql
-- ============================================================================

BEGIN;

-- Get the math lesson ID
DO $$
DECLARE
  math_lesson_id uuid;
BEGIN
  SELECT id INTO math_lesson_id FROM lessons WHERE slug = 'math-7-basics';
  
  IF math_lesson_id IS NULL THEN
    RAISE EXCEPTION 'Math lesson not found! Run FIX_ALL_SUBJECTS.sql first.';
  END IF;
  
  RAISE NOTICE 'Math Lesson ID: %', math_lesson_id;
  
  -- Store in temp table for use in subsequent statements
  CREATE TEMP TABLE temp_math_lesson AS SELECT math_lesson_id as lesson_id;
END $$;

-- Question 1: გამოთვალე: 7 + 8 = ?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'გამოთვალე: 7 + 8 = ?', 1, 1
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 13', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 14', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 15', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 16', false, 3 FROM new_question;

-- Question 2: გამოთვალე: 36 − 19 = ?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'გამოთვალე: 36 − 19 = ?', 1, 2
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 15', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 16', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 17', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 18', false, 3 FROM new_question;

-- Question 3: ნინომ იყიდა 3 ფანქარი, თითო 2 ლარი. რამდენი ლარი გადაიხადა სულ?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'ნინომ იყიდა 3 ფანქარი, თითო 2 ლარი. რამდენი ლარი გადაიხადა სულ?', 1, 3
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 5 ლარი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 6 ლარი', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) 7 ლარი', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) 8 ლარი', false, 3 FROM new_question;

-- Question 4: რომელია უფრო დიდი რიცხვი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელია უფრო დიდი რიცხვი?', 2, 4
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 2/3', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 3/5', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 3/4', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 4/7', false, 3 FROM new_question;

-- Question 5: რამდენი გრადუსია სწორი კუთხე?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რამდენი გრადუსია სწორი კუთხე?', 1, 5
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 45°', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 60°', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 90°', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 120°', false, 3 FROM new_question;

-- Question 6: მრგვალი პიცა იყოფა 8 თანაბარ ნაჭრად...
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'მრგვალი პიცა იყოფა 8 თანაბარ ნაჭრად. თუ ბავშვმა ჭამა 3 ნაჭერი, რა ნაწილია ეს პიცისა?', 2, 6
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 2/8', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 3/8', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) 3/6', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) 5/8', false, 3 FROM new_question;

-- Question 7: 25% რომელი ათწილადის ტოლია?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', '25% რომელი ათწილადის ტოლია?', 1, 7
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 0.2', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 0.25', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) 0.3', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) 2.5', false, 3 FROM new_question;

-- Question 8: ბოტასი ღირს 150 ლარი. მაღაზიაში არის 10%-იანი ფასდაკლება...
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'ბოტასი ღირს 150 ლარი. მაღაზიაში არის 10%-იანი ფასდაკლება. რა იქნება ახალი ფასი?', 2, 8
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 135 ლარი', true, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 140 ლარი', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 145 ლარი', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) 130 ლარი', false, 3 FROM new_question;

-- Question 9: გამოთვალე: 6 · 7 = ?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'გამოთვალე: 6 · 7 = ?', 1, 9
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 36', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 40', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 42', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 48', false, 3 FROM new_question;

-- Question 10: გამოთვალე: (40 ÷ 5) · 3 = ?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'გამოთვალე: (40 ÷ 5) · 3 = ?', 2, 10
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 18', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 21', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 24', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 27', false, 3 FROM new_question;

-- Question 11: წიგნი არის 120 გვერდი. მოსწავლე დღეში კითხულობს 15 გვერდს...
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'წიგნი არის 120 გვერდი. მოსწავლე დღეში კითხულობს 15 გვერდს. რამდენ დღეში დაამთავრებს?', 2, 11
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 6 დღე', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 7 დღე', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 8 დღე', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 9 დღე', false, 3 FROM new_question;

-- Question 12: რომელი რიცხვია წყვილი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი რიცხვია წყვილი?', 1, 12
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 37', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 42', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) 51', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) 69', false, 3 FROM new_question;

-- Question 13: სამკუთხედის გვერდებია 3 სმ, 4 სმ და 5 სმ. ეს სამკუთხედი არის მართკუთხა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'სამკუთხედის გვერდებია 3 სმ, 4 სმ და 5 სმ. ეს სამკუთხედი არის მართკუთხა?', 3, 13
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) დიახ, რადგან 3² + 4² = 5²', true, 0 FROM new_question UNION ALL
SELECT id, 'ბ) არა, რადგან 3² + 4² > 5²', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) არა, რადგან 3² + 4² < 5²', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) დიახ, რადგან ყველა გვერდი განსხვავებულია', false, 3 FROM new_question;

-- Question 14: მართკუთხედის სიგრძეა 8 სმ, სიგანე – 5 სმ. პერიმეტრი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'მართკუთხედის სიგრძეა 8 სმ, სიგანე – 5 სმ. პერიმეტრი?', 2, 14
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 13 სმ', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 16 სმ', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 26 სმ', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 40 სმ', false, 3 FROM new_question;

-- Question 15: იმავე მართკუთხედის ფართობი (8 სმ და 5 სმ)?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'იმავე მართკუთხედის ფართობი (8 სმ და 5 სმ)?', 2, 15
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 20 კვ. სმ', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 30 კვ. სმ', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 35 კვ. სმ', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) 40 კვ. სმ', true, 3 FROM new_question;

-- Question 16: გადაწყვიტე განტოლება: x + 7 = 19
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'გადაწყვიტე განტოლება: x + 7 = 19', 2, 16
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) x = 10', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) x = 11', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) x = 12', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) x = 13', false, 3 FROM new_question;

-- Question 17: გადაწყვიტე განტოლება: 5x = 45
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'გადაწყვიტე განტოლება: 5x = 45', 2, 17
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) x = 7', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) x = 8', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) x = 9', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) x = 10', false, 3 FROM new_question;

-- Question 18: კლასში 12 ბიჭი და 18 გოგოა. რა ნაწილია გოგონები კლასის საერთო რაოდენობისა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'კლასში 12 ბიჭი და 18 გოგოა. რა ნაწილია გოგონები კლასის საერთო რაოდენობისა?', 2, 18
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 2/5', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 3/5', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) 3/4', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) 2/3', false, 3 FROM new_question;

-- Question 19: საშუალო არითმეტიკული რიცხვების 4, 7 და 9?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'საშუალო არითმეტიკული რიცხვების 4, 7 და 9?', 2, 19
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 6', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 6.5', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 6.67 (დაახლ.)', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 7', false, 3 FROM new_question;

-- Question 20: რიცხვი 50 გაიზარდა 20%-ით. რა გახდა ახალი რიცხვი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რიცხვი 50 გაიზარდა 20%-ით. რა გახდა ახალი რიცხვი?', 2, 20
  FROM temp_math_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 55', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 58', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 60', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 65', false, 3 FROM new_question;

COMMIT;

-- Verification
SELECT 
  'Math Questions Imported:' as status,
  COUNT(*) as count
FROM questions q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.slug = 'math-7-basics';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully imported 20 Math questions!';
END $$;
