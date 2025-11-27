-- ============================================================================
-- Add Missing Columns to Profiles Table (OPTIONAL)
-- Only run this if you want username, role, timezone columns
-- ============================================================================

-- Add columns if they don't exist
DO $$ 
BEGIN
  -- Add username column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username text UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
    RAISE NOTICE 'Added username column';
  ELSE
    RAISE NOTICE 'username column already exists';
  END IF;

  -- Add role column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'student' CHECK (role IN ('student', 'author', 'admin'));
    CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
    RAISE NOTICE 'Added role column';
  ELSE
    RAISE NOTICE 'role column already exists';
  END IF;

  -- Add timezone column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'timezone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN timezone text DEFAULT 'UTC';
    RAISE NOTICE 'Added timezone column';
  ELSE
    RAISE NOTICE 'timezone column already exists';
  END IF;

  -- Add avatar_url column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url text;
    RAISE NOTICE 'Added avatar_url column';
  ELSE
    RAISE NOTICE 'avatar_url column already exists';
  END IF;

  -- Add bio column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'bio'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN bio text;
    RAISE NOTICE 'Added bio column';
  ELSE
    RAISE NOTICE 'bio column already exists';
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN created_at timestamptz DEFAULT now();
    RAISE NOTICE 'Added created_at column';
  ELSE
    RAISE NOTICE 'created_at column already exists';
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at timestamptz DEFAULT now();
    RAISE NOTICE 'Added updated_at column';
  ELSE
    RAISE NOTICE 'updated_at column already exists';
  END IF;
END $$;

-- Verify
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

SELECT '✅ Profiles table structure updated!' AS status;
