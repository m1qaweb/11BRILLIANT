-- ============================================================================
-- Brilliant Clone - Initial Schema Migration
-- Created: 2025-11-18
-- ============================================================================

-- ============================================================================
-- CONTENT TABLES (Public or read-only for users)
-- ============================================================================

CREATE TABLE subjects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  description     text,
  icon            text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE courses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id        uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  short_description text,
  long_description  text,
  difficulty        text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_premium        boolean DEFAULT false,
  is_published      boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_courses_subject_id ON courses(subject_id);
CREATE INDEX idx_courses_published ON courses(is_published) WHERE is_published = true;

CREATE TABLE lessons (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id         uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug              text UNIQUE NOT NULL,
  title             text NOT NULL,
  order_index       integer NOT NULL,
  summary           text,
  content_mdx       text,
  estimated_minutes integer,
  is_premium        boolean DEFAULT false,
  is_published      boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  UNIQUE (course_id, order_index)
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_published ON lessons(is_published) WHERE is_published = true;

CREATE TABLE questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id       uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  order_index     integer NOT NULL,
  type            text NOT NULL CHECK (type IN ('mcq', 'numeric', 'boolean', 'multi_select', 'interactive')),
  prompt_md       text NOT NULL,
  options_json    jsonb,
  correct_answer  jsonb NOT NULL,
  solution_md     text,
  difficulty      text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_required     boolean DEFAULT true,
  points          integer DEFAULT 1,
  tags            text[],
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (lesson_id, order_index)
);

CREATE INDEX idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX idx_questions_tags ON questions USING gin(tags);

CREATE TABLE question_hints (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  order_index   integer NOT NULL,
  hint_md       text NOT NULL,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (question_id, order_index)
);

CREATE INDEX idx_question_hints_question_id ON question_hints(question_id);

-- ============================================================================
-- USER DATA TABLES (Protected by RLS)
-- ============================================================================

CREATE TABLE profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        text UNIQUE,
  display_name    text,
  avatar_url      text,
  bio             text,
  timezone        text DEFAULT 'UTC',
  role            text DEFAULT 'student' CHECK (role IN ('student', 'author', 'admin')),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);

CREATE TABLE course_enrollments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id       uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status          text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at      timestamptz DEFAULT now(),
  completed_at    timestamptz,
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON course_enrollments(course_id);

CREATE TABLE lesson_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id       uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status          text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_viewed_at  timestamptz DEFAULT now(),
  completed_at    timestamptz,
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(user_id, status);

CREATE TABLE question_attempts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id     uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  submitted_at    timestamptz DEFAULT now(),
  is_correct      boolean NOT NULL,
  payload_json    jsonb NOT NULL,
  attempt_number  integer NOT NULL,
  time_spent_ms   integer,
  hints_used      integer DEFAULT 0
);

CREATE INDEX idx_question_attempts_user_id ON question_attempts(user_id);
CREATE INDEX idx_question_attempts_question_id ON question_attempts(question_id);
CREATE INDEX idx_question_attempts_user_question ON question_attempts(user_id, question_id);
CREATE INDEX idx_question_attempts_submitted_at ON question_attempts(submitted_at);

CREATE TABLE streaks (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak_days   integer DEFAULT 0,
  longest_streak_days   integer DEFAULT 0,
  last_active_date      date,
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX idx_streaks_user_id ON streaks(user_id);

-- ============================================================================
-- BILLING TABLES
-- ============================================================================

CREATE TABLE subscription_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_price_id text UNIQUE NOT NULL,
  name            text NOT NULL,
  description     text,
  interval        text NOT NULL CHECK (interval IN ('month', 'year')),
  price_cents     integer NOT NULL,
  features_json   jsonb,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE user_subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id      text UNIQUE,
  stripe_subscription_id  text UNIQUE,
  plan_id                 uuid REFERENCES subscription_plans(id),
  status                  text NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'incomplete')),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean DEFAULT false,
  trial_end               timestamptz,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);

-- ============================================================================
-- ADMIN AUDIT LOG
-- ============================================================================

CREATE TABLE admin_audit_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id),
  action        text NOT NULL,
  table_name    text,
  record_id     uuid,
  changes       jsonb,
  ip_address    text,
  user_agent    text,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_log_user_id ON admin_audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX idx_audit_log_table_record ON admin_audit_log(table_name, record_id);

-- ============================================================================
-- AUTH TRIGGER - Auto-create profile on signup
-- ============================================================================

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
  INSERT INTO public.profiles (id, username, role, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );
  
  -- Initialize streak record
  INSERT INTO public.streaks (user_id, current_streak_days, longest_streak_days)
  VALUES (NEW.id, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
