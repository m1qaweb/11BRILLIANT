-- ============================================================================
-- IMPORT HISTORY QUESTIONS - 20 Questions
-- Run this in Supabase SQL Editor after FIX_ALL_SUBJECTS.sql
-- ============================================================================

BEGIN;

-- Get the history lesson ID
DO $$
DECLARE
  hist_lesson_id uuid;
BEGIN
  SELECT id INTO hist_lesson_id FROM lessons WHERE slug = 'hist-7-basics';
  
  IF hist_lesson_id IS NULL THEN
    RAISE EXCEPTION 'History lesson not found! Run FIX_ALL_SUBJECTS.sql first.';
  END IF;
  
  RAISE NOTICE 'History Lesson ID: %', hist_lesson_id;
  
  -- Store in temp table for use in subsequent statements
  CREATE TEMP TABLE temp_hist_lesson AS SELECT hist_lesson_id as lesson_id;
END $$;

-- Question 1: ვინ არის ისტორიკოსი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'ვინ არის ისტორიკოსი?', 1, 1
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ადამიანი, რომელიც მხოლოდ გეოგრაფიას სწავლობს', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ადამიანი, რომელიც წარსულ მოვლენებს იკვლევს', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) ადამიანი, რომელიც მათემატიკას ასწავლის', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) ადამიანი, რომელიც ფიზიკით ინტერესდება', false, 3 FROM new_question;

-- Question 2: რა არის ქრონოლოგია?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის ქრონოლოგია?', 1, 2
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მოვლენების სიახლეების მიხედვით დალაგება', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მოვლენების დალაგება სივრცის მიხედვით', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ისტორიული მოვლენების დალაგება დროის მიხედვით', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ პიროვნებების სიის შედგენა', false, 3 FROM new_question;

-- Question 3: რომელ საუკუნეებში ცხოვრობდა დავით აღმაშენებელი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელ საუკუნეებში ცხოვრობდა დავით აღმაშენებელი?', 2, 3
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) IX–X', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) X–XI', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) XI–XII', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) XII–XIII', false, 3 FROM new_question;

-- Question 4: რა ეწოდება პერიოდს, როცა ადამიანები ქვის იარაღებს იყენებდნენ?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა ეწოდება პერიოდს, როცა ადამიანები ქვის იარაღებს იყენებდნენ?', 1, 4
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ბრინჯაოს ხანა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) რკინის ხანა', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ქვის ხანა', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) ახალი ხანა', false, 3 FROM new_question;

-- Question 5: რომელ საუკუნეში გახდა ქრისტიანობა ოფიციალური სახელმწიფო რელიგია საქართველოში?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელ საუკუნეში გახდა ქრისტიანობა ოფიციალური სახელმწიფო რელიგია საქართველოში?', 2, 5
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) III საუკუნეში', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) IV საუკუნეში', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) V საუკუნეში', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) VI საუკუნეში', false, 3 FROM new_question;

-- Question 6: რა არის სამეფო?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის სამეფო?', 1, 6
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) რესპუბლიკური მმართობის ფორმა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მმართველობის ფორმა, სადაც მეფე ან დედოფალია მონარქი', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) მმართველობის ფორმა, სადაც პრეზიდენტია მთავარი', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) თვითმმართველი ქალაქი', false, 3 FROM new_question;

-- Question 7: რომელია საქართველოს ისტორიული დედაქალაქი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელია საქართველოს ისტორიული დედაქალაქი?', 2, 7
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ბათუმი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ქუთაისი', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) მცხეთა', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) რუსთავი', false, 3 FROM new_question;

-- Question 8: რა არის სამართლებრივი კოდექსი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის სამართლებრივი კოდექსი?', 1, 8
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ზღაპრების კრებული', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ისტორიული ქრონიკა', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) კანონთა კრებული', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) ლექსების წიგნი', false, 3 FROM new_question;

-- Question 9: რომელი იმპერია დაეუფლა საქართველოს დიდ ნაწილს XIX საუკუნეში?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი იმპერია დაეუფლა საქართველოს დიდ ნაწილს XIX საუკუნეში?', 2, 9
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ოსმალეთის იმპერია', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ბრიტანეთის იმპერია', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) რუსეთის იმპერია', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) რომის იმპერია', false, 3 FROM new_question;

-- Question 10: რა იყო ფეოდალიზმი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა იყო ფეოდალიზმი?', 2, 10
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მხოლოდ მონათმფლობელობა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) სისტემა, სადაც მიწა ეკუთვნოდა ფეოდალებს და გლეხები დამოკიდებულნი იყვნენ მათზე', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) მხოლოდ დემოკრატიული მმართველობა', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ სამხედრო სისტემა', false, 3 FROM new_question;

-- Question 11: რა არის რეფორმა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის რეფორმა?', 1, 11
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) არსებული წესრიგის ძალადობრივი დამხობა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ცვლილება, რომელიც მიზნად ისახავს არსებული სისტემის გაუმჯობესებას', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) უკუსვლა ძველ წესებზე', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ კონსტიტუციის შეცვლა', false, 3 FROM new_question;

-- Question 12: რომელ ქვეყანას უკავშირდება „დიდი ფრანგული რევოლუცია"?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელ ქვეყანას უკავშირდება „დიდი ფრანგული რევოლუცია"?', 2, 12
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) გერმანიას', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) იტალიას', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) საფრანგეთს', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) ინგლისს', false, 3 FROM new_question;

-- Question 13: რა ეწოდება 1914–1918 წლების გლობალურ კონფლიქტს?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა ეწოდება 1914–1918 წლების გლობალურ კონფლიქტს?', 2, 13
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მეორე მსოფლიო ომი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) პირველი მსოფლიო ომი', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) ცივი ომი', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) საუკუნოვანი ომი', false, 3 FROM new_question;

-- Question 14: რა ეწოდება 1939–1945 წლების გლობალურ ომს?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა ეწოდება 1939–1945 წლების გლობალურ ომს?', 2, 14
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მეორე მსოფლიო ომი', true, 0 FROM new_question UNION ALL
SELECT id, 'ბ) პირველი მსოფლიო ომი', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ცივი ომი', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) სამოქალაქო ომი', false, 3 FROM new_question;

-- Question 15: რას ნიშნავს სახელმწიფოს დამოუკიდებლობა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რას ნიშნავს სახელმწიფოს დამოუკიდებლობა?', 2, 15
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) სხვა სახელმწიფოს სრული კონტროლი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) უუფლებობა საერთაშორისო ურთიერთობებში', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) შესაძლებლობა, თვითონ განსაზღვროს თავისი პოლიტიკა გარეშე სახელმწიფოსგან დამოუკიდებლად', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ ეკონომიკური განვითარება', false, 3 FROM new_question;

-- Question 16: რომელ წელს აღადგინა საქართველომ დამოუკიდებლობა XX საუკუნეში საბჭოთა კავშირისგან?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელ წელს აღადგინა საქართველომ დამოუკიდებლობა XX საუკუნეში საბჭოთა კავშირისგან?', 2, 16
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) 1918', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) 1989', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) 1991', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) 1995', false, 3 FROM new_question;

-- Question 17: რა არის რესპუბლიკა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის რესპუბლიკა?', 1, 17
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მმართველობის ფორმა, სადაც მეფეა მთავარი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მმართველობის ფორმა, სადაც ხელისუფლება ხალხის მიერ არჩეული ორგანოებით ხორციელდება', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) ქალაქის თვითმმართველობა', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) სამხედრო დიქტატურა', false, 3 FROM new_question;

-- Question 18: რას ეწოდება წარსულის შესწავლას მატერიალური ნაშთების საშუალებით?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რას ეწოდება წარსულის შესწავლას მატერიალური ნაშთების საშუალებით (ნაგებობები, ნივთები, საფლავები)?', 1, 18
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) გეოლოგია', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) არქეოლოგია', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) სოციოლოგია', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) ფილოლოგია', false, 3 FROM new_question;

-- Question 19: რა არის ქრონიკა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის ქრონიკა?', 1, 19
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) კანონთა კრებული', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ლექსების კრებული', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) მოვლენათა თანმიმდევრული ჩანაწერი დროის მიხედვით', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მითოლოგიური მოთხრობა', false, 3 FROM new_question;

-- Question 20: რატომ არის მნიშვნელოვანი ისტორიის ცოდნა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რატომ არის მნიშვნელოვანი ისტორიის ცოდნა?', 2, 20
  FROM temp_hist_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) რომ ზეპირად ვიცოდეთ თარიღები მხოლოდ', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) რომ წარსულით ვიცხოვროთ', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) რომ გავიგოთ საზოგადოების განვითარება, ვისწავლოთ შეცდომებისგან და უკეთ ვგეგმოთ მომავალი', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) რომ მხოლოდ გამოცდის ჩასაბარებლად ვისწავლოთ', false, 3 FROM new_question;

COMMIT;

-- Verification
SELECT 
  'History Questions Imported:' as status,
  COUNT(*) as count
FROM questions q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.slug = 'hist-7-basics';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully imported 20 History questions!';
END $$;
