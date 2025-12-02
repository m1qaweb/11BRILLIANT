import { requireAuth, getUserProfile } from '@/lib/auth/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'ჩემი გვერდი - გონი',
  description: 'თქვენი სასწავლო გვერდი',
}

export default async function DashboardPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Fetch user profile
  const profile = await getUserProfile(user.id)

  // Fetch streak data
  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fetch lesson progress with lesson details
  const { data: lessonProgress } = await supabase
    .from('lesson_progress')
    .select(`
      *,
      lesson:lessons(
        id,
        title,
        slug,
        estimated_minutes,
        course:courses(
          id,
          title,
          slug,
          subject:subjects(
            id,
            title,
            slug
          )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('last_viewed_at', { ascending: false })
    .limit(5)

  // Fetch total question attempts
  const { count: totalAttempts } = await supabase
    .from('question_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Fetch correct question attempts
  const { count: correctAttempts } = await supabase
    .from('question_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_correct', true)

  // Calculate accuracy
  const accuracy = totalAttempts && totalAttempts > 0
    ? Math.round((correctAttempts! / totalAttempts) * 100)
    : 0

  // Fetch completed lessons count
  const { count: completedLessons } = await supabase
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  // Find in-progress lesson (most recently viewed, not completed)
  const inProgressLesson = lessonProgress?.find(lp => lp.status !== 'completed')

  return (
    <div className="bg-cosmic-main">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 animate-slide-up relative">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 p-[2px] animate-pulse-glow">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                    <span className="text-4xl">👨‍🚀</span>
                  </div>
                </div>
                {/* Orbital Ring */}
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full scale-125 animate-spin-slow border-t-transparent"></div>
              </div>
              <div>

                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight georgian-heading mb-2">
                  გამარჯობა, <span className="text-gradient-cosmic">{profile?.display_name || user.email?.split('@')[0]}</span>
                </h1>
                <p className="text-xl text-blue-200/60 georgian-body font-medium">
                  მზად ხარ ახალი აღმოჩენებისთვის? 🚀
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Current Streak */}
            <div className="relative overflow-hidden rounded-3xl p-6 border border-orange-500/30 bg-[#0f172a]/60 backdrop-blur-xl shadow-2xl shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <div className="text-8xl">🔥</div>
              </div>
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-lg font-black text-orange-400 uppercase tracking-wider georgian-body">სტრიქი</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-orange-400 tracking-tight">
                    {streak?.current_streak_days || 0}
                  </span>
                  <span className="text-sm text-white/40 font-bold georgian-body">დღე</span>
                </div>
              </div>
            </div>

            {/* Lessons Completed */}
            <div className="relative overflow-hidden rounded-3xl p-6 border border-green-500/30 bg-[#0f172a]/60 backdrop-blur-xl shadow-2xl shadow-green-500/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <div className="text-8xl">✅</div>
              </div>
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-lg font-black text-green-400 uppercase tracking-wider georgian-body">დასრულებული</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-green-400 tracking-tight">
                    {completedLessons || 0}
                  </span>
                  <span className="text-sm text-white/40 font-bold georgian-body">გაკვეთილი</span>
                </div>
              </div>
            </div>

            {/* Questions Answered */}
            <div className="relative overflow-hidden rounded-3xl p-6 border border-blue-500/30 bg-[#0f172a]/60 backdrop-blur-xl shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <div className="text-8xl">📝</div>
              </div>
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-lg font-black text-blue-400 uppercase tracking-wider georgian-body">პასუხები</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-blue-400 tracking-tight">
                    {totalAttempts || 0}
                  </span>
                  <span className="text-sm text-white/40 font-bold georgian-body">სულ</span>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="relative overflow-hidden rounded-3xl p-6 border border-purple-500/30 bg-[#0f172a]/60 backdrop-blur-xl shadow-2xl shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <div className="text-8xl">🎯</div>
              </div>
              <div className="relative z-10">
                <div className="mb-4">
                  <p className="text-lg font-black text-purple-400 uppercase tracking-wider georgian-body">სიზუსტე</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-purple-400 tracking-tight">
                    {accuracy}%
                  </span>
                  <span className="text-sm text-white/40 font-bold georgian-body">სწორი</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning - Holographic Card */}
          {inProgressLesson && (
            <div className="relative group mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="glass-panel p-1 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[20px] p-8 md:p-12 relative z-10 overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-xs mb-4 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                        <span className="animate-pulse">⚡</span> გააგრძელე სწავლა
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-white mb-4 georgian-heading leading-tight">
                        მზად ხარ შემდეგი<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">გამოწვევისთვის?</span>
                      </h2>
                      <p className="text-blue-200/70 text-lg max-w-xl georgian-body">
                        შენ გაჩერდი გაკვეთილზე: <span className="text-white font-bold">{inProgressLesson.lesson?.title}</span>.
                        დაასრულე ახლავე და მიიღე +50 XP!
                      </p>
                    </div>

                    {(() => {
                      const lesson = inProgressLesson.lesson as any
                      const course = lesson?.course

                      return (
                        <Link
                          href={`/courses/${course?.slug}/lessons/${lesson?.slug}`}
                          className="relative group/btn overflow-hidden rounded-2xl bg-white p-[1px] w-full md:w-auto"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-100 animate-shine"></div>
                          <div className="relative bg-[#0f172a] hover:bg-primary/10 w-full md:w-auto h-full rounded-2xl px-8 py-4 transition-colors duration-200 flex items-center justify-center gap-3 group-hover/btn:bg-transparent">
                            <span className="text-lg font-bold text-white group-hover/btn:text-white transition-colors georgian-body">
                              გაკვეთილის გაგრძელება
                            </span>
                            <svg className="w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </Link>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4 mb-8">

              <h2 className="text-2xl font-black text-white georgian-heading">ბოლო აქტივობა</h2>
            </div>

            {lessonProgress && lessonProgress.length > 0 ? (
              <div className="space-y-4">
                {lessonProgress.map((progress: any) => {
                  const lesson = progress.lesson
                  const course = lesson?.course
                  const subject = course?.subject

                  return (
                    <div
                      key={progress.id}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${progress.status === 'completed'
                          ? 'bg-green-500/20 border-green-500/30 text-green-400'
                          : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                          }`}>
                          {progress.status === 'completed' ? '✓' : '→'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg mb-1 group-hover:text-primary transition-colors">
                            {lesson?.title}
                          </div>
                          <div className="text-sm text-blue-200/50 font-medium">
                            {subject?.title} • {course?.title}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block text-right">
                        <div className="text-xs font-bold text-white/30 uppercase tracking-wider mb-1">
                          {progress.status === 'completed' ? 'დასრულდა' : 'ნანახია'}
                        </div>
                        <div className="text-sm font-medium text-white/60">
                          {progress.status === 'completed'
                            ? new Date(progress.completed_at).toLocaleDateString('ka-GE')
                            : new Date(progress.last_viewed_at).toLocaleDateString('ka-GE')
                          }
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <span className="text-4xl">📚</span>
                </div>
                <p className="text-xl text-white font-bold mb-2">ჯერ არ დაგიწყიათ გაკვეთილები</p>
                <p className="text-blue-200/60 mb-8">აირჩიე სასურველი საგანი და დაიწყე სწავლა დღესვე!</p>
                <Link href="/subjects" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  ნახე საგნები
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
