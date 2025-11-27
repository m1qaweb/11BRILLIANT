-- ============================================================================
-- SAFE Auth Trigger (works even if user_profiles table doesn't exist yet)
-- Run this in Supabase SQL Editor
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  bootstrap_emails text;
  user_role text;
BEGIN
  user_role := 'student';
  
  -- Insert profile with default role
  BEGIN
    INSERT INTO public.profiles (id, display_name, username, role, timezone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      user_role,
      COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile: %', SQLERRM;
  END;
  
  -- Initialize streak record
  BEGIN
    INSERT INTO public.streaks (user_id, current_streak_days, longest_streak_days)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create streak: %', SQLERRM;
  END;
  
  -- Initialize gamification profile (if table exists)
  BEGIN
    INSERT INTO public.user_profiles (id, total_xp, current_level, xp_to_next_level)
    VALUES (NEW.id, 0, 1, 100)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user_profile (table may not exist yet): %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify
SELECT 'Trigger function updated with error handling!' AS status;
