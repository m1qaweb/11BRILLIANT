import { resetPasswordAction } from '@/app/actions/auth'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export const metadata = {
  title: 'პაროლის აღდგენა - Brilliant Clone',
  description: 'აღადგინეთ თქვენი პაროლი',
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hover:scale-110 transition-transform duration-300">
            გ
          </Link>
        </div>
        <h2 className="text-center text-3xl font-black tracking-tight text-white georgian-heading text-glow">
          პაროლის აღდგენა
        </h2>
        <p className="mt-2 text-center text-sm text-blue-200/60 georgian-body">
          გაიხსენეთ პაროლი?{' '}
          <Link
            href="/auth/login"
            className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            შესვლა
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/10 bg-white/5 backdrop-blur-xl">
          {/* Success message */}
          {params.success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-sm text-emerald-200 font-medium georgian-body">{params.success}</p>
            </div>
          )}

          {/* Error message */}
          {params.error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
              <p className="text-sm text-red-200 font-medium georgian-body">{params.error}</p>
            </div>
          )}

          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm text-blue-200/60 georgian-body leading-relaxed">
              შეიყვანეთ თქვენი ელ-ფოსტა და ჩვენ გამოგიგზავნით ბმულს პაროლის აღსადგენად.
            </p>
          </div>

          <form action={resetPasswordAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-blue-200 mb-2 georgian-body"
              >
                ელ-ფოსტა
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400/50 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200 georgian-body"
              >
                ბმულის გაგზავნა
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-white transition-colors georgian-body group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            უკან შესვლაზე
          </Link>
        </div>
      </div>
    </div>
  )
}
