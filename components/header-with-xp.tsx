'use client'

import Link from 'next/link'
import { useUser } from '@/lib/auth/client'
import { signOutAction } from '@/app/actions/auth'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { UserProfile, LevelProgress, Level } from '@/lib/types/gamification'

interface HeaderWithXPProps {
  profile: UserProfile | null
  levelInfo: Level | null
  progress: LevelProgress | null
}

export function HeaderWithXP({ profile, levelInfo, progress }: HeaderWithXPProps) {
  const { user, loading } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)




  const progressPercent = progress?.progress_percent || 0

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        "bg-[#020617]/95 backdrop-blur-xl border-white/5 shadow-2xl py-3"
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              გ
            </div>
            <span className="text-xl font-black tracking-tight transition-all duration-300 georgian-heading text-white group-hover:text-blue-400">
              გონი
            </span>
          </Link>

          {/* XP Bar (Desktop - when logged in) */}
          {!loading && user && profile && (
            <Link href="/profile" className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex-1 max-w-md">
              {/* Level Badge */}
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md flex-shrink-0">
                <span className="text-white font-black text-sm">{profile.current_level}</span>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 min-w-[100px]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-blue-100">{levelInfo?.title_ka || 'დამწყები'}</span>
                  <span className="font-semibold text-blue-200">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* XP Count */}
              <div className="text-sm font-bold text-white whitespace-nowrap flex-shrink-0">
                {profile.total_xp.toLocaleString()} XP
              </div>
            </Link>
          )}

          {/* Navigation Links & Auth */}
          <div className="flex items-center gap-3">
            {/* Profile Link (Mobile) */}
            {!loading && user && (
              <Link
                href="/profile"
                className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                title="პროფილი"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Auth Buttons */}
            {loading ? (
              <div className="w-28 h-11 bg-muted/50 animate-pulse rounded-xl" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-white/10 hover:bg-white/10"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-sm font-black text-white">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold hidden sm:block max-w-[100px] truncate text-white">
                    {user.email?.split('@')[0]}
                  </span>
                  <svg
                    className={cn(
                      "w-4 h-4 transition-transform duration-300 text-blue-200/60",
                      isMenuOpen && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border border-white/10 py-3 z-50 animate-slide-up bg-[#0f172a] backdrop-blur-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-t-xl">
                        <p className="text-xs text-blue-200/60 font-bold tracking-wider mb-1 georgian-body">მომხმარებელი</p>
                        <p className="text-sm font-semibold text-white truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all duration-200 group georgian-body"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          </div>
                          ჩემი გვერდი
                        </Link>

                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all duration-200 group georgian-body"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          პროფილი & ბეჯები
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all duration-200 group georgian-body"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          პარამეტრები
                        </Link>
                      </div>

                      <div className="border-t border-white/10 mt-2 pt-2 p-2">
                        <form action={signOutAction}>
                          <button
                            type="submit"
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 group georgian-body"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            გასვლა
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="font-semibold transition-all duration-300 text-base px-4 py-2 rounded-lg georgian-body text-white hover:text-blue-400 hover:bg-white/10"
                >
                  შესვლა
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-accent text-base px-6 py-2.5 shadow-xl hover:shadow-amber-500/30 georgian-body"
                >
                  რეგისტრაცია
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
