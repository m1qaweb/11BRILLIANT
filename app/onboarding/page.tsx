'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const GRADES = [
  { id: 1, label: 'I კლასი', numeral: 'I', color: 'from-blue-400 to-blue-600' },
  { id: 2, label: 'II კლასი', numeral: 'II', color: 'from-indigo-400 to-indigo-600' },
  { id: 3, label: 'III კლასი', numeral: 'III', color: 'from-violet-400 to-violet-600' },
  { id: 4, label: 'IV კლასი', numeral: 'IV', color: 'from-purple-400 to-purple-600' },
  { id: 5, label: 'V კლასი', numeral: 'V', color: 'from-fuchsia-400 to-fuchsia-600' },
  { id: 6, label: 'VI კლასი', numeral: 'VI', color: 'from-pink-400 to-pink-600' },
  { id: 7, label: 'VII კლასი', numeral: 'VII', color: 'from-rose-400 to-rose-600' },
  { id: 8, label: 'VIII კლასი', numeral: 'VIII', color: 'from-orange-400 to-orange-600' },
  { id: 9, label: 'IX კლასი', numeral: 'IX', color: 'from-amber-400 to-amber-600' },
  { id: 10, label: 'X კლასი', numeral: 'X', color: 'from-yellow-400 to-yellow-600' },
  { id: 11, label: 'XI კლასი', numeral: 'XI', color: 'from-lime-400 to-lime-600' },
  { id: 12, label: 'უმაღლესი განათლება', numeral: '', color: 'from-emerald-400 to-emerald-600' },
]

export default function OnboardingPage() {
  // Set page title
  useEffect(() => {
    document.title = 'აირჩიე შენი დონე - გონი'
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
            ✨ დაიწყე შენი სასწავლო მოგზაურობა
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-foreground georgian-heading">
            აირჩიე შენი <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">დონე</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed georgian-body max-w-2xl mx-auto">
            რომელ კლასში სწავლობ? აირჩიე შენი დონე და მივიდეთ საგნებზე.
          </p>
        </div>

        {/* Grade Grid - 3x4 Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {GRADES.map((grade) => (
              <Link
                key={grade.id}
                href={grade.id === 12 ? '#' : `/subjects?grade=${grade.id}`}
                className={`
                  group relative aspect-square rounded-3xl overflow-hidden
                  transition-all duration-500 hover:scale-105 hover:shadow-2xl
                  ${grade.id === 12 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={(e) => {
                  if (grade.id === 12) {
                    e.preventDefault()
                  } else {
                    // Store grade preference in localStorage
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedGrade', grade.id.toString())
                    }
                  }
                }}
              >
                {/* Gradient Background */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${grade.color}
                  transition-all duration-500 group-hover:scale-110
                `} />
                
                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
                  {/* Roman Numeral or Higher Education Text */}
                  {grade.id === 12 ? (
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-center georgian-heading drop-shadow-lg leading-tight px-4">
                      უმაღლესი<br />განათლება
                    </h3>
                  ) : (
                    <>
                      <div className="text-7xl md:text-8xl lg:text-9xl mb-3 font-black transform group-hover:scale-110 transition-all duration-500">
                        {grade.numeral}
                      </div>
                      
                      {/* Label */}
                      <h3 className="text-sm md:text-base font-semibold text-center mb-2 georgian-heading drop-shadow-lg opacity-90">
                        კლასი
                      </h3>
                    </>
                  )}
                  
                  {/* Coming Soon Badge for Higher Education */}
                  {grade.id === 12 && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                      მალე
                    </div>
                  )}
                  
                  {/* Arrow Icon */}
                  {grade.id !== 12 && (
                    <div className="mt-2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <div className="card-elevated p-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold georgian-heading">რატომ არის ეს მნიშვნელოვანი?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed georgian-body">
              შენი დონის არჩევა დაგვეხმარება შენთვის შესაბამისი სირთულის კითხვების შერჩევაში. 
              ყოველი კლასი შეესაბამება განსხვავებულ სირთულის დონეს.
            </p>
          </div>
        </div>

        {/* Skip Option */}
        <div className="mt-8 text-center">
          <Link 
            href="/subjects"
            className="text-muted-foreground hover:text-primary transition-colors font-medium georgian-body inline-flex items-center gap-2"
          >
            <span>გამოტოვება</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
