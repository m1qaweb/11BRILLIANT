// Server-side authentication utilities
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Get the current authenticated user from server components
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient() as any
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use in server components that require authentication
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

/**
 * Get or create user profile
 * Called after signup to ensure profile exists
 */
export async function getOrCreateProfile(userId: string) {
  const supabase = await createClient() as any
  
  // Check if profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (!fetchError && existingProfile) {
    return existingProfile
  }
  
  // Create profile if it doesn't exist
  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      role: 'student',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    })
    .select()
    .single()
  
  if (createError) {
    console.error('Failed to create profile:', createError)
    throw new Error('Failed to create user profile')
  }
  
  return newProfile
}

/**
 * Check if user is authenticated (returns boolean)
 * Useful for conditional rendering without redirects
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Get user profile with full details
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient() as any
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Failed to fetch profile:', error)
    return null
  }
  
  return profile
}
