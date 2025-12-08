'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { UserProfile, LevelProgress, Level } from '@/lib/types/gamification'

interface XPBarProps {
  profile: UserProfile
  levelInfo: Level | null
  progress: LevelProgress | null
  compact?: boolean
  showDetails?: boolean
  lastXPGain?: number | null
}

export function XPBar({ profile, levelInfo, progress, compact = false, showDetails = true, lastXPGain }: XPBarProps) {
  const [displayXP, setDisplayXP] = useState(0)
  const progressPercent = progress?.progress_percent || 0

  useEffect(() => {
    const duration = 1000
    const steps = 50
    const increment = profile.total_xp / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= profile.total_xp) {
        setDisplayXP(profile.total_xp)
        clearInterval(timer)
      } else {
        setDisplayXP(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [profile.total_xp])

  if (compact) {
    return (
      <div className="flex items-center gap-2 lg:gap-2 px-3 lg:px-2 py-1.5 lg:py-1 bg-white/5 rounded-lg lg:rounded-lg border border-white/10 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-center w-9 h-9 lg:w-7 lg:h-7 rounded-lg lg:rounded-md bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] relative z-10">
          <span className="text-white font-black text-base lg:text-sm">{profile.current_level}</span>
        </div>

        <div className="flex-1 min-w-[80px] lg:min-w-[60px] relative z-10">
          <div className="h-1.5 lg:h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </motion.div>
          </div>

          <AnimatePresence>
            {lastXPGain && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-3 left-0 right-0 text-center"
              >
                <span className="text-xs font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                  +{lastXPGain} XP
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-sm lg:text-xs font-bold text-blue-200 whitespace-nowrap relative z-10">
          {displayXP.toLocaleString()} XP
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse group-hover:opacity-75 transition-opacity"></div>
            <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-400 font-black text-4xl drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                {profile.current_level}
              </span>
              <span className="text-blue-200/60 text-xs font-bold tracking-wider mt-1">LVL</span>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-black text-white georgian-heading mb-1 text-glow">
              {levelInfo?.title_ka || 'დამწყები'}
            </h3>
            <p className="text-base text-blue-200/60 font-medium">
              {displayXP.toLocaleString()} XP ჯამში
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2 text-sm text-blue-200/60 mb-1">
              <span className="font-medium">შემდეგი დონე:</span>
              <span className="font-bold text-white text-lg">{profile.current_level + 1}</span>
            </div>
            <div className="text-xs font-bold px-2 py-1 rounded-full bg-white/5 text-blue-300 border border-white/10">
              {progress?.xp_to_next || 0} XP დარჩა
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-blue-200/60">
            {progress?.xp_for_current || 0} / {levelInfo?.xp_for_next || 100} XP
          </span>
          <span className="font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            {Math.round(progressPercent)}%
          </span>
        </div>

        <div className="relative h-6 bg-black/40 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-full"
          >
            <div className="absolute inset-y-[25%] left-0 right-0 bg-white/50 blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-white/80 blur-lg transform translate-x-1/2"></div>
          </motion.div>

          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className={cn(
                "absolute top-0 bottom-0 w-[1px] bg-white/20 z-10",
                progressPercent >= milestone ? "opacity-50" : "opacity-100"
              )}
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>

        {showDetails && (
          <p className="text-sm text-center text-blue-200/60 mt-4 georgian-body font-medium">
            {progressPercent < 30 && "კარგად იწყებ! გააგრძელე! 💪"}
            {progressPercent >= 30 && progressPercent < 70 && "შესანიშნავი პროგრესი! 🚀"}
            {progressPercent >= 70 && progressPercent < 100 && "თითქმის მიაღწიე! 🔥"}
            {progressPercent >= 100 && "დონე ავიდა! 🎉"}
          </p>
        )}
      </div>
    </div>
  )
}
