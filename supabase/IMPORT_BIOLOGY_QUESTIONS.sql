-- ============================================================================
-- IMPORT BIOLOGY QUESTIONS - 20 Questions
-- Run this in Supabase SQL Editor after FIX_ALL_SUBJECTS.sql
-- ============================================================================

BEGIN;

-- Get the biology lesson ID
DO $$
DECLARE
  bio_lesson_id uuid;
BEGIN
  SELECT id INTO bio_lesson_id FROM lessons WHERE slug = 'bio-7-basics';
  
  IF bio_lesson_id IS NULL THEN
    RAISE EXCEPTION 'Biology lesson not found! Run FIX_ALL_SUBJECTS.sql first.';
  END IF;
  
  RAISE NOTICE 'Biology Lesson ID: %', bio_lesson_id;
  
  -- Store in temp table for use in subsequent statements
  CREATE TEMP TABLE temp_bio_lesson AS SELECT bio_lesson_id as lesson_id;
END $$;

-- Question 1: რა ეწოდება სიცოცხლის უმცირეს სტრუქტურულ ერთეულს?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა ეწოდება სიცოცხლის უმცირეს სტრუქტურულ ერთეულს?', 1, 1
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ორგანო', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) უჯრედი', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) ქსოვილი', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) სისტემა', false, 3 FROM new_question;

-- Question 2: რომელი ორგანო ტუმბავს სისხლს?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი ორგანო ტუმბავს სისხლს?', 1, 2
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ფილტვები', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) კუჭი', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) გული', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) თირკმელი', false, 3 FROM new_question;

-- Question 3: რა არის ფოტოსინთეზის მთავარი მნიშვნელობა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის ფოტოსინთეზის მთავარი მნიშვნელობა?', 2, 3
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მცენარეები შთანთქავენ აზოტს ჰაერიდან', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მცენარეები სინათლის ენერგიას გარდაქმნიან ქიმიურ ენერგიად და წარმოქმნიან ორგანულ ნივთიერებებსა და ჟანგბადს', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) ცხოველები შთანთქავენ ჟანგბადს', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) მცენარეები მხოლოდ წყალს აორთქლებენ', false, 3 FROM new_question;

-- Question 4: რომელი ორგანო მონაწილეობს სუნთქვაში?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი ორგანო მონაწილეობს სუნთქვაში?', 1, 4
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ფილტვები', true, 0 FROM new_question UNION ALL
SELECT id, 'ბ) თირკმელები', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ნაწლავები', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) კუჭი', false, 3 FROM new_question;

-- Question 5: რა ფუნქცია აქვს ტვინს?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა ფუნქცია აქვს ტვინს?', 2, 5
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მხოლოდ სუნთქვის რეგულაცია', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მხოლოდ საჭმლის მონელება', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ორგანიზმის პროცესების რეგულაცია და ნერვული იმპულსების მართვა', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ სისხლის ფორმირება', false, 3 FROM new_question;

-- Question 6: რა არის ეკოსისტემა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის ეკოსისტემა?', 2, 6
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მხოლოდ ცხოველთა ჯგუფი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მხოლოდ მცენარეთა გაერთიანება', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ცოცხალი ორგანიზმებისა და მათი არაცოცხალი გარემოს ერთიანი სისტემა', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ წყლის სივრცე', false, 3 FROM new_question;

-- Question 7: რა ეწოდება ორგანიზმების ჯგუფს, რომლებიც ერთმანეთთან შეჯვარებით ნაყოფიერ შთამომავლობას იძლევიან?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა ეწოდება ორგანიზმების ჯგუფს, რომლებიც ერთმანეთთან შეჯვარებით ნაყოფიერ შთამომავლობას იძლევიან?', 2, 7
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ოჯახი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) სახეობა', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) გვარი', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) რიგი', false, 3 FROM new_question;

-- Question 8: რომელი ორგანული ნივთიერებაა გენეტიკური ინფორმაციის მატარებელი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი ორგანული ნივთიერებაა გენეტიკური ინფორმაციის მატარებელი?', 2, 8
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ცილა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ლიპიდი', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) დნმ', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) ნახშირწყალი', false, 3 FROM new_question;

-- Question 9: რა არის მემკვიდრეობა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის მემკვიდრეობა?', 2, 9
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მხოლოდ გარეშე თვისებების შეცვლა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ორგანიზმის უნარი მუდმივად შეიცვალოს გარემოს მიხედვით', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ორგანიზმების უნარი, მშობლის თვისებები გადასცენ შთამომავლობას', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ ასაკთან დაკავშირებული ცვლილებები', false, 3 FROM new_question;

-- Question 10: რომელი სისტემის ნაწილია კუჭი, ნაწლავები, ღვიძლი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი სისტემის ნაწილია კუჭი, ნაწლავები, ღვიძლი?', 1, 10
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) სისხლის მიმოქცევის სისტემა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) სუნთქვის სისტემა', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) საჭმლის მომნელებელი სისტემა', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) გამონაყოფის სისტემა', false, 3 FROM new_question;

-- Question 11: რა არის ჰიგიენა?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის ჰიგიენა?', 1, 11
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მხოლოდ სისუფთავის სიყვარული', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ჯანმრთელობის დაცვისა და დაავადებების პროფილაქტიკის წესებისა და ღონისძიებების ერთობლიობა', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) სპორტული ვარჯიშის პროგრამა', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) დიეტის სპეციალური სახეობა', false, 3 FROM new_question;

-- Question 12: რომელი თანმიმდევრობა აღწერს ჟანგბადის გზას ჰაერიდან უჯრედებამდე?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი თანმიმდევრობა აღწერს ჟანგბადის გზას ჰაერიდან უჯრედებამდე?', 2, 12
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ფილტვები → ჰაერი → სისხლი → უჯრედი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ჰაერი → ფილტვები → სისხლი → უჯრედები', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) ჰაერი → სისხლი → ფილტვები → უჯრედები', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) სისხლი → ფილტვები → ჰაერი → უჯრედები', false, 3 FROM new_question;

-- Question 13: რა მნიშვნელობა ჰქონდა მიკროსკოპის გამოგონებას ბიოლოგიისთვის?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა მნიშვნელობა ჰქონდა მიკროსკოპის გამოგონებას ბიოლოგიისთვის?', 2, 13
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) შესაძლებელი გახდა მხოლოდ დიდი ცხოველების შესწავლა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) შესაძლებელი გახდა უჯრედებისა და მიკროორგანიზმების დეტალური შესწავლა', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) შესაძლებელი გახდა მხოლოდ ძვლების გამოკვლევა', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) მნიშვნელობა არ ჰქონია', false, 3 FROM new_question;

-- Question 14: რა განსხვავებაა მწარმოებელსა და მომხმარებელს შორის?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა განსხვავებაა მწარმოებელსა და მომხმარებელს შორის?', 2, 14
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მწარმოებელი ენერგიას მხოლოდ სძინავს, მომხმარებელი ქმნის საკვებს', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მწარმოებლები თავად ქმნიან ორგანულ საკვებს, მომხმარებლები კი იღებენ მზა საკვებს', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) მომხმარებლები მხოლოდ მცენარეებია', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) მწარმოებლები მხოლოდ ცხოველები არიან', false, 3 FROM new_question;

-- Question 15: რა არის საკვები ჯაჭვი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის საკვები ჯაჭვი?', 2, 15
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მხოლოდ ერთი სახეობის ჯგუფი', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ორგანიზმების რიგი, სადაც ენერგია გადადის ერთი რგოლიდან მეორეში ჭამა-ჭამით', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) უბრალოდ ცხოველთა სია', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) მცენარეთა ნუსხა რეგიონში', false, 3 FROM new_question;

-- Question 16: რომელი ფაქტორებია არაცოცხალი გარემოს ნაწილი?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი ფაქტორებია არაცოცხალი გარემოს ნაწილი?', 1, 16
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) ცხოველები და მცენარეები', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ბაქტერიები და სოკოები', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) სინათლე, ტემპერატურა, ნიადაგი, წყალი', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ ადამიანთა საქმიანობა', false, 3 FROM new_question;

-- Question 17: რატომ უხშირდება სუნთქვა მძიმე ფიზიკური დატვირთვისას?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რატომ უხშირდება სუნთქვა მძიმე ფიზიკური დატვირთვისას?', 2, 17
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) გულს უჭირს მუშაობა', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ფილტვები მცირდება', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) კუნთებს მეტი ჟანგბადი სჭირდებათ და ორგანიზმი სუნთქვას აჩქარებს', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) ტემპერატურა ეცემა', false, 3 FROM new_question;

-- Question 18: რომელი ჩამოთვლილია ვირუსის დახასიათებისთვის?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რომელი ჩამოთვლილია ვირუსის დახასიათებისთვის?', 2, 18
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) უჯრედული ორგანიზმი, დამოუკიდებლად მრავლდება', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) უჯრედული სტრუქტურა არ აქვს, ჰოსტ-უჯრედზეა დამოკიდებული', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) ფოტოსინთეზს ახორციელებს', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ წყალში ცხოვრობს', false, 3 FROM new_question;

-- Question 19: რა არის ბიომრავალფეროვნება?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რა არის ბიომრავალფეროვნება?', 2, 19
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) მხოლოდ ცხოველთა რაოდენობა დედამიწაზე', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) მხოლოდ მცენარეთა სია რეგიონში', false, 1 FROM new_question UNION ALL
SELECT id, 'გ) ცოცხალი ორგანიზმების მრავალფეროვნება სახეობების, ეკოსისტემებისა და გენების დონეზე', true, 2 FROM new_question UNION ALL
SELECT id, 'დ) მხოლოდ გენების რაოდენობა ორგანიზმში', false, 3 FROM new_question;

-- Question 20: რატომ არის მნიშვნელოვანი ხელების დაბანა ჭამამდე?
WITH new_question AS (
  INSERT INTO questions (lesson_id, type, stem_ka, difficulty_level, order_index)
  SELECT lesson_id, 'single_choice', 'რატომ არის მნიშვნელოვანი ხელების დაბანა ჭამამდე?', 1, 20
  FROM temp_bio_lesson
  RETURNING id
)
INSERT INTO question_options (question_id, label_ka, is_correct, order_index)
SELECT id, 'ა) რომ ხელები არ გეწვეს', false, 0 FROM new_question UNION ALL
SELECT id, 'ბ) ბაქტერიებისა და ვირუსების მოცილება და დაავადებების პრევენცია', true, 1 FROM new_question UNION ALL
SELECT id, 'გ) მხოლოდ რომ წყალი გაგრილდეს', false, 2 FROM new_question UNION ALL
SELECT id, 'დ) რომ საჭმელი უფრო გემრიელი იყოს', false, 3 FROM new_question;

COMMIT;

-- Verification
SELECT 
  'Biology Questions Imported:' as status,
  COUNT(*) as count
FROM questions q
JOIN lessons l ON q.lesson_id = l.id
WHERE l.slug = 'bio-7-basics';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully imported 20 Biology questions!';
END $$;
