'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const handleExit = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowExitConfirm(true)
  }

  const confirmExit = () => {
    router.push('/onboarding')
  }

  return (
    <>
      {/* Clean, focused quiz environment - Dark Cosmic Theme */}
      <div className="fixed inset-0 bg-[#0f172a] overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>

        {/* Minimal Exit Button - Top Left */}
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 text-blue-200 hover:text-white font-medium group"
          >
            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">გასვლა</span>
          </button>
        </div>

        {/* Main Content - Centered & Focused, No Scroll */}
        <main className="h-full flex items-center justify-center py-8 px-4 overflow-y-auto scrollbar-hide relative z-10">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </main>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
            onClick={() => setShowExitConfirm(false)}
          />

          {/* Modal */}
          <div className="relative bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-hidden">
            {/* Modal Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-3xl pointer-events-none"></div>

            <h3 className="text-2xl font-bold mb-3 text-white relative z-10 georgian-heading">დარწმუნებული ხართ?</h3>
            <p className="text-blue-200/60 mb-8 relative z-10 georgian-body">
              თქვენი პროგრესი შეინახება, მაგრამ მიმდინარე კითხვიდან გახვალთ.
            </p>

            <div className="flex gap-3 relative z-10">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all font-medium"
              >
                გაგრძელება
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] transition-all"
              >
                გასვლა
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
