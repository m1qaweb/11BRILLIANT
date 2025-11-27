-- ============================================================================
-- Fix Auth Trigger to Include Gamification Profile
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop and recreate the trigger function to include user_profiles creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  bootstrap_emails text;
  user_role text;
BEGIN
  -- Get bootstrap admin emails from app settings (if available)
  -- For production, manually set admin via SQL after first signup
  user_role := 'student';
  
  -- Insert profile with default role
  INSERT INTO public.profiles (id, display_name, username, role, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Initialize streak record
  INSERT INTO public.streaks (user_id, current_streak_days, longest_streak_days)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Initialize gamification profile
  INSERT INTO public.user_profiles (id, total_xp, current_level, xp_to_next_level)
  VALUES (NEW.id, 0, 1, 100)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Test query (optional - shows what will be created for new users)
DO $$
BEGIN
  RAISE NOTICE 'Auth trigger updated successfully!';
  RAISE NOTICE 'New users will now automatically get:';
  RAISE NOTICE '  1. Profile in profiles table';
  RAISE NOTICE '  2. Streak record in streaks table';
  RAISE NOTICE '  3. Gamification profile in user_profiles table';
END $$;
