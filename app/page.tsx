import Link from 'next/link'
import { HeroSlider } from '@/components/hero-slider'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] overflow-hidden">
      {/* Sophisticated Hero Slider */}
      <HeroSlider />

      {/* Features Grid with Modern Glass Cards */}
      <section className="py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm mb-4 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              🚀 რატომ ჩვენ
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight georgian-heading text-glow">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient">
                ინტერაქტიული სწავლება
              </span>
            </h2>
            <p className="text-lg md:text-xl text-blue-200/60 leading-relaxed georgian-body">
              დაივიწყეთ მოსაწყენი ვიდეოები. ჩვენი პრაქტიკული მიდგომა გეხმარებათ მასალის სიღრმისეულად გააზრებაში.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {/* Card 1 */}
            <div className="group glass-panel p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-blue-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  🎯
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white georgian-heading group-hover:text-blue-300 transition-colors">
                  ინტერაქტიული სწავლა
                </h3>
                <p className="text-blue-200/50 leading-relaxed georgian-body">
                  ისწავლეთ კეთებით. ამოხსენით ამოცანები, მიიღეთ მყისიერი უკუკავშირი და განივითარეთ ინტუიცია.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group glass-panel p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-amber-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  🔥
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white georgian-heading group-hover:text-amber-300 transition-colors">
                  ყოველდღიური მიღწევები
                </h3>
                <p className="text-blue-200/50 leading-relaxed georgian-body">
                  ჩამოიყალიბეთ სწავლის ჩვევა. თვალყური ადევნეთ პროგრესს, შეინარჩუნეთ "სტრიქი" და გაზარდეთ თქვენი უნარები.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group glass-panel p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-purple-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  💡
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white georgian-heading group-hover:text-purple-300 transition-colors">
                  დამხმარე მინიშნებები
                </h3>
                <p className="text-blue-200/50 leading-relaxed georgian-body">
                  გაიჭედეთ რთულ ამოცანაზე? გამოიყენეთ მინიშნებები, რომლებიც სწორი პასუხისკენ მიგითითებთ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section with Glassmorphism */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-blue-900/20 to-[#0f172a]"></div>

        <div className="container mx-auto relative z-10">
          <div className="glass-card p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem]">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full blur-[100px] animate-float"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }}></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white font-bold text-sm mb-6 border border-white/20 backdrop-blur-md">
                🚀 დაიწყე დღესვე
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-white georgian-heading text-glow">
                მზად ხარ განვითარებისთვის?
              </h2>
              <p className="text-lg md:text-2xl mb-8 md:mb-12 text-blue-200/70 leading-relaxed max-w-2xl mx-auto georgian-body">
                შემოუერთდი ათასობით მოსწავლეს და დაეუფლე რთულ საკითხებს მარტივად და სახალისოდ.
              </p>
              <Link href="/subjects" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg md:text-xl px-8 py-4 md:px-14 md:py-5 inline-block shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] group rounded-2xl font-bold transition-all hover:scale-105 border border-white/20">
                <span className="flex items-center gap-3">
                  ნახე საგნები
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Stats Section with Gradient Cards */}
      <section className="py-24 border-t border-white/5 bg-[#0f172a] relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
            <div className="group glass-panel p-8 text-center hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-blue-500/30">
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-br from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                6
              </div>
              <div className="text-blue-200/60 font-bold tracking-wide text-base md:text-lg uppercase georgian-body">საგანი</div>
            </div>
            <div className="group glass-panel p-8 text-center hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-amber-500/30">
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-br from-amber-400 to-orange-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                6
              </div>
              <div className="text-blue-200/60 font-bold tracking-wide text-base md:text-lg uppercase georgian-body">გაკვეთილი</div>
            </div>
            <div className="group glass-panel p-8 text-center hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-emerald-500/30">
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-br from-emerald-400 to-green-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                120
              </div>
              <div className="text-blue-200/60 font-bold tracking-wide text-base md:text-lg uppercase georgian-body">კითხვა</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
