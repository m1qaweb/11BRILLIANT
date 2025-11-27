// Database types generated from schema
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: string
          code: string
          name_ka: string
          name_en: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name_ka: string
          name_en: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name_ka?: string
          name_en?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          subject_id: string
          grade_id: number
          slug: string
          title_ka: string
          title_en: string
          description_ka: string | null
          order_index: number
          is_seed: boolean | null
          curriculum_ref: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          grade_id: number
          slug: string
          title_ka: string
          title_en: string
          description_ka?: string | null
          order_index?: number
          is_seed?: boolean | null
          curriculum_ref?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          grade_id?: number
          slug?: string
          title_ka?: string
          title_en?: string
          description_ka?: string | null
          order_index?: number
          is_seed?: boolean | null
          curriculum_ref?: string | null
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          slug: string
          title_ka: string
          title_en: string
          order_index: number
          summary_ka: string | null
          estimated_minutes: number | null
          content_blocks: Json | null
          prerequisites: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          slug: string
          title_ka: string
          title_en: string
          order_index: number
          summary_ka?: string | null
          estimated_minutes?: number | null
          content_blocks?: Json | null
          prerequisites?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          slug?: string
          title_ka?: string
          title_en?: string
          order_index?: number
          summary_ka?: string | null
          estimated_minutes?: number | null
          content_blocks?: Json | null
          prerequisites?: string[] | null
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          lesson_id: string
          order_index: number
          type: 'mcq' | 'single_choice' | 'numeric' | 'boolean' | 'multi_select' | 'interactive'
          prompt_md: string
          options_json: Json | null
          correct_answer: Json
          solution_md: string | null
          difficulty: 'easy' | 'medium' | 'hard' | null
          is_required: boolean
          points: number
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          order_index: number
          type: 'mcq' | 'single_choice' | 'numeric' | 'boolean' | 'multi_select' | 'interactive'
          prompt_md: string
          options_json?: Json | null
          correct_answer: Json
          solution_md?: string | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          is_required?: boolean
          points?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          order_index?: number
          type?: 'mcq' | 'numeric' | 'boolean' | 'multi_select' | 'interactive'
          prompt_md?: string
          options_json?: Json | null
          correct_answer?: Json
          solution_md?: string | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          is_required?: boolean
          points?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      question_hints: {
        Row: {
          id: string
          question_id: string
          order_index: number
          hint_md: string
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          order_index: number
          hint_md: string
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          order_index?: number
          hint_md?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          timezone: string
          role: 'student' | 'author' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          role?: 'student' | 'author' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          role?: 'student' | 'author' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: 'in_progress' | 'completed'
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          status?: 'in_progress' | 'completed'
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          status?: 'in_progress' | 'completed'
          started_at?: string
          completed_at?: string | null
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          last_viewed_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          last_viewed_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          last_viewed_at?: string
          completed_at?: string | null
        }
      }
      question_attempts: {
        Row: {
          id: string
          user_id: string
          question_id: string
          submitted_at: string
          is_correct: boolean
          payload_json: Json
          attempt_number: number
          time_spent_ms: number | null
          hints_used: number
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          submitted_at?: string
          is_correct: boolean
          payload_json: Json
          attempt_number: number
          time_spent_ms?: number | null
          hints_used?: number
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          submitted_at?: string
          is_correct?: boolean
          payload_json?: Json
          attempt_number?: number
          time_spent_ms?: number | null
          hints_used?: number
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          current_streak_days: number
          longest_streak_days: number
          last_active_date: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak_days?: number
          longest_streak_days?: number
          last_active_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak_days?: number
          longest_streak_days?: number
          last_active_date?: string | null
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          stripe_price_id: string
          name: string
          description: string | null
          interval: 'month' | 'year'
          price_cents: number
          features_json: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_price_id: string
          name: string
          description?: string | null
          interval: 'month' | 'year'
          price_cents: number
          features_json?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_price_id?: string
          name?: string
          description?: string | null
          interval?: 'month' | 'year'
          price_cents?: number
          features_json?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan_id: string | null
          status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_id?: string | null
          status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_id?: string | null
          status?: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_audit_log: {
        Row: {
          id: string
          user_id: string
          action: string
          table_name: string | null
          record_id: string | null
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          table_name?: string | null
          record_id?: string | null
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          table_name?: string | null
          record_id?: string | null
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
