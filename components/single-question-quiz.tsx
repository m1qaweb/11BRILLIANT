'use client'

import { useState, useEffect } from 'react'
import { QuestionInteractive } from './question-interactive'
import { cn } from '@/lib/utils'
import { getUserProfile, getUserStreak } from '@/app/actions/gamification'
import { XPBar } from './gamification/xp-bar'
import { LevelUpModal } from './gamification/level-up-modal'
import { motion, AnimatePresence } from 'framer-motion'
import type { UserProfile, LevelProgress, Level } from '@/lib/types/gamification'
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, Trophy, Target, Zap } from 'lucide-react'

interface Question {
  id: string
  stem_ka: string
  prompt_md: string
  type: 'mcq' | 'single_choice' | 'numeric' | 'boolean' | 'multi_select' | 'interactive'
  difficulty_level: number | null
  difficulty: string | null
  order_index: number
  options: Array<{
    id: string
    label_ka: string
    explanation_ka: string | null
    is_correct: boolean
    order_index: number
  }>
}

interface SingleQuestionQuizProps {
  questions: Question[]
  lessonId: string
  lessonTitle: string
}

export function SingleQuestionQuiz({ questions, lessonId, lessonTitle }: SingleQuestionQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Gamification state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [levelInfo, setLevelInfo] = useState<Level | null>(null)
  const [progress, setProgress] = useState<LevelProgress | null>(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null)
  const [totalCorrectStreak, setTotalCorrectStreak] = useState(0)
  const [lastXPGain, setLastXPGain] = useState<number | null>(null)
  const [showStreakMessage, setShowStreakMessage] = useState(false)

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile()
    loadStreak()
  }, [])

  async function loadUserProfile() {
    try {
      const { profile, levelInfo: level, progress: prog } = await getUserProfile()
      setUserProfile(profile)
      setLevelInfo(level)
      setProgress(prog)
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }

  async function loadStreak() {
    try {
      const streak = await getUserStreak()
      setCurrentStreak(streak)
    } catch (error) {
      console.error('Failed to load streak:', error)
      setCurrentStreak(0)
    }
  }

  // Refresh profile after XP award
  async function refreshProfile(xpGained?: number) {
    const { profile, levelInfo: level, progress: prog } = await getUserProfile()

    // Check for level up
    if (userProfile && profile && profile.current_level > userProfile.current_level) {
      setLevelUpData({ oldLevel: userProfile.current_level, newLevel: profile.current_level })
      setShowLevelUpModal(true)
    }

    setUserProfile(profile)
    setLevelInfo(level)
    setProgress(prog)

    if (xpGained) {
      setLastXPGain(xpGained)
      setTimeout(() => setLastXPGain(null), 3000)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleQuestionAnswered = (isCorrect: boolean, xpGained?: number) => {
    if (isCorrect) {
      // Mark question as answered
      setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex))

      // Update streak
      setTotalCorrectStreak(prev => prev + 1)

      // Show streak message transiently
      setShowStreakMessage(true)
      setTimeout(() => setShowStreakMessage(false), 1500)

      // Refresh profile to show new XP
      if (xpGained) {
        refreshProfile(xpGained)
      }
    } else {
      // Reset streak on incorrect answer
      setTotalCorrectStreak(0)
      setShowStreakMessage(false)
    }
  }

  const handleContinue = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  if (quizCompleted) {
    const accuracy = Math.round((answeredQuestions.size / totalQuestions) * 100)

    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full animate-slide-up">
        <div className="w-full max-w-2xl mx-auto glass-panel p-12 text-center rounded-3xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/10 to-purple-500/10 pointer-events-none"></div>

          {/* Celebration Icon - Static */}
          <div className="mb-6 relative z-10">
            <span className="text-6xl">🎉</span>
          </div>

          {/* Congratulations Message */}
          <h2 className="text-4xl md:text-5xl font-black mb-3 py-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 georgian-heading text-glow relative z-10">
            გილოცავ!
          </h2>
          <p className="text-lg text-blue-200/60 mb-10 georgian-body max-w-md mx-auto relative z-10">
            წარმატებით დაასრულე გაკვეთილი <span className="font-bold text-white">„{lessonTitle}"</span>
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
            <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-transform">
              <div className="text-4xl font-black text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">{totalQuestions}</div>
              <div className="text-sm font-bold text-blue-200/60 georgian-body uppercase tracking-wider">კითხვა</div>
            </div>
            <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-transform">
              <div className="text-4xl font-black text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">{answeredQuestions.size}</div>
              <div className="text-sm font-bold text-blue-200/60 georgian-body uppercase tracking-wider">სწორი</div>
            </div>
            <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-transform">
              <div className="text-4xl font-black text-amber-400 mb-2 group-hover:text-amber-300 transition-colors">{accuracy}%</div>
              <div className="text-sm font-bold text-blue-200/60 georgian-body uppercase tracking-wider">სიზუსტე</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 georgian-body border border-white/10"
            >
              სხვა საგანი
            </button>
          </div>


        </div>
      </div>
    )
  }

  return (
    <div className="w-full pb-24">
      {/* XP & Streak Display - Top Banner */}
      {userProfile && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* XP Bar */}
          <div className="glass-panel p-1 rounded-2xl">
            <XPBar
              profile={userProfile}
              levelInfo={levelInfo}
              progress={progress}
              compact={true}
              showDetails={false}
              lastXPGain={lastXPGain}
            />
          </div>

          {/* Enhanced Streak Counter with Fire Effects */}
          <div className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-4 relative overflow-hidden">
            {/* Flame background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5 animate-pulse"></div>

            {/* Fire Icon with enhanced effects */}
            <div className="relative z-10">
              <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-red-600 to-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.5)]"
                animate={{
                  boxShadow: totalCorrectStreak > 0
                    ? [
                      '0 0 20px rgba(234,88,12,0.5)',
                      '0 0 30px rgba(234,88,12,0.8)',
                      '0 0 20px rgba(234,88,12,0.5)'
                    ]
                    : '0 0 20px rgba(234,88,12,0.5)'
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-white font-black text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  🔥
                </span>
              </motion.div>

              {/* Enhanced Flame particles */}
              {totalCorrectStreak > 0 && (
                <>
                  {/* Large orange flame */}
                  <motion.div
                    className="absolute top-0 left-1/2 -ml-1 w-2 h-3 bg-gradient-to-t from-orange-500 to-orange-300 rounded-full blur-[2px]"
                    animate={{
                      y: [0, -25],
                      x: [-3, 2],
                      opacity: [0.8, 0],
                      scale: [1, 0.3]
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                  {/* Medium red flame */}
                  <motion.div
                    className="absolute top-0 left-1/2 -ml-0.5 w-1.5 h-2.5 bg-gradient-to-t from-red-500 to-red-300 rounded-full blur-[2px]"
                    animate={{
                      y: [0, -20],
                      x: [3, -2],
                      opacity: [0.7, 0],
                      scale: [1, 0.4]
                    }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2, ease: "easeOut" }}
                  />
                  {/* Small yellow flame */}
                  <motion.div
                    className="absolute top-0 left-1/2 -ml-0.5 w-1 h-2 bg-gradient-to-t from-yellow-500 to-yellow-200 rounded-full blur-[1px]"
                    animate={{
                      y: [0, -18],
                      x: [0, 1],
                      opacity: [0.9, 0],
                      scale: [1, 0.2]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4, ease: "easeOut" }}
                  />
                  {/* Extra orange particle */}
                  <motion.div
                    className="absolute top-1 left-1/2 ml-1 w-1 h-1.5 bg-gradient-to-t from-orange-600 to-orange-400 rounded-full blur-[1px]"
                    animate={{
                      y: [0, -22],
                      x: [-2, 3],
                      opacity: [0.6, 0],
                      scale: [1, 0.3]
                    }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
                  />
                  {/* Subtle red accent */}
                  <motion.div
                    className="absolute top-1 left-1/2 -ml-1.5 w-1 h-1.5 bg-gradient-to-t from-red-600 to-red-400 rounded-full blur-[1px]"
                    animate={{
                      y: [0, -16],
                      x: [2, -1],
                      opacity: [0.5, 0],
                      scale: [1, 0.4]
                    }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: 0.8, ease: "easeOut" }}
                  />
                </>
              )}
            </div>

            <div className="flex-1 relative z-10">
              <div className="text-xs text-blue-200/60 font-bold uppercase tracking-wider georgian-body">სტრიქი</div>
              <motion.div
                className="text-2xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 100%' }}
              >
                {totalCorrectStreak}
              </motion.div>
            </div>

            <AnimatePresence>
              {totalCorrectStreak > 0 && showStreakMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  className="px-4 py-2 rounded-xl relative z-10"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      {totalCorrectStreak} სწორი ზედიზედ!
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* XP Gain Animation - Improved Dark Blue Design */}


      {/* Level Up Modal */}
      {
        levelUpData && (
          <LevelUpModal
            isOpen={showLevelUpModal}
            onClose={() => setShowLevelUpModal(false)}
            oldLevel={levelUpData.oldLevel}
            newLevel={levelUpData.newLevel}
            levelInfo={levelInfo}
            totalXP={userProfile?.total_xp || 0}
          />
        )
      }

      {/* Clean Progress Header - Fixed at Top */}
      <div className="mb-8 glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white">
              {currentQuestionIndex + 1}
            </span>
            <span className="text-white/20 font-medium">/</span>
            <span className="text-lg font-medium text-white/40">{totalQuestions}</span>

            <div className="hidden sm:flex items-center gap-2 ml-4">
              <div className="h-6 w-px bg-white/10"></div>
              <span className="text-sm text-blue-200/60 font-medium georgian-body">
                {lessonTitle}
              </span>
            </div>
          </div>

          {answeredQuestions.size > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">
                {answeredQuestions.size} სწორი
              </span>
            </motion.div>
          )}
        </div>

        {/* Sleek Progress Bar - Laser Beam Effect */}
        <div className="relative w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white/80 blur-sm transform translate-x-1/2"></div>
          </div>
        </div>
      </div>

      {/* Question Card - Clean & Focused */}
      <div className="mb-8">
        <QuestionInteractive
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          lessonId={lessonId}
          onAnswered={handleQuestionAnswered}
          onContinue={handleContinue}
        />
      </div>

      {/* Navigation Buttons - Modern & Clean */}
      <div className="flex items-center justify-between gap-4 px-2">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 georgian-body border",
            currentQuestionIndex === 0
              ? "text-white/20 border-transparent cursor-not-allowed"
              : "text-blue-200 hover:text-white bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">წინა კითხვა</span>
        </button>

        {answeredQuestions.has(currentQuestionIndex) && (
          <button
            onClick={goToNextQuestion}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-300 georgian-body shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/20"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'დასრულება' : 'შემდეგი'}
            {currentQuestionIndex !== totalQuestions - 1 && <ArrowRight className="w-4 h-4" />}
          </button>
        )}
      </div>

    </div >
  )
}
