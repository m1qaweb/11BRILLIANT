-- ============================================================================
-- Debug Auth Issues
-- Run this to check what's missing
-- ============================================================================

-- 1. Check if user_profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
) AS user_profiles_exists;

-- 2. Check profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check if user_profiles table structure (if it exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 4. Check recent auth errors (if you have logging enabled)
-- Look for errors in Supabase Dashboard -> Logs -> Postgres Logs

-- 5. Test the trigger function manually
DO $$
DECLARE
  test_user_id uuid := gen_random_uuid();
BEGIN
  -- Simulate what the trigger does
  BEGIN
    INSERT INTO public.profiles (id, display_name, username, role, timezone)
    VALUES (
      test_user_id,
      'Test User',
      'testuser',
      'student',
      'UTC'
    );
    RAISE NOTICE 'profiles insert: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'profiles insert FAILED: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.streaks (user_id, current_streak_days, longest_streak_days)
    VALUES (test_user_id, 0, 0);
    RAISE NOTICE 'streaks insert: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'streaks insert FAILED: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.user_profiles (id, total_xp, current_level, xp_to_next_level)
    VALUES (test_user_id, 0, 1, 100);
    RAISE NOTICE 'user_profiles insert: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'user_profiles insert FAILED: %', SQLERRM;
  END;

  -- Clean up test data
  DELETE FROM public.user_profiles WHERE id = test_user_id;
  DELETE FROM public.streaks WHERE user_id = test_user_id;
  DELETE FROM public.profiles WHERE id = test_user_id;
  RAISE NOTICE 'Test complete - check messages above for errors';
END $$;
