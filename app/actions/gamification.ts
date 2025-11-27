'use server'

import { createClient } from '@/lib/supabase/server'
import type { XPAwardResult, UserProfile, Badge, UserBadge, Level, LevelProgress } from '@/lib/types/gamification'

/**
 * Award XP to a user
 */
export async function awardXP(params: {
  amount: number
  reason: string
  referenceId?: string
  referenceType?: string
}): Promise<XPAwardResult | null> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Call the award_xp database function
    const { data, error } = await supabase.rpc('award_xp', {
      p_user_id: user.id,
      p_amount: params.amount,
      p_reason: params.reason,
      p_reference_id: params.referenceId || null,
      p_reference_type: params.referenceType || null
    })

    if (error) {
      console.error('Error awarding XP:', error)
      return null
    }

    if (data && data.length > 0) {
      const result = data[0]
      return {
        new_total_xp: result.new_total_xp,
        new_level: result.new_level,
        leveled_up: result.leveled_up,
        badges_earned: result.badges_earned || [],
        xp_gained: params.amount
      }
    }

    return null
  } catch (error) {
    console.error('Award XP error:', error)
    return null
  }
}

/**
 * Get user's gamification profile
 */
export async function getUserProfile(): Promise<{
  profile: UserProfile | null
  levelInfo: Level | null
  progress: LevelProgress | null
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { profile: null, levelInfo: null, progress: null }

    // Get or create profile
    let { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      // Create profile if doesn't exist
      const { data: newProfile } = await supabase
        .from('user_profiles')
        .insert({ id: user.id, total_xp: 0, current_level: 1 })
        .select()
        .single()

      profile = newProfile || {
        id: user.id,
        total_xp: 0,
        current_level: 1,
        xp_to_next_level: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    // Get level info
    const { data: levelInfo } = await supabase
      .from('levels')
      .select('*')
      .eq('level', profile.current_level)
      .single()

    // Calculate progress
    const { data: progressData } = await supabase.rpc('calculate_level', {
      total_xp: profile.total_xp
    })

    let progress: LevelProgress | null = progressData && progressData.length > 0 ? progressData[0] : null

    // Fallback: Calculate progress manually if RPC fails
    if (!progress && levelInfo) {
      const currentLevelXP = levelInfo.xp_required || 0
      const nextLevelData = await supabase
        .from('levels')
        .select('xp_required')
        .eq('level', profile.current_level + 1)
        .single()

      const nextLevelXP = nextLevelData?.data?.xp_required || (currentLevelXP + 100)
      const xpForCurrent = profile.total_xp - currentLevelXP
      const xpToNext = nextLevelXP - profile.total_xp
      const xpForNext = nextLevelXP - currentLevelXP
      const progressPercent = xpForNext > 0 ? (xpForCurrent / xpForNext) * 100 : 0

      progress = {
        level: profile.current_level,
        xp_for_current: Math.max(0, xpForCurrent),
        xp_to_next: Math.max(0, xpToNext),
        progress_percent: Math.min(100, Math.max(0, progressPercent))
      }

      console.log('Used fallback progress calculation:', progress)
    }

    return { profile, levelInfo, progress }
  } catch (error) {
    console.error('Get user profile error:', error)
    return { profile: null, levelInfo: null, progress: null }
  }
}

/**
 * Get all badges
 */
export async function getAllBadges(): Promise<Badge[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('category')
      .order('rarity')

    if (error) {
      console.error('Error fetching badges:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get all badges error:', error)
    return []
  }
}

/**
 * Get user's earned badges
 */
export async function getUserBadges(): Promise<UserBadge[]> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })

    if (error) {
      console.error('Error fetching user badges:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get user badges error:', error)
    return []
  }
}

/**
 * Award a badge to user
 */
export async function awardBadge(badgeCode: string): Promise<UserBadge | null> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Get badge by code
    const { data: badge } = await supabase
      .from('badges')
      .select('*')
      .eq('code', badgeCode)
      .single()

    if (!badge) return null

    // Check if already earned
    const { data: existing } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', user.id)
      .eq('badge_id', badge.id)
      .single()

    if (existing) return existing

    // Award badge
    const { data: userBadge, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: user.id,
        badge_id: badge.id,
        progress: 100,
        earned_at: new Date().toISOString()
      })
      .select(`
        *,
        badge:badges(*)
      `)
      .single()

    if (error) {
      console.error('Error awarding badge:', error)
      return null
    }

    return userBadge
  } catch (error) {
    console.error('Award badge error:', error)
    return null
  }
}

/**
 * Get XP transaction history
 */
export async function getXPHistory(limit: number = 20) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('xp_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching XP history:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get XP history error:', error)
    return []
  }
}

/**
 * Get all levels
 */
export async function getAllLevels(): Promise<Level[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('level')

    if (error) {
      console.error('Error fetching levels:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get all levels error:', error)
    return []
  }
}

/**
 * Get user's current streak
 */
export async function getUserStreak(): Promise<number> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { data, error } = await supabase
      .from('streaks')
      .select('current_streak_days')
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return 0
    }

    return data.current_streak_days || 0
  } catch (error) {
    console.error('Get user streak error:', error)
    return 0
  }
}
