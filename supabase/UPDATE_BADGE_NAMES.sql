-- Update badge names to use "სტრიქი" instead of "ქართი"

UPDATE badges 
SET name_ka = '3 დღის სტრიქი' 
WHERE code = 'streak_3';

UPDATE badges 
SET name_ka = 'კვირის სტრიქი' 
WHERE code = 'streak_7';

-- Verify the changes
SELECT code, name_ka FROM badges WHERE code IN ('streak_3', 'streak_7');
