// Supabase Edge Function: submit-answer
// Deno runtime - alternative to Next.js Server Actions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Grading logic (pure functions)
function gradeAnswer(
  type: string,
  submittedAnswer: any,
  correctAnswer: any,
  config: any = {}
): { isCorrect: boolean; feedback: string } {
  switch (type) {
    case 'mcq':
      return gradeMCQ(submittedAnswer, correctAnswer)
    case 'numeric':
      return gradeNumeric(submittedAnswer, correctAnswer, config)
    case 'boolean':
      return gradeBoolean(submittedAnswer, correctAnswer)
    case 'multi_select':
      return gradeMultiSelect(submittedAnswer, correctAnswer)
    default:
      return { isCorrect: false, feedback: 'Unknown question type' }
  }
}

function gradeMCQ(submitted: any, correct: any) {
  const isCorrect = submitted?.index === correct?.index
  return {
    isCorrect,
    feedback: isCorrect
      ? 'Correct! Well done!'
      : 'Incorrect. Please review the question and try again.'
  }
}

function gradeNumeric(submitted: any, correct: any, config: any) {
  const submittedValue = Number(submitted?.value)
  const correctValue = Number(correct?.value)
  const tolerance = config.tolerance || 0.01
  const diff = Math.abs(submittedValue - correctValue)
  const isCorrect = diff <= tolerance

  return {
    isCorrect,
    feedback: isCorrect
      ? 'Correct!'
      : `Incorrect. The correct answer is ${correctValue}.`
  }
}

function gradeBoolean(submitted: any, correct: any) {
  const isCorrect = submitted?.value === correct?.value
  return {
    isCorrect,
    feedback: isCorrect ? 'Correct!' : 'Incorrect. Try again!'
  }
}

function gradeMultiSelect(submitted: any, correct: any) {
  const submittedIndices = (submitted?.indices || []).sort()
  const correctIndices = (correct?.indices || []).sort()
  const isCorrect = JSON.stringify(submittedIndices) === JSON.stringify(correctIndices)

  return {
    isCorrect,
    feedback: isCorrect
      ? 'Correct! You selected all the right answers.'
      : 'Incorrect. Please review your selections.'
  }
}

// Main handler
serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Parse request body
    const { questionId, lessonId, submittedAnswer, attemptNumber } = await req.json()

    // Fetch question
    const { data: question, error: questionError } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (questionError || !question) {
      throw new Error('Question not found')
    }

    // Grade the answer
    const gradingConfig = question.grading_config || {}
    const result = gradeAnswer(
      question.type,
      submittedAnswer,
      question.correct_answer,
      gradingConfig
    )

    // Calculate points
    const pointsEarned = result.isCorrect ? (question.points || 1) : 0

    // Store attempt
    const { error: insertError } = await supabaseClient
      .from('question_attempts')
      .insert({
        user_id: user.id,
        question_id: questionId,
        submitted_answer: submittedAnswer,
        is_correct: result.isCorrect,
        attempt_number: attemptNumber,
        points_earned: pointsEarned,
      })

    if (insertError) {
      console.error('Failed to store attempt:', insertError)
    }

    // Check lesson completion (simplified version)
    if (result.isCorrect) {
      // Get all questions in lesson
      const { data: allQuestions } = await supabaseClient
        .from('questions')
        .select('id')
        .eq('lesson_id', lessonId)

      // Get correct attempts
      const { data: correctAttempts } = await supabaseClient
        .from('question_attempts')
        .select('question_id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .eq('is_correct', true)

      if (allQuestions && correctAttempts) {
        const uniqueCorrect = new Set(correctAttempts.map(a => a.question_id))
        const allCorrect = allQuestions.every(q => uniqueCorrect.has(q.id))

        if (allCorrect) {
          // Update lesson progress
          await supabaseClient
            .from('lesson_progress')
            .upsert({
              user_id: user.id,
              lesson_id: lessonId,
              is_completed: true,
              completed_at: new Date().toISOString(),
              score: pointsEarned,
            })

          // Update streak
          const today = new Date().toISOString().split('T')[0]
          const { data: streak } = await supabaseClient
            .from('streaks')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (!streak) {
            await supabaseClient.from('streaks').insert({
              user_id: user.id,
              current_streak: 1,
              longest_streak: 1,
              last_activity_date: today,
            })
          } else if (streak.last_activity_date !== today) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split('T')[0]

            const newStreak = streak.last_activity_date === yesterdayStr
              ? streak.current_streak + 1
              : 1

            await supabaseClient
              .from('streaks')
              .update({
                current_streak: newStreak,
                longest_streak: Math.max(newStreak, streak.longest_streak),
                last_activity_date: today,
              })
              .eq('user_id', user.id)
          }
        }
      }
    }

    // Return result
    return new Response(
      JSON.stringify({
        success: true,
        isCorrect: result.isCorrect,
        feedback: result.feedback,
        attemptNumber,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
