import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Database } from '@/types/database'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'

type Course = Database['public']['Tables']['courses']['Row'] & {
    subjects?: { name_ka: string; name_en: string; code: string } | null
}

export const metadata = {
    title: 'კურსები - Brilliant Clone',
    description: 'დაათვალიერეთ ჩვენი ინტერაქტიული კურსები',
}

export default async function CoursesPage() {
    const supabase = await createClient()

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*, subjects(name_ka, name_en, code)')
        .eq('grade_id', 7)
        .order('order_index')

    if (error) {
        console.error('Error fetching courses:', error)
    }

    return (
        <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span>VII კლასი</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white georgian-heading text-glow">
                            ხელმისაწვდომი კურსები
                        </h1>
                        <p className="text-xl text-blue-200/60 georgian-body leading-relaxed">
                            აირჩიეთ საგანი და დაიწყეთ თავგადასავალი ცოდნის სამყაროში.
                        </p>
                    </div>

                    {!courses || courses.length === 0 ? (
                        <div className="glass-panel p-12 text-center max-w-lg mx-auto">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-blue-200/40" />
                            </div>
                            <p className="text-lg text-blue-200/60 georgian-body">კურსები ჯერ არ დამატებულა.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course, index) => (
                                <Link
                                    key={course.id}
                                    href={`/courses/${course.slug}`}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                                    <div className="relative h-full glass-card p-1 rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-500">
                                        <div className="h-full bg-[#0f172a]/90 backdrop-blur-xl rounded-[22px] overflow-hidden flex flex-col">
                                            {/* Header with Gradient */}
                                            <div className="h-48 relative overflow-hidden">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${course.subjects?.code === 'math' ? 'from-blue-600 to-cyan-500' :
                                                        course.subjects?.code === 'bio' ? 'from-emerald-600 to-green-500' :
                                                            course.subjects?.code === 'hist' ? 'from-amber-600 to-orange-500' :
                                                                course.subjects?.code === 'geo' ? 'from-indigo-600 to-purple-500' :
                                                                    course.subjects?.code === 'en_lang' ? 'from-rose-600 to-pink-500' :
                                                                        'from-slate-600 to-gray-500'
                                                    } opacity-80 group-hover:scale-110 transition-transform duration-700`}></div>

                                                {/* Overlay Pattern */}
                                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30 mix-blend-overlay"></div>

                                                {/* Subject Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 text-xs font-bold text-white tracking-wider shadow-lg">
                                                        {course.subjects?.name_ka || 'კურსი'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors georgian-heading">
                                                    {course.title_ka}
                                                </h2>

                                                {course.description_ka && (
                                                    <p className="text-blue-200/60 text-sm leading-relaxed mb-6 flex-1 georgian-body line-clamp-3">
                                                        {course.description_ka}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                                    <span className="text-xs font-medium text-blue-200/40 uppercase tracking-widest">VII კლასი</span>
                                                    <span className="text-sm font-bold text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                        დაწყება
                                                        <ArrowRight className="w-4 h-4 text-blue-400" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
