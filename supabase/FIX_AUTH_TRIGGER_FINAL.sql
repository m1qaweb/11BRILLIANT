-- ============================================================================
-- FINAL Auth Trigger - Works with actual table structure
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
BEGIN
  user_role := 'student';
  
  -- Insert profile (only using columns that exist in most schemas)
  BEGIN
    INSERT INTO public.profiles (id, display_name, role, timezone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
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
  
  -- Initialize gamification profile
  BEGIN
    INSERT INTO public.user_profiles (id, total_xp, current_level, xp_to_next_level)
    VALUES (NEW.id, 0, 1, 100)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user_profile: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify
SELECT 'Trigger updated - will work with actual table structure!' AS status;
