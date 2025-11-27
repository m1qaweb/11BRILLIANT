import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, Play, CheckCircle, Lock, MapPin } from 'lucide-react'

// Manual type definitions
type Subject = {
  id: string
  code: string
  name_ka: string
  name_en: string
}

type Lesson = {
  id: string
  title_ka: string
  slug: string
  description_ka: string | null
  course_id: string
  order_index: number
}

interface SubjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: SubjectPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: subject } = await supabase
    .from('subjects')
    .select('name_ka, name_en')
    .eq('code', resolvedParams.slug)
    .single()

  return {
    title: subject ? `${subject.name_ka} - Brilliant Clone` : 'საგანი ვერ მოიძებნა',
    description: subject ? `ისწავლე ${subject.name_ka} ინტერაქტიულად` : 'სწავლა',
  }
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Fetch subject
  const { data: subject, error: subjectError } = await supabase
    .from('subjects')
    .select('*')
    .eq('code', resolvedParams.slug)
    .single()

  if (subjectError || !subject) {
    notFound()
  }

  // Fetch courses for this subject (to get course IDs)
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .select('id')
    .eq('subject_id', subject.id)
    .eq('is_published', true)

  if (coursesError) {
    console.error('Error fetching courses:', coursesError)
  }

  const courseIds = (coursesData || []).map(c => c.id)

  // Only fetch lessons if we have course IDs
  let lessonsData = null
  let lessonsError = null

  if (courseIds.length > 0) {
    const result = await supabase
      .from('lessons')
      .select('*')
      .in('course_id', courseIds)
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    lessonsData = result.data
    lessonsError = result.error

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
    }
  } else {
    console.warn(`No courses found for subject: ${subject.name_ka} (${subject.code})`)
  }

  const lessons = lessonsData || []

  return (
    <div className="min-h-screen py-12 relative overflow-hidden bg-[#0f172a]">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm font-medium animate-slide-up">
          <Link href="/subjects" className="text-blue-300 hover:text-white transition-colors">
            საგნები
          </Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/80">{subject.name_ka}</span>
        </nav>

        {/* Subject Header */}
        <div className="mb-16 animate-slide-up">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md">
              📚
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-2 georgian-heading tracking-tight text-glow">
                {subject.name_ka}
              </h1>
              <p className="text-xl text-blue-200/60 georgian-body">
                {subject.name_en}
              </p>
            </div>
          </div>
        </div>

        {/* Star Map (Lessons) */}
        <div className="max-w-3xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute left-[28px] top-8 bottom-8 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 opacity-30 rounded-full"></div>

          <div className="space-y-12">
            {!lessons || lessons.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl animate-slide-up">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Star className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-blue-200/60 text-lg georgian-body">
                  ამ საგანში გაკვეთილები ჯერ არ დამატებულა.
                </p>
              </div>
            ) : (
              lessons.map((lesson: Lesson, index: number) => (
                <div
                  key={lesson.id}
                  className="relative pl-20 group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Node on the line */}
                  <div className="absolute left-0 top-8 -translate-y-1/2 w-14 h-14 rounded-full bg-[#0f172a] border-4 border-[#0f172a] z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-shadow">
                      <span className="text-white font-black text-lg">{index + 1}</span>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${subject.code}/lessons/${lesson.slug}`}
                    className="block"
                  >
                    <div className="glass-panel p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20 group-hover:translate-x-2 relative overflow-hidden">
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 georgian-heading group-hover:text-cyan-300 transition-colors">
                            {lesson.title_ka}
                          </h3>
                          {lesson.description_ka && (
                            <p className="text-blue-200/50 text-sm line-clamp-2 georgian-body">
                              {lesson.description_ka}
                            </p>
                          )}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                          <Play className="w-5 h-5 text-white/40 group-hover:text-white fill-current" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-20 text-center">
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10"
          >
            <span>←</span> ყველა საგანი
          </Link>
        </div>
      </div>
    </div>
  )
}
