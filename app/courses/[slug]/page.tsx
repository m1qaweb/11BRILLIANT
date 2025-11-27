import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Manual type definitions
type Course = {
  id: string
  title_ka: string
  title_en: string | null
  slug: string
  description_ka: string | null
  subject_id: string
  grade_id: number
}

type Lesson = {
  id: string
  title_ka: string
  slug: string
  order_index: number
  summary_ka: string | null
  estimated_minutes: number | null
}

type Subject = {
  id: string
  code: string
  name_ka: string
}

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CoursePageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('title_ka, description_ka')
    .eq('slug', resolvedParams.slug)
    .single()

  return {
    title: course ? `${course.title_ka} - Brilliant Clone` : 'კურსი ვერ მოიძებნა',
    description: course?.description_ka || 'ინტერაქტიული კურსი',
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Fetch course with subject info
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      *,
      subject:subjects(*)
    `)
    .eq('slug', resolvedParams.slug)
    .single()

  if (courseError || !course) {
    notFound()
  }

  // Fetch lessons for this course
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index')

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError)
  }

  const subject = course.subject as unknown as Subject

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/subjects" className="hover:text-blue-600">
          საგნები
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/subjects/${subject.code}`}
          className="hover:text-blue-600"
        >
          {subject.name_ka}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{course.title_ka}</span>
      </nav>

      {/* Course Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {course.title_ka}
        </h1>

        {course.description_ka && (
          <p className="text-xl text-gray-600 mb-4">
            {course.description_ka}
          </p>
        )}

        {/* Course Stats */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{lessons?.length || 0} გაკვეთილი</span>
          </div>

          {lessons && lessons.length > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {lessons.reduce((total: number, lesson: any) => total + (lesson.estimated_minutes || 0), 0)} წთ სულ
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lessons Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          კურსის შინაარსი
        </h2>

        {!lessons || lessons.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg">
              გაკვეთილები ჯერ არ დამატებულა.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson: any, index: number) => (
              <Link
                key={lesson.id}
                href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                className="block group"
              >
                <div className="card hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-600">
                  <div className="flex items-start gap-4">
                    {/* Lesson Number */}
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                          {lesson.title_ka}
                        </h3>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {lesson.estimated_minutes && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {lesson.estimated_minutes} წთ
                            </span>
                          )}
                        </div>
                      </div>

                      {lesson.summary_ka && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {lesson.summary_ka}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {lessons && lessons.length > 0 && (
        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">მზად ხარ სწავლისთვის?</h3>
          <p className="text-gray-600 mb-6">
            დაიწყე პირველი გაკვეთილით და განავითარე შენი უნარები.
          </p>
          <Link
            href={`/courses/${course.slug}/lessons/${lessons[0].slug}`}
            className="btn-primary text-lg inline-block"
          >
            დაიწყე სწავლა →
          </Link>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-12">
        <Link
          href={`/subjects/${subject.code}`}
          className="text-blue-600 hover:underline font-medium"
        >
          ← უკან: {subject.name_ka}
        </Link>
      </div>
    </div>
  )
}
