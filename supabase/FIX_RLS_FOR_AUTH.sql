-- ============================================================================
-- Fix RLS Policies for Auth Trigger
-- The trigger needs permission to insert into these tables
-- ============================================================================

-- ============================================================================
-- PROFILES TABLE RLS
-- ============================================================================

-- Enable RLS (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow auth trigger to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Policy 1: Allow service role (trigger) to insert
CREATE POLICY "Allow auth trigger to insert profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy 2: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- STREAKS TABLE RLS
-- ============================================================================

-- Enable RLS
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow auth trigger to insert streaks" ON public.streaks;
DROP POLICY IF EXISTS "Users can view own streak" ON public.streaks;
DROP POLICY IF EXISTS "Users can update own streak" ON public.streaks;

-- Policies
CREATE POLICY "Allow auth trigger to insert streaks"
ON public.streaks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own streak"
ON public.streaks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
ON public.streaks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER_PROFILES TABLE RLS (Gamification)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow auth trigger to insert user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own user_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own user_profile" ON public.user_profiles;

-- Policies
CREATE POLICY "Allow auth trigger to insert user_profiles"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own user_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own user_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'streaks', 'user_profiles')
ORDER BY tablename;

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd AS command,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'streaks', 'user_profiles')
ORDER BY tablename, policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies configured!';
  RAISE NOTICE 'Tables: profiles, streaks, user_profiles';
  RAISE NOTICE 'Auth trigger can now insert during signup';
  RAISE NOTICE 'Users can view/update their own records';
END $$;
