// Client-side authentication utilities
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

/**
 * Hook to get current user on client side
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading }
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    throw error
  }
  
  // Redirect handled by caller
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, metadata?: {
  username?: string
  display_name?: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  
  if (error) {
    throw error
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) {
    throw error
  }
}
