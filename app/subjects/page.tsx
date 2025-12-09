import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Globe, Calculator, FlaskConical, Hourglass, Languages } from 'lucide-react'

// Manual type definition since we can't run type gen easily
type Subject = {
  id: string
  code: string
  name_ka: string
  name_en: string
}

export const metadata = {
  title: 'საგნები - Brilliant Clone',
  description: 'აირჩიე საგანი და დაიწყე სწავლა',
}

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  'math': <Calculator className="w-8 h-8" />,
  'ka_lang': <BookOpen className="w-8 h-8" />,
  'en_lang': <Languages className="w-8 h-8" />,
  'bio': <FlaskConical className="w-8 h-8" />,
  'geo': <Globe className="w-8 h-8" />,
  'hist': <Hourglass className="w-8 h-8" />
}

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  'math': 'რიცხვები, ლოგიკა და ალგებრა',
  'ka_lang': 'ქართული ენა და ლიტერატურა',
  'en_lang': 'ინგლისური ენა',
  'bio': 'სიცოცხლის შესწავლა',
  'geo': 'დედამიწა და გარემო',
  'hist': 'საქართველოს და მსოფლიო ისტორია'
}

const SUBJECT_COLORS: Record<string, string> = {
  'math': 'from-blue-500 to-cyan-500',
  'ka_lang': 'from-red-500 to-pink-500',
  'en_lang': 'from-violet-500 to-purple-500',
  'bio': 'from-green-500 to-emerald-500',
  'geo': 'from-teal-500 to-green-500',
  'hist': 'from-amber-500 to-orange-500'
}

interface SubjectsPageProps {
  searchParams: Promise<{
    grade?: string
  }>
}

const GRADE_LABELS: Record<string, string> = {
  '1': 'I კლასი',
  '2': 'II კლასი',
  '3': 'III კლასი',
  '4': 'IV კლასი',
  '5': 'V კლასი',
  '6': 'VI კლასი',
  '7': 'VII კლასი',
  '8': 'VIII კლასი',
  '9': 'IX კლასი',
  '10': 'X კლასი',
  '11': 'XI კლასი',
}

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const supabase = await createClient() as any
  const resolvedParams = await searchParams
  const selectedGrade = resolvedParams.grade || '7' 
  const gradeLabel = GRADE_LABELS[selectedGrade] || 'VII კლასი'

  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name_ka')

  if (error) {
    console.error('Error fetching subjects:', error)
  }

  const displaySubjects = subjects || []

  return (
    <div className="min-h-screen py-8 md:py-12 relative overflow-hidden bg-[#0f172a]">
      <div className="hidden md:block absolute top-0 left-1/4 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="hidden md:block absolute bottom-0 right-1/4 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4 md:mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-blue-200 font-bold text-xs sm:text-sm">{gradeLabel}</span>
            <Link
              href="/onboarding"
              className="ml-2 text-xs font-bold text-white/60 hover:text-white uppercase tracking-wider transition-colors border-l border-white/10 pl-2 sm:pl-3"
            >
              შეცვლა
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-6 georgian-heading tracking-tight text-glow">
            აირჩიე საგანი
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-200/60 max-w-2xl mx-auto georgian-body font-medium leading-relaxed px-2">
            6 საგანი, 6 გაკვეთილი, 120 კითხვა. დაიწყე შენი კოსმოსური მოგზაურობა ცოდნის სამყაროში. 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {displaySubjects.map((subject: any, index: number) => {
            const gradientColor = SUBJECT_COLORS[subject.code] || 'from-blue-500 to-purple-500'

            return (
              <Link
                key={subject.id}
                href={`/subjects/${subject.code}`}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="glass-card h-full p-0.5 sm:p-1 rounded-2xl sm:rounded-[2rem] hover:scale-[1.02] transition-transform duration-500 relative">
                
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl sm:rounded-[2rem]`}></div>

                  <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[1.4rem] sm:rounded-[1.8rem] p-5 sm:p-6 lg:p-8 h-full border border-white/5 relative z-10 overflow-hidden group-hover:border-white/20 transition-colors">
                   
                    <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-3xl -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 transition-transform duration-700 group-hover:scale-150"></div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5 sm:mb-8">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradientColor} p-0.5 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-shadow duration-500`}>
                          <div className="w-full h-full bg-[#0f172a] rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-white transition-all">
                            <span className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 lg:[&>svg]:w-8 lg:[&>svg]:h-8">
                              {SUBJECT_ICONS[subject.code] || '📚'}
                            </span>
                          </div>
                        </div>

                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5 group-hover:border-white/20">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 georgian-heading group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all">
                        {subject.name_ka}
                      </h2>

                      <p className="text-blue-200/50 leading-relaxed mb-5 sm:mb-8 georgian-body text-xs sm:text-sm font-medium">
                        {SUBJECT_DESCRIPTIONS[subject.code] || subject.name_en}
                      </p>

                      <div className="w-full bg-white/5 h-1 sm:h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full w-0 group-hover:w-full transition-all duration-1000 ease-out bg-gradient-to-r ${gradientColor}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 md:mt-20 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-blue-200/40 font-bold text-xs sm:text-sm uppercase tracking-widest">
            სულ ხელმისაწვდომია {displaySubjects.length} საგანი
          </p>
        </div>
      </div>
    </div>
  )
}
