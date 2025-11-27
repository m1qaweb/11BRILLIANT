import { signUpAction } from '@/app/actions/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/server'

export const metadata = {
  title: 'რეგისტრაცია - გონი',
  description: 'შექმენით თქვენი ანგარიში',
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; returnUrl?: string }>
}) {
  const params = await searchParams

  // If already logged in, redirect to dashboard
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0f172a]">
      {/* Background decoration - Same as features section */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Glowing Logo */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Link href="/" className="group relative">
            <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-2xl border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              გ
            </div>
          </Link>
        </div>
        <h2 className="text-center text-3xl font-black text-white mb-2 georgian-heading tracking-tight text-glow">
          შექმენით ანგარიში
        </h2>
        <p className="text-center text-base text-blue-200/80 georgian-body">
          უკვე გაქვთ ანგარიში?{' '}
          <Link
            href="/auth/login"
            className="font-bold text-white hover:text-white/80 transition-colors hover:underline underline-offset-4"
          >
            შესვლა
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-panel py-10 px-6 sm:rounded-2xl sm:px-12 relative overflow-hidden group">
          {/* Subtle border gradient */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-primary/30 transition-colors duration-500 pointer-events-none"></div>

          {/* Error Message */}
          {params.error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-slide-up backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <p className="text-sm font-semibold text-red-200 georgian-body">
                  {decodeURIComponent(params.error)}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {params.success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-slide-up backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">✅</span>
                <p className="text-sm font-semibold text-green-200 georgian-body">
                  {decodeURIComponent(params.success)}
                </p>
              </div>
            </div>
          )}

          <form action={signUpAction} className="space-y-6">
            {params.returnUrl && (
              <input type="hidden" name="returnUrl" value={params.returnUrl} />
            )}

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-bold text-blue-100 mb-2 georgian-body"
              >
                სახელი და გვარი
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"></div>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  className="relative block w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200 text-base georgian-body backdrop-blur-sm"
                  placeholder="თქვენი სახელი"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-blue-100 mb-2 georgian-body"
              >
                ელ-ფოსტა
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"></div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200 text-base georgian-body backdrop-blur-sm"
                  placeholder="your@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-blue-100 mb-2 georgian-body"
              >
                პაროლი
              </label>
              <div className="relative group/input">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"></div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="relative block w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200 text-base georgian-body backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-blue-200/60 georgian-body">
                მინიმუმ 6 სიმბოლო
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-5 w-5 rounded-lg border-white/20 bg-white/5 text-primary focus:ring-offset-0 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-blue-200 georgian-body">
                  ვეთანხმები{' '}
                  <Link
                    href="/terms"
                    className="font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    მომსახურების პირობებსა
                  </Link>{' '}
                  და{' '}
                  <Link
                    href="/privacy"
                    className="font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    კონფიდენციალურობის პოლიტიკას
                  </Link>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative w-full group overflow-hidden rounded-xl bg-primary p-[1px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shine"></div>
                <div className="relative bg-primary hover:bg-transparent w-full h-full rounded-xl px-4 py-3.5 transition-colors duration-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground group-hover:text-white transition-colors georgian-body">
                    ანგარიშის შექმნა
                  </span>
                </div>
              </button>
            </div>
          </form>

          {/* Modern Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#0f172a] px-4 text-blue-200/50 font-medium rounded-full georgian-body">
                  ან გააგრძელე
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="flex w-full justify-center items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm font-medium text-blue-200 shadow-sm hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </button>

              <button
                type="button"
                disabled
                className="flex w-full justify-center items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm font-medium text-blue-200 shadow-sm hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="hidden sm:inline">Twitter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200/60 hover:text-primary transition-all duration-300 hover:-translate-x-1 georgian-body">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            დაბრუნება მთავარ გვერდზე
          </Link>
        </div>
      </div>
    </div>
  )
}
