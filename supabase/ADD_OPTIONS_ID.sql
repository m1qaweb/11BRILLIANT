-- Fix missing ID column in question_options table
-- Run this in Supabase SQL Editor if options aren't showing

-- 1. Add id column as primary key with auto-generated UUIDs
ALTER TABLE question_options 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- 2. Backfill existing rows with UUIDs (in case column existed but was null)
UPDATE question_options 
SET id = gen_random_uuid() 
WHERE id IS NULL;

-- 3. Verify all options now have IDs
SELECT 
    COUNT(*) as total_options,
    COUNT(id) as options_with_id,
    COUNT(*) - COUNT(id) as options_without_id
FROM question_options;

-- Expected result: options_without_id should be 0

-- 4. Sample check - see first 3 options with all fields
SELECT id, question_id, label_ka, is_correct, order_index
FROM question_options
ORDER BY order_index
LIMIT 3;
