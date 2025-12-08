'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, TrendingUp, Zap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Level } from '@/lib/types/gamification'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  oldLevel: number
  newLevel: number
  levelInfo: Level | null
  totalXP: number
}

function Confetti({ index }: { index: number }) {
  const colors = ['#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309']
  const randomColor = colors[index % colors.length]

  const startX = 50 + (Math.random() - 0.5) * 20
  const endX = Math.random() * 100
  const endY = Math.random() * 100
  const rotation = Math.random() * 720 - 360
  const delay = index * 0.05

  return (
    <motion.div
      initial={{
        left: `${startX}%`,
        top: '50%',
        scale: 0,
        rotate: 0,
        opacity: 1
      }}
      animate={{
        left: `${endX}%`,
        top: `${endY}%`,
        scale: [0, 1, 0.8, 0],
        rotate: rotation,
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 2.5,
        delay,
        ease: [0.36, 0.66, 0.04, 1]
      }}
      className="absolute w-2.5 h-2.5 rounded-sm"
      style={{
        backgroundColor: randomColor,
        boxShadow: `0 0 10px ${randomColor}`
      }}
    />
  )
}

function StarBurst({ index }: { index: number }) {
  const angle = (index / 12) * Math.PI * 2
  const distance = 150 + Math.random() * 50
  const endX = Math.cos(angle) * distance
  const endY = Math.sin(angle) * distance

  return (
    <motion.div
      initial={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 1
      }}
      animate={{
        x: endX,
        y: endY,
        scale: [0, 1, 0],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 1.5,
        delay: 0.2 + index * 0.05,
        ease: 'easeOut'
      }}
      className="absolute"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
    </motion.div>
  )
}

export function LevelUpModal({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  levelInfo,
  totalXP
}: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [displayLevel, setDisplayLevel] = useState(oldLevel)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      setDisplayLevel(oldLevel)

      const duration = 800
      const steps = Math.abs(newLevel - oldLevel)
      const stepDuration = duration / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setDisplayLevel(oldLevel + currentStep)
        } else {
          clearInterval(interval)
        }
      }, stepDuration)

      const timer = setTimeout(() => setShowConfetti(false), 3500)
      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [isOpen, oldLevel, newLevel])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 100, rotateX: -90 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                rotateX: 0
              }}
              exit={{ scale: 0.5, opacity: 0, y: 100 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                mass: 0.8
              }}
              className="relative w-full max-w-lg pointer-events-auto"
              style={{ perspective: '1000px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-3xl blur-3xl opacity-60 animate-pulse" />

              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-900/20 animate-gradient-shift" />

                {showConfetti && (
                  <div className="absolute left-1/2 top-1/2 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <StarBurst key={`star-${i}`} index={i} />
                    ))}
                  </div>
                )}

                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(40)].map((_, i) => (
                      <Confetti key={`confetti-${i}`} index={i} />
                    ))}
                  </div>
                )}

                {showConfetti && (
                  <>
                    <motion.div
                      animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute top-20 left-10 w-32 h-32 rounded-full bg-yellow-400/20 blur-3xl"
                    />
                    <motion.div
                      animate={{
                        y: [20, -20, 20],
                        x: [10, -10, 10],
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5
                      }}
                      className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-pink-400/20 blur-3xl"
                    />
                  </>
                )}

                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all hover:scale-110 z-10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="relative p-8 sm:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      rotate: [- 180, 10, -10, 0]
                    }}
                    transition={{
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 200,
                      damping: 10
                    }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg mb-6 relative"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute inset-0 rounded-full bg-yellow-300 blur-xl"
                    />
                    <Trophy className="w-12 h-12 text-white relative z-10" />
                    <Zap className="w-5 h-5 text-white absolute -top-1 -right-1 animate-bounce" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-5xl sm:text-6xl font-black text-white mb-4 georgian-heading relative"
                  >
                    <span className="relative inline-block">
                      დონე ავიდა!
                      <motion.div
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                          repeatDelay: 1
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      />
                    </span>
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
                    className="flex items-center justify-center gap-6 mb-8"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                        <span className="text-4xl font-black text-white/90">{oldLevel}</span>
                      </div>
                      <span className="text-sm font-medium text-white/70 mt-2">წინა</span>
                    </div>

                    <motion.div
                      animate={{
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <TrendingUp className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <motion.div
                        className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-2xl border-4 border-yellow-300 relative overflow-hidden"
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(253,224,71,0.5)',
                            '0 0 40px rgba(253,224,71,0.8)',
                            '0 0 20px rgba(253,224,71,0.5)'
                          ]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent"
                          animate={{
                            x: ['-100%', '200%']
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                        />
                        <span className="text-4xl font-black bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10">
                          {displayLevel}
                        </span>
                      </motion.div>
                      <span className="text-sm font-medium text-white/70 mt-2">ახალი</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                  >
                    <div className="inline-block px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-xl relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0"
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                          repeatDelay: 0.5
                        }}
                      />
                      <h3 className="text-3xl font-black text-white georgian-heading relative z-10">
                        {levelInfo?.title_ka || 'ახალი დონე'}
                      </h3>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-10 mb-8"
                  >
                    <div className="text-center">
                      <motion.div
                        className="text-4xl font-black text-yellow-300 mb-1 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                        animate={{
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        {totalXP.toLocaleString()}
                      </motion.div>
                      <div className="text-sm font-medium text-white/70 georgian-body">ჯამი XP</div>
                    </div>

                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

                    <div className="text-center">
                      <motion.div
                        className="text-4xl font-black bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-1"
                        animate={{
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.2
                        }}
                      >
                        {newLevel}
                      </motion.div>
                      <div className="text-sm font-medium text-white/70 georgian-body">დონე</div>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 0.7 }}
                    onClick={onClose}
                    className="w-full px-8 py-5 rounded-xl bg-white text-purple-600 font-black text-xl hover:bg-gray-50 transition-all shadow-2xl georgian-body relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/30 to-purple-400/0"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      გაგრძელება
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </span>
                  </motion.button>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-5 text-base font-medium text-white/80 georgian-body"
                  >
                    შესანიშნავი შედეგი! გააგრძელე სწავლა! 💪✨
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
