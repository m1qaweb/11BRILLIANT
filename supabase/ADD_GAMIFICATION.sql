-- Add gamification system: XP, Levels, Badges
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. User Profiles Table (for XP and Level tracking)
-- ============================================

-- Create user_profiles table in public schema
-- Note: We can't modify auth.users (protected), so we use a separate table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  xp_to_next_level INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Badges System
-- ============================================

-- Define all available badges
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- e.g., 'first_correct', 'streak_7', 'master_math'
  name_ka TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ka TEXT,
  description_en TEXT,
  icon TEXT NOT NULL, -- emoji or icon name
  category TEXT NOT NULL, -- 'achievement', 'streak', 'mastery', 'special'
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  xp_required INTEGER DEFAULT 0,
  criteria JSONB, -- conditions to unlock
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's earned badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 100, -- progress toward badge (0-100)
  is_displayed BOOLEAN DEFAULT FALSE, -- show on profile
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- 3. XP History & Transactions
-- ============================================

CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- can be positive or negative
  reason TEXT NOT NULL, -- 'correct_answer', 'lesson_complete', 'streak', 'badge_earned'
  reference_id UUID, -- question_id, lesson_id, badge_id, etc.
  reference_type TEXT, -- 'question', 'lesson', 'course', 'badge'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created ON xp_transactions(created_at DESC);

-- ============================================
-- 4. Level Configuration
-- ============================================

CREATE TABLE IF NOT EXISTS public.levels (
  level INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL, -- cumulative XP to reach this level
  xp_for_next INTEGER NOT NULL, -- XP needed from this level to next
  title_ka TEXT NOT NULL,
  title_en TEXT NOT NULL,
  reward_badge_id UUID REFERENCES badges(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. Seed Initial Data
-- ============================================

-- Insert level configuration (1-50 levels with exponential curve)
INSERT INTO levels (level, xp_required, xp_for_next, title_ka, title_en) VALUES
(1, 0, 100, 'დამწყები', 'Beginner'),
(2, 100, 150, 'მოსწავლე', 'Student'),
(3, 250, 200, 'გულმოდგინე', 'Diligent'),
(4, 450, 250, 'ცოდნის მაძიებელი', 'Knowledge Seeker'),
(5, 700, 300, 'ნიჭიერი', 'Talented'),
(6, 1000, 400, 'გამოცდილი', 'Experienced'),
(7, 1400, 500, 'ექსპერტი', 'Expert'),
(8, 1900, 600, 'მასტერი', 'Master'),
(9, 2500, 750, 'გრანდმასტერი', 'Grandmaster'),
(10, 3250, 1000, 'ლეგენდა', 'Legend'),
(11, 4250, 1250, 'მითი', 'Mythic'),
(12, 5500, 1500, 'ტიტანი', 'Titan'),
(13, 7000, 2000, 'ღვთაებრივი', 'Divine'),
(14, 9000, 2500, 'უკვდავი', 'Immortal'),
(15, 11500, 3000, 'ყოვლისმცოდნე', 'Omniscient')
ON CONFLICT (level) DO NOTHING;

-- Insert badges
INSERT INTO badges (code, name_ka, name_en, description_ka, description_en, icon, category, rarity) VALUES
-- First steps
('first_correct', 'პირველი წარმატება', 'First Success', 'პირველი სწორი პასუხი', 'First correct answer', '🎯', 'achievement', 'common'),
('first_lesson', 'პირველი გაკვეთილი', 'First Lesson', 'პირველი გაკვეთილის დასრულება', 'Complete first lesson', '📚', 'achievement', 'common'),

-- Streak badges
('streak_3', '3 დღის ქართი', '3-Day Streak', '3 დღე ზედიზედ სწავლა', 'Practice 3 days in a row', '🔥', 'streak', 'common'),
('streak_7', 'კვირის ქართი', 'Week Streak', '7 დღე ზედიზედ სწავლა', 'Practice 7 days in a row', '⚡', 'streak', 'rare'),
('streak_30', 'თვის ჩემპიონი', 'Month Champion', '30 დღე ზედიზედ სწავლა', 'Practice 30 days in a row', '🏆', 'streak', 'epic'),

-- Subject mastery
('master_math', 'მათემატიკის მასტერი', 'Math Master', 'ყველა მათემატიკის კითხვა სწორად', 'All math questions correct', '🔢', 'mastery', 'rare'),
('master_bio', 'ბიოლოგიის მასტერი', 'Biology Master', 'ყველა ბიოლოგიის კითხვა სწორად', 'All biology questions correct', '🧬', 'mastery', 'rare'),
('master_hist', 'ისტორიის მასტერი', 'History Master', 'ყველა ისტორიის კითხვა სწორად', 'All history questions correct', '📜', 'mastery', 'rare'),
('master_geo', 'გეოგრაფიის მასტერი', 'Geography Master', 'ყველა გეოგრაფიის კითხვა სწორად', 'All geography questions correct', '🌍', 'mastery', 'rare'),
('master_eng', 'ინგლისურის მასტერი', 'English Master', 'ყველა ინგლისური კითხვა სწორად', 'All English questions correct', '🇬🇧', 'mastery', 'rare'),
('master_ka', 'ქართულის მასტერი', 'Georgian Master', 'ყველა ქართული კითხვა სწორად', 'All Georgian questions correct', '🇬🇪', 'mastery', 'rare'),

-- Achievement badges
('perfect_10', 'პერფექციონისტი', 'Perfectionist', '10 კითხვა ზედიზედ სწორად', '10 questions correct in a row', '💯', 'achievement', 'rare'),
('speed_demon', 'სწრაფი ფიქრი', 'Quick Thinker', 'პასუხი 10 წამში', 'Answer question in under 10 seconds', '⚡', 'achievement', 'common'),
('night_owl', 'ღამის ბუ', 'Night Owl', 'პრაქტიკა 11-5 საათებში', 'Practice between 11PM-5AM', '🦉', 'achievement', 'rare'),
('early_bird', 'ადრეული ჩიტი', 'Early Bird', 'პრაქტიკა 5-7 საათებში', 'Practice between 5AM-7AM', '🐦', 'achievement', 'rare'),

-- Milestone badges
('xp_1000', '1000 XP', '1000 XP', 'ჯამში 1000 XP შეგროვება', 'Earn 1000 total XP', '⭐', 'achievement', 'rare'),
('xp_5000', '5000 XP', '5000 XP', 'ჯამში 5000 XP შეგროვება', 'Earn 5000 total XP', '🌟', 'achievement', 'epic'),
('xp_10000', '10000 XP', '10000 XP', 'ჯამში 10000 XP შეგროვება', 'Earn 10000 total XP', '💫', 'achievement', 'legendary'),

-- Special badges
('all_subjects', 'ყოვლისმცოდნე', 'All-Rounder', 'ყველა საგანში პრაქტიკა', 'Practice all 6 subjects', '🎓', 'special', 'epic'),
('flawless_lesson', 'უცდომელი', 'Flawless', 'გაკვეთილი პირველი ცდით', 'Complete lesson on first try', '✨', 'achievement', 'epic'),
('comeback_king', 'დაბრუნების მეფე', 'Comeback King', '3+ არასწორის შემდეგ 5 ზედიზედ სწორი', '5 correct after 3+ wrong', '👑', 'special', 'legendary')

ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 6. Helper Functions
-- ============================================

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(total_xp INTEGER)
RETURNS TABLE(level INTEGER, xp_for_current INTEGER, xp_to_next INTEGER, progress_percent NUMERIC) AS $$
DECLARE
  current_level_data RECORD;
  next_level_data RECORD;
BEGIN
  -- Find current level
  SELECT * INTO current_level_data
  FROM levels
  WHERE xp_required <= total_xp
  ORDER BY level DESC
  LIMIT 1;
  
  -- Find next level
  SELECT * INTO next_level_data
  FROM levels
  WHERE level = current_level_data.level + 1;
  
  RETURN QUERY SELECT 
    current_level_data.level,
    total_xp - current_level_data.xp_required as xp_for_current,
    COALESCE(next_level_data.xp_required - total_xp, 0) as xp_to_next,
    ROUND(
      ((total_xp - current_level_data.xp_required)::NUMERIC / 
       NULLIF(current_level_data.xp_for_next, 0)::NUMERIC) * 100, 
      1
    ) as progress_percent;
END;
$$ LANGUAGE plpgsql;

-- Function to award XP
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
) RETURNS TABLE(
  new_total_xp INTEGER,
  new_level INTEGER,
  leveled_up BOOLEAN,
  badges_earned UUID[]
) AS $$
DECLARE
  v_old_xp INTEGER;
  v_old_level INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
  v_badges UUID[] := ARRAY[]::UUID[];
BEGIN
  -- Get current XP and level
  SELECT COALESCE(total_xp, 0), COALESCE(current_level, 1)
  INTO v_old_xp, v_old_level
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- If profile doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO user_profiles (id, total_xp, current_level)
    VALUES (p_user_id, 0, 1);
    v_old_xp := 0;
    v_old_level := 1;
  END IF;
  
  -- Add XP
  v_new_xp := v_old_xp + p_amount;
  
  -- Calculate new level
  SELECT l.level INTO v_new_level
  FROM (SELECT * FROM calculate_level(v_new_xp) LIMIT 1) l;
  
  v_leveled_up := v_new_level > v_old_level;
  
  -- Update user profile
  UPDATE user_profiles
  SET 
    total_xp = v_new_xp,
    current_level = v_new_level,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Record transaction
  INSERT INTO xp_transactions (user_id, amount, reason, reference_id, reference_type)
  VALUES (p_user_id, p_amount, p_reason, p_reference_id, p_reference_type);
  
  -- TODO: Check for badge unlocks (implement in separate function)
  
  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled_up, v_badges;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON user_profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(current_level DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned ON user_badges(earned_at DESC);

-- ============================================
-- 8. Verification
-- ============================================

-- Check tables created
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as row_count
FROM user_profiles
UNION ALL
SELECT 'badges', COUNT(*) FROM badges
UNION ALL
SELECT 'levels', COUNT(*) FROM levels
UNION ALL
SELECT 'xp_transactions', COUNT(*) FROM xp_transactions;

-- Show all badges
SELECT code, name_ka, icon, category, rarity
FROM badges
ORDER BY category, rarity;

-- Show level progression
SELECT level, xp_required, xp_for_next, title_ka
FROM levels
ORDER BY level
LIMIT 10;

-- Success message
DO $$
DECLARE
  badge_count INTEGER;
  level_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO badge_count FROM badges;
  SELECT COUNT(*) INTO level_count FROM levels;
  
  RAISE NOTICE '✅ Gamification system created!';
  RAISE NOTICE '📊 Badges: %', badge_count;
  RAISE NOTICE '🎯 Levels: %', level_count;
END $$;
