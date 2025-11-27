-- ============================================================================
-- Create Missing Profiles for Existing Users
-- Run this to fix users who signed up when the trigger was broken
-- ============================================================================

-- Create profiles for users who don't have one
INSERT INTO public.profiles (id, display_name, username, role, timezone)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)) as display_name,
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)) as username,
  'student' as role,
  COALESCE(u.raw_user_meta_data->>'timezone', 'UTC') as timezone
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Create streaks for users who don't have one
INSERT INTO public.streaks (user_id, current_streak_days, longest_streak_days)
SELECT 
  u.id,
  0 as current_streak_days,
  0 as longest_streak_days
FROM auth.users u
LEFT JOIN public.streaks s ON u.id = s.user_id
WHERE s.user_id IS NULL;

-- Create user_profiles for users who don't have one
INSERT INTO public.user_profiles (id, total_xp, current_level, xp_to_next_level)
SELECT 
  u.id,
  0 as total_xp,
  1 as current_level,
  100 as xp_to_next_level
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE up.id IS NULL;

-- Verify all users now have complete records
SELECT 
  u.email,
  u.created_at,
  CASE WHEN p.id IS NOT NULL THEN '✅' ELSE '❌' END as has_profile,
  CASE WHEN s.user_id IS NOT NULL THEN '✅' ELSE '❌' END as has_streak,
  CASE WHEN up.id IS NOT NULL THEN '✅' ELSE '❌' END as has_user_profile
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.streaks s ON u.id = s.user_id
LEFT JOIN public.user_profiles up ON u.id = up.id
ORDER BY u.created_at DESC;

DO $$
BEGIN
  RAISE NOTICE '✅ Fixed all existing users!';
  RAISE NOTICE 'Check the table above - all should show ✅✅✅';
  RAISE NOTICE 'Refresh your app and try again!';
END $$;
