'use server'

import { createClient } from '@/lib/supabase/server'
import { gradeAnswer } from '@/lib/grading/grade-answer'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'
import { getCurrentUser } from '@/lib/auth/server'

type Question = Database['public']['Tables']['questions']['Row']
type QuestionAttempt = Database['public']['Tables']['question_attempts']['Insert']

interface SubmitAnswerInput {
  questionId: string
  lessonId: string
  submittedAnswer: any
  attemptNumber: number
}

interface SubmitAnswerResult {
  success: boolean
  isCorrect: boolean
  feedback: string
  attemptNumber: number
  xpAwarded?: number
  error?: string
}

/**
 * Server Action to submit and grade a user's answer
 * 
 * Flow:
 * 1. Fetch question from database
 * 2. Grade answer using grading logic
 * 3. Store attempt in database
 * 4. Return feedback to user
 * 5. Revalidate page data
 */
export async function submitAnswer(
  input: SubmitAnswerInput
): Promise<SubmitAnswerResult> {
  // Ensure input is properly serialized at the start
  const { questionId, lessonId, submittedAnswer, attemptNumber } = JSON.parse(JSON.stringify(input))

  try {
    const supabase = await createClient() as any

    let user
    try {
      user = await getCurrentUser()
    } catch (err) {
      // Guest mode - continue without user
      console.log('Guest mode - no user authentication')
    }

    // Note: We allow guest users to practice without saving progress
    // Only logged-in users will have their attempts saved

    // Fetch question details with options
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*, options:question_options(*)')
      .eq('id', questionId)
      .single()

    if (questionError || !question) {
      console.error('Question fetch error:', questionError)
      return {
        success: false,
        isCorrect: false,
        feedback: 'კითხვა ვერ მოიძებნა',
        attemptNumber: attemptNumber,
        error: 'Question fetch failed'
      }
    }

    // For single_choice questions, find the correct answer from options
    let correctAnswer = (question as any).correct_answer

    console.log('--- Debug Submit Answer ---')
    console.log('Question ID:', questionId)
    console.log('Submitted Answer:', JSON.stringify(submittedAnswer))
    console.log('Question Type:', question.type)

    if (question.type === 'single_choice' || question.type === 'mcq') {
      // Use the options we already fetched
      const correctOption = question.options?.find((opt: any) => opt.is_correct === true)

      console.log('Correct Option Found:', correctOption ? correctOption.id : 'None')

      if (correctOption) {
        correctAnswer = { optionId: correctOption.id }
      } else {
        console.error('No correct option found for question:', questionId)
        return {
          success: false,
          isCorrect: false,
          feedback: 'კითხვის კონფიგურაცია არასწორია',
          attemptNumber: attemptNumber,
          error: 'No correct answer configured'
        }
      }
    }

    // Simple grading for single choice questions
    let isCorrect = false
    let feedback = ''

    if (question.type === 'single_choice' || question.type === 'mcq') {
      // Check if submitted answer matches correct answer
      console.log('Comparing:', submittedAnswer?.optionId, 'vs', correctAnswer?.optionId)
      isCorrect = submittedAnswer?.optionId === correctAnswer?.optionId
      console.log('Result:', isCorrect)

      feedback = isCorrect
        ? 'სწორია! შესანიშნავად!'
        : 'არასწორია. სცადეთ თავიდან.'
    } else {
      // For other question types, use the grading function
      const gradingConfig = question.grading_config as any || {}
      const gradingResult = gradeAnswer(
        question.type as any,
        submittedAnswer,
        correctAnswer,
        {
          tolerance: gradingConfig.tolerance,
          toleranceType: gradingConfig.toleranceType,
          allowPartialCredit: gradingConfig.allowPartialCredit,
        }
      )
      isCorrect = gradingResult.isCorrect
      feedback = gradingResult.feedback
    }

    //Calculate points earned
    const pointsEarned = isCorrect ? (question.points || 1) : 0

    // Track XP awarded (declare at function scope)
    let xpAwarded = 0

    // Store attempt in database (only for logged-in users)
    if (user) {
      const attemptData: QuestionAttempt = {
        user_id: user.id,
        question_id: questionId,
        payload_json: submittedAnswer,
        is_correct: isCorrect,
        attempt_number: attemptNumber,
      }

      const { error: insertError } = await supabase
        .from('question_attempts')
        .insert(attemptData)

      if (insertError) {
        console.error('Failed to store attempt:', insertError)
        // Continue anyway - user gets feedback even if storage fails
      }

      // If correct, award XP and check for achievements
      if (isCorrect) {
        // Award XP for correct answer
        const xpAmount = calculateXP(attemptNumber, question.difficulty_level)
        await awardXP(user.id, xpAmount, 'correct_answer', questionId, supabase)
        xpAwarded = xpAmount
        console.log(`Awarded ${xpAmount} XP for correct answer`)

        // PERFORMANCE FIX: Check lesson completion asynchronously (don't block response)
        // This runs in background - user gets instant feedback
        // Bonus XP awarded shortly after (visible on next interaction)
        checkAndUpdateLessonProgress(user.id, lessonId, supabase)
          .then(lessonComplete => {
            if (lessonComplete) {
              // Award bonus XP in background
              return awardXP(user.id, 50, 'lesson_complete', lessonId, supabase)
            }
          })
          .then(() => {
            console.log('Lesson completion check completed (async)')
          })
          .catch(err => {
            console.error('Background lesson check failed:', err)
          })
      }
    }

    // Revalidate the lesson page to show updated attempts
    revalidatePath(`/courses/[slug]/lessons/[lessonSlug]`)

    return {
      success: true,
      isCorrect: isCorrect,
      feedback: feedback,
      attemptNumber: attemptNumber,
      xpAwarded: xpAwarded > 0 ? xpAwarded : undefined,
    }

  } catch (error) {
    console.error('Submit answer error:', error)
    return {
      success: false,
      isCorrect: false,
      feedback: 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.',
      attemptNumber: attemptNumber,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Calculate XP for correct answers
 * Always returns 15 XP per correct answer
 */
function calculateXP(attemptNumber: number, difficulty: number | null): number {
  // Standard 15 XP for all correct answers
  return 15
}

/**
 * Award XP to user
 */
async function awardXP(
  userId: string,
  amount: number,
  reason: string,
  referenceId: string,
  supabase: any
): Promise<void> {
  try {
    // Get or create user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single()

    if (!profile) {
      // Create profile
      await supabase
        .from('user_profiles')
        .insert({ id: userId, total_xp: amount, current_level: 1 })
    } else {
      // Update profile
      await supabase
        .from('user_profiles')
        .update({ total_xp: profile.total_xp + amount })
        .eq('id', userId)
    }

    // Record transaction
    await supabase
      .from('xp_transactions')
      .insert({
        user_id: userId,
        amount,
        reason,
        reference_id: referenceId,
        reference_type: reason === 'correct_answer' ? 'question' : 'lesson'
      })
  } catch (error) {
    console.error('Error awarding XP:', error)
  }
}

/**
 * Check if user has completed all questions in a lesson
 * If so, update lesson_progress table
 * Returns true if lesson was just completed
 */
async function checkAndUpdateLessonProgress(
  userId: string,
  lessonId: string,
  supabase: any
): Promise<boolean> {
  try {
    // CRITICAL FIX: Check if lesson already completed to prevent duplicate bonuses
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('status, completed_at')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single()

    // If already completed, return false (don't award bonus again)
    if (existingProgress?.status === 'completed' && existingProgress.completed_at) {
      console.log(`Lesson ${lessonId} already completed, skipping bonus XP`)
      return false
    }

    // Get all questions in lesson
    const { data: questions } = await supabase
      .from('questions')
      .select('id')
      .eq('lesson_id', lessonId)

    if (!questions || questions.length === 0) {
      return false
    }

    // Get all correct attempts for this user in this lesson
    const { data: correctAttempts } = await supabase
      .from('question_attempts')
      .select('question_id')
      .eq('user_id', userId)
      .in('question_id', questions.map((q: any) => q.id))
      .eq('is_correct', true)

    if (!correctAttempts) {
      return false
    }

    // Get unique questions answered correctly
    const uniqueCorrectQuestions = new Set(
      correctAttempts.map((a: any) => a.question_id)
    )

    // Check if all questions answered correctly
    const allQuestionsCorrect = questions.every((q: any) =>
      uniqueCorrectQuestions.has(q.id)
    )

    if (allQuestionsCorrect) {
      // Mark lesson as completed (FIRST TIME ONLY)
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          status: 'completed',
          completed_at: new Date().toISOString(),
          last_viewed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id'
        })

      // Update user's streak
      await updateStreak(userId, supabase)

      console.log(`Lesson ${lessonId} completed for first time! Awarding bonus XP.`)
      return true // Lesson was JUST completed (first time)
    }

    return false // Lesson not yet complete
  } catch (error) {
    console.error('Error checking lesson progress:', error)
    return false // Error occurred
  }
}

/**
 * Update user's daily streak
 */
async function updateStreak(
  userId: string,
  supabase: any
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    // Get or create streak record
    const { data: streak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!streak) {
      // Create new streak
      await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak_days: 1,
          longest_streak_days: 1,
          last_active_date: today,
        })
    } else {
      const lastDate = streak.last_active_date
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let newStreak = streak.current_streak_days

      if (lastDate === today) {
        // Already counted today, no change
        return
      } else if (lastDate === yesterdayStr) {
        // Consecutive day
        newStreak += 1
      } else {
        // Streak broken
        newStreak = 1
      }

      const newLongest = Math.max(newStreak, streak.longest_streak_days)

      await supabase
        .from('streaks')
        .update({
          current_streak_days: newStreak,
          longest_streak_days: newLongest,
          last_active_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
    }
  } catch (error) {
    console.error('Error updating streak:', error)
    // Don't throw - this is background work
  }
}
