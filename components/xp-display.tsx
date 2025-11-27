'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface UserProfile {
  total_xp: number
  current_level: number
}

interface XPDisplayProps {
  userId?: string
  className?: string
  showDetails?: boolean
}

export function XPDisplay({ userId, className, showDetails = false }: XPDisplayProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('user_profiles')
        .select('total_xp, current_level')
        .eq('id', userId)
        .single()

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  if (loading || !profile) {
    return null
  }

  // Calculate level progress
  const levelThresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3250, 4250, 5500, 7000, 9000, 11500]
  const currentLevelXP = levelThresholds[profile.current_level - 1] || 0
  const nextLevelXP = levelThresholds[profile.current_level] || currentLevelXP + 1000
  const xpInCurrentLevel = profile.total_xp - currentLevelXP
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP
  const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Level Badge */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-white font-black text-lg">{profile.current_level}</span>
        </div>
        {/* Level ring animation */}
        <svg className="absolute inset-0 w-12 h-12 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
            className="text-amber-500 transition-all duration-500"
            style={{
              strokeDashoffset: 0,
              strokeLinecap: 'round',
            }}
          />
        </svg>
      </div>

      {showDetails && (
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-bold text-foreground">დონე {profile.current_level}</span>
            <span className="text-xs text-muted-foreground">
              {xpInCurrentLevel} / {xpNeededForNextLevel} XP
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* XP Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <span className="text-lg">⭐</span>
        <span className="text-sm font-black text-blue-700">{profile.total_xp}</span>
        <span className="text-xs font-medium text-blue-600">XP</span>
      </div>
    </div>
  )
}
