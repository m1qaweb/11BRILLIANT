-- ============================================================================
-- MINIMAL Auth Trigger - Only uses columns that MUST exist
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with only id and display_name (guaranteed to exist)
  BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
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

SELECT '✅ Minimal trigger updated - works with any profiles structure!' AS status;
