'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Slide {
  id: number
  badge: string
  title: string
  highlight: string
  description: string
  ctaPrimary: string
  ctaSecondary: string
  bgGradient: string
  accentColor: string
}

const slides: Slide[] = [
  {
    id: 1,
    badge: '✨ თანამედროვე განათლება',
    title: 'შეისწავლე რთული თემები',
    highlight: 'მარტივად და სახალისოდ',
    description: 'განავითარე უნარები მათემატიკაში, მეცნიერებაში და ტექნოლოგიებში პრაქტიკული ამოცანების გადაჭრით. გაიღრმავე ცოდნა, არა უბრალოდ დაიზეპირო ფაქტები.',
    ctaPrimary: 'დაიწყე სწავლა უფასოდ',
    ctaSecondary: 'იხილე ყველა თემა',
    bgGradient: 'from-blue-950 via-blue-900 to-indigo-900',
    accentColor: 'from-amber-300 via-amber-200 to-yellow-100'
  },
  {
    id: 2,
    badge: '🎯 ინტერაქტიული მეთოდი',
    title: 'ისწავლე პრაქტიკით',
    highlight: 'არა თეორიით',
    description: 'ამოხსენი რეალური ამოცანები, მიიღე ინსტრუქციები ნაბიჯ-ნაბიჯ და განავითარე კრიტიკული აზროვნება. ჩვენი მიდგომა სიღრმისეულ გააზრებაზეა ორიენტირებული.',
    ctaPrimary: 'აღმოაჩინე კურსები',
    ctaSecondary: 'როგორ მუშაობს',
    bgGradient: 'from-purple-950 via-purple-900 to-indigo-900',
    accentColor: 'from-pink-300 via-purple-200 to-blue-100'
  },
  {
    id: 3,
    badge: '🔥 ყოველდღიური პროგრესი',
    title: 'შექმენი სწავლის ჩვევა',
    highlight: 'რომელიც გაგრძელდება',
    description: 'გადადგი ერთი პატარა ნაბიჯი ყოველ დღე. თვალყური ადევნე შენს პროგრესს, შეინარჩუნე სტრიქი და დაინახე შენი უნარების ზრდა.',
    ctaPrimary: 'დაიწყე დღეს',
    ctaSecondary: 'ნახე მიღწევები',
    bgGradient: 'from-orange-950 via-red-900 to-pink-900',
    accentColor: 'from-orange-300 via-amber-200 to-yellow-100'
  },
  {
    id: 4,
    badge: '🎓 ფართო არჩევანი',
    title: 'ასობით საინტერესო თემა',
    highlight: 'შენი ტემპით',
    description: 'აირჩიე 100+ კურსიდან მათემატიკაში, მეცნიერებაში, პროგრამირებასა და ფიზიკაში. ისწავლე როცა გინდა, რამდენიც გინდა.',
    ctaPrimary: 'იხილე ყველა კურსი',
    ctaSecondary: 'საგნების კატალოგი',
    bgGradient: 'from-teal-950 via-cyan-900 to-blue-900',
    accentColor: 'from-cyan-300 via-teal-200 to-green-100'
  }
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const slide = slides[currentSlide]

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Animated Background with Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
        slide.bgGradient
      )}>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>

        {/* Floating Orbs - Enhanced */}
        <div
          className="absolute -top-32 -right-32 w-[800px] h-[800px] rounded-full blur-[120px] animate-float transition-all duration-1000 opacity-60"
          style={{
            background: `radial-gradient(circle, ${currentSlide === 0 ? 'rgba(251, 191, 36, 0.4)' :
              currentSlide === 1 ? 'rgba(236, 72, 153, 0.4)' :
                currentSlide === 2 ? 'rgba(251, 146, 60, 0.4)' :
                  'rgba(34, 211, 238, 0.4)'
              }, transparent 70%)`
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[700px] h-[700px] rounded-full blur-[100px] animate-float transition-all duration-1000 opacity-50"
          style={{
            animationDelay: '2s',
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)`
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse mix-blend-screen"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            key={`badge-${slide.id}`}
            className="inline-block mb-8 px-5 py-2.5 rounded-full border-2 border-white/40 text-sm font-bold hover:border-white/60 transition-all duration-300 animate-slide-up text-white"
          >
            {slide.badge}
          </div>

          {/* Main Heading */}
          <h1
            key={`title-${slide.id}`}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1] animate-slide-up georgian-heading text-white drop-shadow-lg"
            style={{ animationDelay: '0.1s' }}
          >
            {slide.title} <br className="hidden md:block" />
            <span
              className={cn(
                "text-transparent bg-clip-text bg-gradient-to-r",
                `bg-gradient-to-r ${slide.accentColor}`
              )}
            >
              {slide.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            key={`desc-${slide.id}`}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed georgian-body animate-fade-in font-medium"
            style={{ animationDelay: '0.2s' }}
          >
            {slide.description}
          </p>

          {/* CTA Buttons */}
          <div
            key={`cta-${slide.id}`}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              href="/onboarding"
              className="btn-accent text-lg px-12 py-4 shadow-2xl hover:shadow-amber-500/50 w-full sm:w-auto group"
            >
              <span className="flex items-center gap-2">
                {slide.ctaPrimary}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/subjects"
              className="group px-10 py-4 rounded-2xl bg-white/5 border-2 border-white/40 hover:bg-white/10 hover:border-white/60 transition-all duration-300 font-bold text-lg w-full sm:w-auto shadow-lg hover:shadow-xl text-white"
            >
              <span className="flex items-center gap-2">
                {slide.ctaSecondary}
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group shadow-xl"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group shadow-xl"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              currentSlide === index
                ? "w-12 h-3 bg-white shadow-lg"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
          style={{
            width: isAutoPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : '0%'
          }}
        />
      </div>

      {/* Social Proof / Trust Badges */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 hover:opacity-90 transition-all duration-500 animate-fade-in z-10"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="font-bold text-base md:text-lg tracking-wide text-white">🏆 თანამედროვე სწავლება</div>
        <div className="font-bold text-base md:text-lg tracking-wide text-white">⭐ 10,000+ მოსწავლე</div>
        <div className="font-bold text-base md:text-lg tracking-wide text-white">🎯 {slides.length * 25}+ კურსი</div>
      </div>
    </section>
  )
}
