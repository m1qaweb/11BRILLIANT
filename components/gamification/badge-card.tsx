'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Badge, UserBadge } from '@/lib/types/gamification'
import { RARITY_COLORS, CATEGORY_INFO } from '@/lib/types/gamification'

interface BadgeCardProps {
  badge: Badge
  userBadge?: UserBadge | null
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  onClick?: () => void
}

export function BadgeCard({
  badge,
  userBadge,
  size = 'md',
  showDetails = true,
  onClick
}: BadgeCardProps) {
  const isEarned = !!userBadge
  const categoryInfo = CATEGORY_INFO[badge.category]

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  }

  const iconSizes = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl'
  }

  // Custom rarity styles for Nebula Glass
  const rarityStyles = {
    common: {
      border: 'border-white/20',
      bg: 'bg-white/5',
      glow: '',
      text: 'text-gray-300'
    },
    rare: {
      border: 'border-blue-400/50',
      bg: 'bg-blue-500/10',
      glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]',
      text: 'text-blue-300'
    },
    epic: {
      border: 'border-purple-400/50',
      bg: 'bg-purple-500/10',
      glow: 'shadow-[0_0_20px_rgba(192,132,252,0.4)]',
      text: 'text-purple-300'
    },
    legendary: {
      border: 'border-yellow-400/50',
      bg: 'bg-yellow-500/10',
      glow: 'shadow-[0_0_25px_rgba(250,204,21,0.5)]',
      text: 'text-yellow-300'
    }
  }

  const currentStyle = isEarned ? rarityStyles[badge.rarity] : rarityStyles.common

  return (
    <motion.div
      whileHover={isEarned ? { scale: 1.05, y: -5 } : {}}
      whileTap={isEarned ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-sm overflow-hidden group",
        currentStyle.bg,
        currentStyle.border,
        isEarned ? currentStyle.glow : "opacity-60 hover:opacity-80 grayscale"
      )}
    >
      {/* Rarity Glow Effect for Earned Badges */}
      {isEarned && badge.rarity !== 'common' && (
        <div className={cn(
          "absolute inset-0 rounded-2xl blur-xl opacity-30 -z-10 transition-opacity duration-500",
          badge.rarity === 'rare' && "bg-blue-400 group-hover:opacity-50",
          badge.rarity === 'epic' && "bg-purple-400 group-hover:opacity-50",
          badge.rarity === 'legendary' && "bg-yellow-400 animate-pulse group-hover:opacity-60"
        )} />
      )}

      {/* Holographic Shine Effect */}
      {isEarned && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      )}

      <div className="p-4 flex flex-col items-center text-center relative z-10">
        {/* Badge Icon Container */}
        <div className={cn(
          sizeClasses[size],
          "relative rounded-2xl flex items-center justify-center mb-3 transition-all duration-300",
          isEarned
            ? "bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner"
            : "bg-white/5 border border-white/5"
        )}>
          {isEarned ? (
            <span className={cn(iconSizes[size], "filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transform group-hover:scale-110 transition-transform duration-300")}>
              {badge.icon}
            </span>
          ) : (
            <Lock className="w-8 h-8 text-white/20" />
          )}

          {/* Earned Date Badge */}
          {isEarned && userBadge && size !== 'sm' && (
            <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-emerald-500/90 border border-emerald-400/50 text-white text-xs font-bold shadow-lg backdrop-blur-md">
              ✓
            </div>
          )}
        </div>

        {/* Badge Name */}
        {showDetails && (
          <>
            <h4 className={cn(
              "font-bold mb-1 georgian-heading tracking-wide",
              size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg',
              isEarned ? "text-white text-glow" : 'text-white/40'
            )}>
              {badge.name_ka}
            </h4>

            {/* Badge Description */}
            {size !== 'sm' && (
              <p className={cn(
                "text-xs mb-3 georgian-body line-clamp-2",
                isEarned ? 'text-blue-200/70' : 'text-white/20'
              )}>
                {badge.description_ka}
              </p>
            )}

            {/* Category & Rarity Tags */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Category */}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                isEarned
                  ? "bg-white/10 border-white/20 text-blue-200"
                  : "bg-white/5 border-white/5 text-white/30"
              )}>
                {categoryInfo.icon} {categoryInfo.label_ka}
              </span>

              {/* Rarity */}
              {badge.rarity !== 'common' && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  isEarned ? `${currentStyle.bg} ${currentStyle.border} ${currentStyle.text}` : 'bg-white/5 border-white/5 text-white/30'
                )}>
                  {badge.rarity === 'rare' && '⭐'}
                  {badge.rarity === 'epic' && '💎'}
                  {badge.rarity === 'legendary' && '👑'}
                  {' '}
                  {badge.rarity}
                </span>
              )}
            </div>

            {/* Earned Date */}
            {isEarned && userBadge && size === 'lg' && (
              <div className="mt-3 text-xs text-blue-200/50 georgian-body font-mono">
                {new Date(userBadge.earned_at).toLocaleDateString('ka-GE')}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
