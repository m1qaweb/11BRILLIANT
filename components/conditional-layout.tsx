'use client'

import { usePathname } from 'next/navigation'
import { HeaderNav } from './header-nav'
import { cn } from '@/lib/utils'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if we're on a lesson/quiz page or auth page
  const isLessonPage = pathname?.includes('/lessons/')
  const isAuthPage = pathname?.startsWith('/auth/')

  if (isLessonPage || isAuthPage) {
    // Quiz mode or Auth pages: NO header, NO footer, just content
    return <>{children}</>
  }

  // Normal pages: WITH header and footer
  const isHomePage = pathname === '/'

  return (
    <>
      <HeaderNav />
      <main className={cn("flex-1", !isHomePage && "pt-16 md:pt-20")}>{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary font-bold text-lg">გ</div>
                <span className="font-bold text-xl tracking-tight">გონი</span>
              </div>
              <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
                ინტერაქტიული სწავლა თანამედროვე ეპოქისთვის. დაეუფლე კონცეფციებს, არა მხოლოდ დაიზეპირო.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">სწავლა</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><a href="/subjects" className="hover:text-accent transition-colors">საგნების დათვალიერება</a></li>
                <li><a href="/courses" className="hover:text-accent transition-colors">ყველა კურსი</a></li>
                <li><a href="/paths" className="hover:text-accent transition-colors">სასწავლო გზები</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">ანგარიში</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><a href="/auth/login" className="hover:text-accent transition-colors">შესვლა</a></li>
                <li><a href="/auth/signup" className="hover:text-accent transition-colors">რეგისტრაცია</a></li>
                <li><a href="/dashboard" className="hover:text-accent transition-colors">ჩემი გვერდი</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">კომპანია</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><a href="/about" className="hover:text-accent transition-colors">ჩვენს შესახებ</a></li>
                <li><a href="/privacy" className="hover:text-accent transition-colors">კონფიდენციალურობა</a></li>
                <li><a href="/terms" className="hover:text-accent transition-colors">წესები და პირობები</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <span>© {new Date().getFullYear()} გონი. ყველა უფლება დაცულია.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">ტვიტერი</a>
              <a href="#" className="hover:text-accent transition-colors">გითჰაბი</a>
              <a href="#" className="hover:text-accent transition-colors">დისქორდი</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
