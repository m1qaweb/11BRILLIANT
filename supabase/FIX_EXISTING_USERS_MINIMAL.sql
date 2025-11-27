-- ============================================================================
-- STEP 1: Check what columns actually exist
-- ============================================================================

-- Check profiles table structure
SELECT 'Profiles table columns:' AS info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================================================
-- STEP 2: Create profiles with ONLY id and display_name (minimal)
-- ============================================================================

-- This should work regardless of other columns
INSERT INTO public.profiles (id, display_name)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)) as display_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 3: Create streaks
-- ============================================================================

INSERT INTO public.streaks (user_id, current_streak_days, longest_streak_days)
SELECT 
  u.id,
  0,
  0
FROM auth.users u
LEFT JOIN public.streaks s ON u.id = s.user_id
WHERE s.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- STEP 4: Create user_profiles
-- ============================================================================

INSERT INTO public.user_profiles (id, total_xp, current_level, xp_to_next_level)
SELECT 
  u.id,
  0,
  1,
  100
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 5: Verify
-- ============================================================================

SELECT 
  u.email,
  CASE WHEN p.id IS NOT NULL THEN '✅' ELSE '❌' END as has_profile,
  CASE WHEN s.user_id IS NOT NULL THEN '✅' ELSE '❌' END as has_streak,
  CASE WHEN up.id IS NOT NULL THEN '✅' ELSE '❌' END as has_user_profile,
  p.display_name,
  up.current_level,
  up.total_xp
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.streaks s ON u.id = s.user_id
LEFT JOIN public.user_profiles up ON u.id = up.id
ORDER BY u.created_at DESC;

SELECT '✅ Done! Check the results above.' AS status;
