import { QuestionType, GradingResult, MCQAnswer, NumericAnswer, BooleanAnswer, MultiSelectAnswer } from '@/types/questions'

/**
 * Grade a user's answer against the correct answer
 * Returns detailed grading result with feedback
 */
export function gradeAnswer(
  questionType: QuestionType,
  submittedAnswer: any,
  correctAnswer: any,
  config?: Partial<{
    tolerance: number
    toleranceType: 'absolute' | 'percentage'
    allowPartialCredit: boolean
  }>
): { isCorrect: boolean; feedback: string } {
  switch (questionType) {
    case 'mcq':
    case 'single_choice':
      return gradeMCQ(submittedAnswer, correctAnswer)
    
    case 'numeric':
      return gradeNumeric(
        submittedAnswer,
        correctAnswer,
        config?.tolerance ?? 0.01,
        config?.toleranceType ?? 'absolute'
      )
    
    case 'boolean':
      return gradeBoolean(submittedAnswer, correctAnswer)
    
    case 'multi_select':
      return gradeMultiSelect(submittedAnswer, correctAnswer, config?.allowPartialCredit ?? false)
    
    default:
      return { isCorrect: false, feedback: 'Unknown question type' }
  }
}

/**
 * Grade multiple choice question
 * Supports both index-based (legacy) and ID-based (current) answer formats
 */
function gradeMCQ(submitted: any, correct: any): { isCorrect: boolean; feedback: string } {
  // Handle ID-based format (current)
  if (submitted?.optionId && correct?.optionId) {
    const isCorrect = submitted.optionId === correct.optionId
    return {
      isCorrect,
      feedback: isCorrect ? 'სწორია! ✓' : 'არასწორია. სცადე თავიდან!'
    }
  }
  
  // Handle index-based format (legacy)
  const submittedIndex = typeof submitted === 'number' ? submitted : submitted?.index
  const correctIndex = correct?.index

  if (submittedIndex === undefined || submittedIndex === null) {
    return { isCorrect: false, feedback: 'Please select an answer' }
  }

  const isCorrect = submittedIndex === correctIndex

  return {
    isCorrect,
    feedback: isCorrect ? 'სწორია! ✓' : 'არასწორია. სცადე თავიდან!'
  }
}

/**
 * Grade numeric question with tolerance
 */
function gradeNumeric(
  submitted: any,
  correct: NumericAnswer,
  tolerance: number,
  toleranceType: 'absolute' | 'percentage'
): { isCorrect: boolean; feedback: string } {
  const submittedNum = parseNumericInput(submitted)
  
  if (submittedNum === null) {
    return { isCorrect: false, feedback: 'Please enter a valid number' }
  }

  const correctValue = correct.value
  let isCorrect = false

  if (toleranceType === 'absolute') {
    isCorrect = Math.abs(submittedNum - correctValue) <= tolerance
  } else {
    // Percentage tolerance
    const percentDiff = Math.abs((submittedNum - correctValue) / correctValue)
    isCorrect = percentDiff <= tolerance
  }

  return {
    isCorrect,
    feedback: isCorrect 
      ? 'Correct!' 
      : `Not quite. ${tolerance > 0 ? 'Remember, small rounding differences are okay.' : ''}`
  }
}

/**
 * Grade boolean (true/false) question
 */
function gradeBoolean(submitted: any, correct: BooleanAnswer): { isCorrect: boolean; feedback: string } {
  const submittedBool = typeof submitted === 'boolean' ? submitted : submitted?.value

  if (submittedBool === undefined || submittedBool === null) {
    return { isCorrect: false, feedback: 'Please select True or False' }
  }

  const isCorrect = submittedBool === correct.value

  return {
    isCorrect,
    feedback: isCorrect ? 'Correct!' : 'That\'s not the right answer. Think it through again!'
  }
}

/**
 * Grade multi-select question
 */
function gradeMultiSelect(
  submitted: any,
  correct: MultiSelectAnswer,
  allowPartialCredit: boolean
): { isCorrect: boolean; feedback: string } {
  const submittedIndices: number[] = Array.isArray(submitted) ? submitted : submitted?.indices || []
  const correctIndices = correct.indices

  if (submittedIndices.length === 0) {
    return { isCorrect: false, feedback: 'Please select at least one answer' }
  }

  // Check if arrays match (order doesn't matter for 'any')
  const isExactMatch = 
    submittedIndices.length === correctIndices.length &&
    submittedIndices.every(idx => correctIndices.includes(idx))

  if (isExactMatch) {
    return { isCorrect: true, feedback: 'Correct! You selected all the right answers.' }
  }

  if (allowPartialCredit) {
    const correctCount = submittedIndices.filter(idx => correctIndices.includes(idx)).length
    const incorrectCount = submittedIndices.filter(idx => !correctIndices.includes(idx)).length
    const missedCount = correctIndices.filter(idx => !submittedIndices.includes(idx)).length

    if (correctCount > 0 && incorrectCount === 0 && missedCount > 0) {
      return { 
        isCorrect: false, 
        feedback: `You got ${correctCount} correct, but you're missing ${missedCount} more.` 
      }
    }
  }

  return { 
    isCorrect: false, 
    feedback: 'Not all selections are correct. Review your choices and try again!' 
  }
}

/**
 * Parse numeric input from various formats
 */
function parseNumericInput(input: any): number | null {
  if (typeof input === 'number') {
    return isNaN(input) ? null : input
  }

  if (typeof input === 'string') {
    // Remove whitespace and common formatting
    const cleaned = input.trim().replace(/,/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }

  if (input?.value !== undefined) {
    return parseNumericInput(input.value)
  }

  return null
}

/**
 * Calculate attempt-based feedback
 */
export function getAttemptFeedback(
  attemptNumber: number,
  maxAttempts: number | null,
  isCorrect: boolean
): string {
  if (isCorrect) {
    if (attemptNumber === 1) {
      return '🎉 Perfect! You got it on your first try!'
    } else if (attemptNumber === 2) {
      return '✓ Well done! You figured it out!'
    } else {
      return '✓ Correct! Great persistence!'
    }
  }

  if (maxAttempts === null) {
    return 'Try again! You can do this.'
  }

  const remaining = maxAttempts - attemptNumber
  if (remaining === 1) {
    return '⚠️ This is your last attempt. Think carefully!'
  } else if (remaining > 0) {
    return `You have ${remaining} attempts remaining.`
  } else {
    return '❌ No attempts remaining. Review the solution below.'
  }
}
