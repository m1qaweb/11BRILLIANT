-- Update question 6/10 in math basics lesson
-- Change text from "რამდენი გრადუსია სწორი კუთხე?" to "რომელია მართი კუთხის გრადუსი?"

UPDATE questions
SET stem_ka = 'რომელია მართი კუთხის გრადუსი?'
WHERE stem_ka = 'რამდენი გრადუსია სწორი კუთხე?'
  AND lesson_id IN (
    SELECT id FROM lessons WHERE slug = 'math-7-basics'
  );
