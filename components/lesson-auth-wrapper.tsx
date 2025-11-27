'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthRequiredModal } from './auth-required-modal'
import { useRouter } from 'next/navigation'

interface LessonAuthWrapperProps {
  children: React.ReactNode
  hasQuestions: boolean
  lessonSlug: string
}

export function LessonAuthWrapper({ children, hasQuestions, lessonSlug }: LessonAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setIsAuthenticated(!!user)
    
    // If there are questions and user is not authenticated, show modal
    if (hasQuestions && !user) {
      setShowAuthModal(true)
    }
  }

  // If checking auth, show loading
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 georgian-body">იტვირთება...</p>
        </div>
      </div>
    )
  }

  // If user needs auth for questions, show modal overlay
  if (hasQuestions && !isAuthenticated) {
    return (
      <>
        {/* Blurred content */}
        <div className="filter blur-sm pointer-events-none select-none">
          {children}
        </div>
        
        {/* Auth Modal */}
        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false)
            router.push('/') // Redirect to home if they close
          }}
          redirectTo={`/courses/${lessonSlug}`}
        />
      </>
    )
  }

  // User is authenticated or lesson has no questions
  return <>{children}</>
}
