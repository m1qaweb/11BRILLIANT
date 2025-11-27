'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { LevelUpModal } from './level-up-modal'
import { BadgeNotification } from './badge-notification'
import type { XPAwardResult, Badge, Level } from '@/lib/types/gamification'

interface GamificationContextType {
  showLevelUp: (result: XPAwardResult, levelInfo: Level | null) => void
  showBadgeEarned: (badge: Badge) => void
}

const GamificationContext = createContext<GamificationContextType | null>(null)

export function useGamification() {
  const context = useContext(GamificationContext)
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider')
  }
  return context
}

interface GamificationProviderProps {
  children: ReactNode
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean
    oldLevel: number
    newLevel: number
    levelInfo: Level | null
    totalXP: number
  }>({
    isOpen: false,
    oldLevel: 1,
    newLevel: 1,
    levelInfo: null,
    totalXP: 0
  })

  const [badgeData, setBadgeData] = useState<{
    isOpen: boolean
    badge: Badge | null
  }>({
    isOpen: false,
    badge: null
  })

  const showLevelUp = useCallback((result: XPAwardResult, levelInfo: Level | null) => {
    if (result.leveled_up) {
      setLevelUpData({
        isOpen: true,
        oldLevel: result.old_level || result.new_level - 1,
        newLevel: result.new_level,
        levelInfo,
        totalXP: result.new_total_xp
      })
    }
  }, [])

  const showBadgeEarned = useCallback((badge: Badge) => {
    setBadgeData({
      isOpen: true,
      badge
    })
  }, [])

  const closeLevelUp = useCallback(() => {
    setLevelUpData(prev => ({ ...prev, isOpen: false }))
  }, [])

  const closeBadge = useCallback(() => {
    setBadgeData({ isOpen: false, badge: null })
  }, [])

  return (
    <GamificationContext.Provider value={{ showLevelUp, showBadgeEarned }}>
      {children}
      
      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={closeLevelUp}
        oldLevel={levelUpData.oldLevel}
        newLevel={levelUpData.newLevel}
        levelInfo={levelUpData.levelInfo}
        totalXP={levelUpData.totalXP}
      />

      <BadgeNotification
        badge={badgeData.badge}
        isOpen={badgeData.isOpen}
        onClose={closeBadge}
      />
    </GamificationContext.Provider>
  )
}
