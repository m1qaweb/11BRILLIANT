// Gamification System Types

export type BadgeCategory = 'achievement' | 'streak' | 'mastery' | 'special'
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Badge {
  id: string
  code: string
  name_ka: string
  name_en: string
  description_ka: string | null
  description_en: string | null
  icon: string
  category: BadgeCategory
  rarity: BadgeRarity
  xp_required: number
  criteria: any | null
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  progress: number
  is_displayed: boolean
  badge?: Badge
}

export interface Level {
  level: number
  xp_required: number
  xp_for_next: number
  title_ka: string
  title_en: string
  reward_badge_id: string | null
  created_at: string
}

export interface UserProfile {
  id: string
  total_xp: number
  current_level: number
  xp_to_next_level: number
  created_at: string
  updated_at: string
}

export interface XPTransaction {
  id: string
  user_id: string
  amount: number
  reason: string
  reference_id: string | null
  reference_type: string | null
  created_at: string
}

export interface LevelProgress {
  level: number
  xp_for_current: number
  xp_to_next: number
  progress_percent: number
}

export interface XPAwardResult {
  new_total_xp: number
  new_level: number
  leveled_up: boolean
  badges_earned: string[]
  old_level?: number
  xp_gained: number
}

// Rarity colors and styling
export const RARITY_COLORS: Record<BadgeRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
    glow: 'shadow-gray-200'
  },
  rare: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    glow: 'shadow-blue-300'
  },
  epic: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-700',
    glow: 'shadow-purple-300'
  },
  legendary: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    glow: 'shadow-yellow-300'
  }
}

// Category icons
export const CATEGORY_INFO: Record<BadgeCategory, { icon: string; label_ka: string; color: string }> = {
  achievement: {
    icon: '🏆',
    label_ka: 'მიღწევა',
    color: 'text-yellow-600'
  },
  streak: {
    icon: '🔥',
    label_ka: 'ქართი',
    color: 'text-orange-600'
  },
  mastery: {
    icon: '⭐',
    label_ka: 'ოსტატობა',
    color: 'text-blue-600'
  },
  special: {
    icon: '✨',
    label_ka: 'სპეციალური',
    color: 'text-purple-600'
  }
}
