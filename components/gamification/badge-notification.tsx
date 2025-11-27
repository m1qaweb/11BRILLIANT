'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Badge } from '@/lib/types/gamification'
import { RARITY_COLORS } from '@/lib/types/gamification'

interface BadgeNotificationProps {
  badge: Badge | null
  isOpen: boolean
  onClose: () => void
}

export function BadgeNotification({ badge, isOpen, onClose }: BadgeNotificationProps) {
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen && badge) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      
      setAutoCloseTimer(timer)

      return () => {
        if (timer) clearTimeout(timer)
      }
    }
  }, [isOpen, badge, onClose])

  if (!badge) return null

  const rarityColors = RARITY_COLORS[badge.rarity]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 right-4 z-[100] max-w-sm"
        >
          <div className={cn(
            "relative rounded-2xl border-2 shadow-2xl overflow-hidden",
            rarityColors.bg,
            rarityColors.border,
            badge.rarity === 'legendary' && "animate-pulse"
          )}>
            {/* Sparkle Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    y: '-20%',
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative p-4">
              <div className="flex items-start gap-3">
                {/* Badge Icon */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{badge.icon}</span>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <h3 className="text-sm font-bold text-gray-700 georgian-heading">
                      ახალი ბეჯი!
                    </h3>
                  </div>
                  
                  <h4 className={cn(
                    "text-lg font-black mb-1 georgian-heading",
                    rarityColors.text
                  )}>
                    {badge.name_ka}
                  </h4>
                  
                  <p className="text-xs text-gray-600 georgian-body line-clamp-2">
                    {badge.description_ka}
                  </p>

                  {/* Rarity Badge */}
                  {badge.rarity !== 'common' && (
                    <div className="mt-2">
                      <span className={cn(
                        "inline-block px-2 py-1 rounded-full text-xs font-bold uppercase",
                        rarityColors.text,
                        "bg-white/70"
                      )}>
                        {badge.rarity === 'rare' && '⭐ '}
                        {badge.rarity === 'epic' && '💎 '}
                        {badge.rarity === 'legendary' && '👑 '}
                        {badge.rarity}
                      </span>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Progress Bar (auto-close indicator) */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
