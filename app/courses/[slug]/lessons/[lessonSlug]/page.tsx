import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SingleQuestionQuiz } from '@/components/single-question-quiz'
import { LessonAuthWrapper } from '@/components/lesson-auth-wrapper'
import { Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'

type Lesson = {
  id: string
  title_ka: string
  slug: string
  summary_ka: string | null
  estimated_minutes: number | null
  content_blocks: any // JSONB
  course_id: string
}

type Course = {
  id: string
  title_ka: string
  slug: string
  subject_id: string
}

type Subject = {
  id: string
  code: string
  name_ka: string
}

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

interface LessonPageProps {
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export async function generateMetadata({ params }: LessonPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title_ka, summary_ka')
    .eq('slug', resolvedParams.lessonSlug)
    .single()

  return {
    title: lesson ? `${lesson.title_ka} - Brilliant Clone` : 'გაკვეთილი ვერ მოიძებნა',
    description: lesson?.summary_ka || 'ინტერაქტიული გაკვეთილი',
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select(`
      *,
      course:courses(
        *,
        subject:subjects(*)
      )
    `)
    .eq('slug', resolvedParams.lessonSlug)
    .single()

  if (lessonError || !lesson) {
    notFound()
  }

  const course = lesson.course as unknown as Course & { subject: Subject }
  const subject = course.subject

  const { data: questionsData, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('order_index')

  if (questionsError) {
    console.error('Error fetching questions:', questionsError)
  }

  const questionIds = (questionsData || []).map(q => q.id)
  const { data: optionsData, error: optionsError } = await supabase
    .from('question_options')
    .select('*')
    .in('question_id', questionIds.length > 0 ? questionIds : [''])
    .order('order_index')

  if (optionsError) {
    console.error('Error fetching options:', optionsError)
  }

  const optionsByQuestion = (optionsData || []).reduce((acc, option) => {
    if (!acc[option.question_id]) {
      acc[option.question_id] = []
    }
    acc[option.question_id].push(option)
    return acc
  }, {} as Record<string, QuestionOption[]>)

  const questions = (questionsData || []).map(q => ({
    ...q,
    options: (optionsByQuestion[q.id] || []).sort((a: QuestionOption, b: QuestionOption) => a.order_index - b.order_index)
  })) as unknown as Question[]

  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, slug, title_ka, order_index')
    .eq('course_id', lesson.course_id)
    .order('order_index')

  const currentIndex = allLessons?.findIndex(l => l.id === lesson.id) ?? -1
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && allLessons ? allLessons[currentIndex + 1] : null

  const hasQuestions = questions && questions.length > 0

  return (
    <LessonAuthWrapper hasQuestions={hasQuestions} lessonSlug={resolvedParams.lessonSlug}>
      <div className="min-h-screen">
        {!hasQuestions && (
          <>
            <div className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <nav className="text-sm text-blue-200/60 flex items-center gap-2 font-medium">
                    <Link href="/subjects" className="hover:text-white transition-colors">
                      საგნები
                    </Link>
                    <span className="text-white/20">/</span>
                    <Link href={`/subjects/${subject.code}`} className="hover:text-white transition-colors">
                      {subject.name_ka}
                    </Link>
                    <span className="text-white/20">/</span>
                    <Link href={`/courses/${course.slug}`} className="hover:text-white transition-colors">
                      {course.title_ka}
                    </Link>
                    <span className="text-white/20">/</span>
                    <span className="text-white font-bold">{lesson.title_ka}</span>
                  </nav>

                  {allLessons && allLessons.length > 1 && (
                    <div className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-200">
                      გაკვეთილი {currentIndex + 1} / {allLessons.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-12">
              <div className="max-w-4xl mx-auto">
                <div className="mb-12 animate-slide-up">
                  <div className="flex items-center gap-3 mb-4">
                    {lesson.estimated_minutes && (
                      <span className="text-sm text-blue-300 font-bold flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Clock className="w-4 h-4" />
                        {lesson.estimated_minutes} წთ
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black mb-6 text-white georgian-heading text-glow leading-tight">
                    {lesson.title_ka}
                  </h1>

                  {lesson.summary_ka && (
                    <p className="text-xl text-blue-200/70 georgian-body leading-relaxed">
                      {lesson.summary_ka}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {hasQuestions ? (
          <div className="container mx-auto px-2 sm:px-3 lg:px-4 pt-8 sm:pt-12 lg:pt-2">
            <SingleQuestionQuiz
              questions={questions}
              lessonId={lesson.id}
              lessonTitle={lesson.title_ka}
            />
          </div>
        ) : (
          <div className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="glass-panel p-8 md:p-12 rounded-3xl mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="prose prose-invert prose-lg max-w-none georgian-body">
                  {lesson.content_blocks && Array.isArray(lesson.content_blocks) ? (
                    lesson.content_blocks.map((block: any, index: number) => {
                      if (block.type === 'markdown') {
                        return (
                          <div key={index} dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />
                        )
                      }
                      return null
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <BookOpen className="w-16 h-16 text-white/10 mb-4" />
                      <p className="text-blue-200/40 text-lg font-medium">შინაარსი მალე დაემატება.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div>
                  {prevLesson ? (
                    <Link
                      href={`/courses/${resolvedParams.slug}/lessons/${prevLesson.slug}`}
                      className="group flex items-center gap-4 text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-200/40 font-bold uppercase tracking-wider mb-1">წინა გაკვეთილი</div>
                        <div className="text-white font-bold group-hover:text-blue-300 transition-colors">{prevLesson.title_ka}</div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${resolvedParams.slug}`}
                      className="group flex items-center gap-2 text-blue-200/60 hover:text-white font-bold transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>კურსზე დაბრუნება</span>
                    </Link>
                  )}
                </div>

                <div>
                  {nextLesson ? (
                    <Link
                      href={`/courses/${resolvedParams.slug}/lessons/${nextLesson.slug}`}
                      className="group flex items-center gap-4 text-right"
                    >
                      <div>
                        <div className="text-xs text-blue-200/40 font-bold uppercase tracking-wider mb-1">შემდეგი გაკვეთილი</div>
                        <div className="text-white font-bold group-hover:text-blue-300 transition-colors">{nextLesson.title_ka}</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-110 transition-all">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${resolvedParams.slug}`}
                      className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all"
                    >
                      <span>კურსის დასრულება</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LessonAuthWrapper>
  )
}
