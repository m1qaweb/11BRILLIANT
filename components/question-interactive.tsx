'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { submitAnswer } from '@/app/actions/submit-answer'
import { awardXP } from '@/app/actions/gamification'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { XPAwardResult } from '@/lib/types/gamification'

// Manual type definitions matching the page
type QuestionOption = {
  id: string
  label_ka: string
  explanation_ka: string | null
  is_correct: boolean
  order_index: number
}

type Question = {
  id: string
  type: 'mcq' | 'single_choice' | 'numeric' | 'boolean' | 'multi_select' | 'interactive'
  stem_ka: string
  prompt_md: string
  difficulty_level: number | null
  difficulty: string | null
  order_index: number
  options: QuestionOption[]
}

interface QuestionInteractiveProps {
  question: Question
  lessonId: string
  questionNumber: number
  onAnswered?: (isCorrect: boolean, xpGained?: number) => void
  onContinue?: () => void
}

export function QuestionInteractive({
  question,
  lessonId,
  questionNumber,
  onAnswered,
  onContinue
}: QuestionInteractiveProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
  const [attemptNumber, setAttemptNumber] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean
    feedback: string
  } | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [xpResult, setXpResult] = useState<XPAwardResult | null>(null)
  const [showFailedModal, setShowFailedModal] = useState(false)
  const router = useRouter()

  const options = question.options || []

  async function handleSubmit() {
    if (!selectedAnswer) return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const result = await submitAnswer({
        questionId: question.id,
        lessonId,
        submittedAnswer: selectedAnswer,
        attemptNumber,
      })

      setFeedback({
        isCorrect: result.isCorrect,
        feedback: result.feedback,
      })

      const xpGained = result.xpAwarded || 0

      if (onAnswered) {
        onAnswered(result.isCorrect, xpGained)
      }

      if (!result.isCorrect) {
        const newAttemptNumber = attemptNumber + 1
        setAttemptNumber(newAttemptNumber)
        if (newAttemptNumber > 3) {
          setShowFailedModal(true)
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setFeedback({
        isCorrect: false,
        feedback: 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setSelectedAnswer(null)
    setFeedback(null)
    setShowHint(false)
  }

  return (
    <>
      <div className={cn(
        "w-full max-w-4xl mx-auto overflow-hidden transition-all duration-500 glass-panel rounded-xl sm:rounded-2xl lg:rounded-2xl",
        feedback?.isCorrect === true ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "",
        feedback?.isCorrect === false ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : ""
      )}>
        <div className="p-4 sm:p-5 md:p-6 lg:p-6">
          <div className="mb-4 sm:mb-5 lg:mb-6">
            <div
              className="prose prose-invert prose-base sm:prose-lg lg:prose-lg max-w-none text-lg sm:text-xl lg:text-xl leading-relaxed lg:leading-relaxed text-white font-medium georgian-body"
              dangerouslySetInnerHTML={{ __html: question.stem_ka.replace(/\n/g, '<br />') }}
            />
          </div>

          <div className="mb-4 sm:mb-5 lg:mb-5 animate-slide-up">
            {(question.type === 'mcq' || question.type === 'single_choice') && (
              <div className="grid gap-2 sm:gap-3 lg:gap-3">
                {options.map((option) => {
                  const isSelected = selectedAnswer?.optionId === option.id
                  const isCorrect = option.is_correct
                  const showCorrect = feedback?.isCorrect && isSelected
                  const showIncorrect = feedback && !feedback.isCorrect && isSelected

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "relative flex items-center gap-3 sm:gap-4 lg:gap-4 p-3 sm:p-4 lg:p-4 border rounded-lg sm:rounded-xl lg:rounded-xl cursor-pointer transition-all duration-300 group",
                        !feedback && !isSelected && "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20",
                        !feedback && isSelected && "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                        showCorrect && "border-emerald-500 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
                        showIncorrect && "border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
                        feedback && "pointer-events-none"
                      )}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setSelectedAnswer({ optionId: option.id })}
                          disabled={!!feedback}
                          className="peer sr-only"
                        />
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
                          !feedback && !isSelected && "border-white/30 group-hover:border-white/60",
                          !feedback && isSelected && "border-blue-500 bg-blue-500",
                          showCorrect && "border-emerald-500 bg-emerald-500",
                          showIncorrect && "border-red-500 bg-red-500"
                        )}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                      <span className={cn(
                        "text-sm sm:text-base lg:text-base font-medium transition-colors",
                        showCorrect && "text-emerald-300",
                        showIncorrect && "text-red-300",
                        !feedback && isSelected && "text-blue-200",
                        !feedback && !isSelected && "text-blue-100/80",
                        feedback && !isSelected && "text-blue-100/60"
                      )}>
                        {option.label_ka}
                      </span>
                      {showCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                      )}
                      {showIncorrect && (
                        <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                      )}
                    </label>
                  )
                })}
              </div>
            )}

            {question.type === 'numeric' && (
              <div className="max-w-xs">
                <Input
                  type="number"
                  value={selectedAnswer?.value ?? ''}
                  onChange={(e) =>
                    setSelectedAnswer({ value: parseFloat(e.target.value) })
                  }
                  disabled={!!feedback}
                  placeholder="შეიყვანეთ პასუხი"
                  className="text-lg h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            )}

            {question.type === 'multi_select' && (
              <div className="grid gap-3">
                {options.map((option) => {
                  const selectedIds = selectedAnswer?.optionIds || []
                  const isChecked = selectedIds.includes(option.id)

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "relative flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 group",
                        isChecked
                          ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20",
                        feedback ? "pointer-events-none opacity-80" : ""
                      )}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newIds = e.target.checked
                              ? [...selectedIds, option.id]
                              : selectedIds.filter((id: string) => id !== option.id)
                            setSelectedAnswer({ optionIds: newIds })
                          }}
                          disabled={!!feedback}
                          className="peer sr-only"
                        />
                        <div className={cn(
                          "w-5 h-5 rounded border-2 transition-all flex items-center justify-center",
                          isChecked
                            ? "border-blue-500 bg-blue-500"
                            : "border-white/30 group-hover:border-white/60"
                        )}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <span className={cn(
                        "text-lg font-medium transition-colors",
                        isChecked ? "text-blue-200" : "text-blue-100/80"
                      )}>
                        {option.label_ka}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {feedback && !feedback.isCorrect && (
            <div className="mb-4 lg:mb-4 p-3 lg:p-3 rounded-lg lg:rounded-xl border animate-slide-up flex items-center gap-3 lg:gap-3 bg-red-500/10 border-red-500/20 backdrop-blur-sm">
              <XCircle className="w-5 h-5 lg:w-5 lg:h-5 text-red-400 flex-shrink-0" />
              <span className="text-sm lg:text-sm font-medium text-red-200">
                არასწორია. სცადეთ თავიდან
              </span>
              {attemptNumber < 3 && (
                <span className="text-xs text-red-400 ml-auto font-bold bg-red-500/10 px-2 py-1 rounded">
                  {attemptNumber}/3
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-black/20 border-t border-white/5 p-3 sm:p-4 lg:p-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 lg:gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowHint(!showHint)}
            disabled={true}
            className="text-blue-200/40 hover:text-blue-200 hover:bg-white/5 w-full sm:w-auto cursor-not-allowed text-sm sm:text-base lg:text-sm lg:py-2"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            მინიშნება
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            {feedback && !feedback.isCorrect && (
              <Button
                variant="secondary"
                onClick={handleReset}
                className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border border-white/10 text-sm sm:text-base lg:text-sm lg:py-2.5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                თავიდან
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitting || !!feedback}
              className={cn(
                "w-full sm:w-auto min-w-[140px] lg:min-w-[160px] font-bold shadow-lg transition-all lg:text-base lg:py-3",
                feedback?.isCorrect
                  ? "hidden"
                  : "bg-gradient-to-r from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] text-white border border-blue-400/30 hover:from-[#2a4a70] hover:via-[#3d5a80] hover:to-[#2a4a70] hover:border-blue-400/50 hover:shadow-blue-500/20 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              )}
            >
              {isSubmitting ? (
                <span className="animate-pulse">მოწმდება...</span>
              ) : (
                "პასუხის შემოწმება"
              )}
            </Button>
          </div>
        </div>
      </div>

      {feedback?.isCorrect && (
        <div className="mt-3 sm:mt-4 lg:mt-3 rounded-lg lg:rounded-xl bg-[#0f172a]/50 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] animate-slide-up overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <div className="px-4 sm:px-5 lg:px-5 py-2.5 sm:py-3 lg:py-3 flex items-center justify-between gap-3 sm:gap-4 lg:gap-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
              </div>
              <div className="text-base lg:text-lg font-black text-emerald-400 georgian-heading text-glow">
                სწორია!
              </div>
            </div>

            {xpResult && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-lg">✨</span>
                <span className="text-emerald-400 font-black text-base">+{xpResult.xp_gained} XP</span>
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showFailedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowFailedModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white georgian-heading mb-2">
                  3 მცდელობა ამოიწურა
                </h3>
                <p className="text-blue-200/60 georgian-body">
                  არ ინერვიულო! შეგიძლია თავიდან სცადო ან სხვა გაკვეთილი აირჩიო.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowFailedModal(false)
                    setAttemptNumber(1)
                    setSelectedAnswer(null)
                    setFeedback(null)
                  }}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold georgian-body hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  თავიდან დაწყება
                </button>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="w-full py-3 px-6 rounded-xl bg-white/10 text-white font-bold georgian-body border border-white/10 hover:bg-white/20 transition-all duration-300"
                >
                  გასვლა
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
