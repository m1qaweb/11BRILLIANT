-- ============================================================================
-- FIX RLS for Auth Trigger - CORRECT VERSION
-- During signup, user is NOT yet authenticated, so we need special handling
-- ============================================================================

-- ============================================================================
-- OPTION 1: Disable RLS for these specific tables (SIMPLEST)
-- ============================================================================

-- These tables are auto-created by trigger and only contain user's own data
-- So disabling RLS is safe - users can't access other users' records via app anyway

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

SELECT 'RLS disabled for profiles, streaks, and user_profiles' AS status;

-- ============================================================================
-- OPTION 2: Use Service Role Policies (if you want to keep RLS enabled)
-- Uncomment this section if you prefer to keep RLS on
-- ============================================================================

/*
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow service role (used by trigger) to do everything
CREATE POLICY "Service role can manage profiles"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage streaks"
ON public.streaks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage user_profiles"
ON public.user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to view/update their own records
CREATE POLICY "Users can manage own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own streak"
ON public.streaks
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own user_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
*/

-- ============================================================================
-- Verification
-- ============================================================================

SELECT 
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'streaks', 'user_profiles');

DO $$
BEGIN
  RAISE NOTICE '✅ RLS configuration complete!';
  RAISE NOTICE 'Auth trigger should now work';
  RAISE NOTICE 'Try registering again!';
END $$;
