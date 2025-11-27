// Question and grading types

export type QuestionType = 'mcq' | 'single_choice' | 'numeric' | 'boolean' | 'multi_select' | 'interactive'

export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

// Grading Configuration
export interface GradingConfig {
  numeric: {
    tolerance: number
    acceptEquivalentForms: boolean
  }
  multiSelect: {
    allowPartialCredit: boolean
    partialCreditFormula: 'proportional' | 'all_or_nothing'
  }
  attempts: {
    maxAttempts: number | null
    hintsAvailableAfter: number
    lockAfterCorrect: boolean
  }
  timing: {
    trackTimeSpent: boolean
    timeoutSeconds: number | null
  }
}

// Answer validation structures
export interface MCQAnswer {
  index: number
  value?: string
}

export interface MultiSelectAnswer {
  indices: number[]
  order?: 'any' | 'exact'
}

export interface NumericAnswer {
  value: number
  tolerance: number
  toleranceType: 'absolute' | 'percentage'
  acceptedFormats?: string[]
}

export interface BooleanAnswer {
  value: boolean
}

export type CorrectAnswer = MCQAnswer | MultiSelectAnswer | NumericAnswer | BooleanAnswer

// User submission types
export interface QuestionSubmission {
  questionId: string
  userId: string
  answer: any
  timeSpentMs?: number
  hintsUsed: number
}

// Grading result
export interface GradingResult {
  isCorrect: boolean
  feedback: string
  correctAnswer?: any
  nextHintAvailable: boolean
  hintsRemaining: number
  attemptsUsed: number
  attemptsRemaining: number | null
  points: number
  explanation: string | null
}

// Question with hints
export interface QuestionWithHints {
  id: string
  lesson_id: string
  order_index: number
  type: QuestionType
  prompt_md: string
  options_json: any
  correct_answer: any
  solution_md: string | null
  difficulty: QuestionDifficulty | null
  is_required: boolean
  points: number
  tags: string[] | null
  hints: Array<{
    id: string
    order_index: number
    hint_md: string
  }>
}

// Attempt history
export interface AttemptHistory {
  attemptNumber: number
  submittedAt: string
  isCorrect: boolean
  answer: any
  hintsUsed: number
  timeSpentMs: number | null
}
