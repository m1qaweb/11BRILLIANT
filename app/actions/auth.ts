'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Server Action: Sign in with email and password
 */
export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const returnUrl = formData.get('returnUrl') as string || ''

  // Helper to build URL with returnUrl
  const buildUrl = (path: string, params: Record<string, string> = {}) => {
    const url = new URL(path, 'http://localhost')
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })
    if (returnUrl) url.searchParams.set('returnUrl', returnUrl)
    return `${url.pathname}${url.search}`
  }

  if (!email || !password) {
    redirect(buildUrl('/auth/login', { error: 'ელ. ფოსტა და პაროლი აუცილებელია' }))
  }

  const supabase = await createClient() as any
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Handle specific errors with Georgian messages
    if (error.message.includes('Invalid') || error.message.includes('credentials')) {
      redirect(buildUrl('/auth/login', { error: 'არასწორი ელ. ფოსტა ან პაროლი' }))
    }

    redirect(buildUrl('/auth/login', { error: error.message }))
  }

  revalidatePath('/', 'layout')
  redirect(returnUrl || '/dashboard')
}

/**
 * Server Action: Sign up with email and password
 */
export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string
  const returnUrl = formData.get('returnUrl') as string || ''

  // Helper to build URL with returnUrl
  const buildUrl = (path: string, params: Record<string, string> = {}) => {
    const url = new URL(path, 'http://localhost')
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })
    if (returnUrl) url.searchParams.set('returnUrl', returnUrl)
    return `${url.pathname}${url.search}`
  }

  if (!email || !password) {
    redirect(buildUrl('/auth/signup', { error: 'ელ. ფოსტა და პაროლი აუცილებელია' }))
  }

  const supabase = await createClient() as any

  // Sign up user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
    },
  })

  if (signUpError) {
    console.error('Signup error:', signUpError)

    // Handle specific Supabase errors with Georgian messages
    if (signUpError.message.includes('already registered') ||
      signUpError.message.includes('already exists') ||
      signUpError.message.includes('User already registered') ||
      signUpError.status === 422) {
      redirect(buildUrl('/auth/signup', { error: 'ეს ელ.ფოსტა უკვე არსებობს' }))
    }

    // Handle weak password
    if (signUpError.message.includes('Password') || signUpError.message.includes('weak')) {
      redirect(buildUrl('/auth/signup', { error: 'პაროლი ძალიან სუსტია' }))
    }

    redirect(buildUrl('/auth/signup', { error: signUpError.message }))
  }

  if (!authData.user) {
    console.error('No user data returned after signup')
    redirect(buildUrl('/auth/signup', { error: 'ანგარიშის შექმნა ვერ მოხერხდა' }))
  }

  console.log('User created successfully:', authData.user.id)

  // Note: Profile creation is handled automatically by database trigger
  // The trigger creates:
  //   1. profiles entry
  //   2. streaks entry  
  //   3. user_profiles entry (gamification)

  revalidatePath('/', 'layout')

  // Redirect to dashboard - email confirmation is disabled
  redirect(returnUrl || '/dashboard')
}

/**
 * Server Action: Sign out
 */
export async function signOutAction() {
  const supabase = await createClient() as any
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * Server Action: Send password reset email
 */
export async function resetPasswordAction(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    redirect('/auth/forgot-password?error=Email is required')
  }

  const supabase = await createClient() as any
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/auth/forgot-password?success=${encodeURIComponent('Password reset email sent. Please check your inbox.')}`)
}

/**
 * Server Action: Update password
 */
export async function updatePasswordAction(formData: FormData) {
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!newPassword || !confirmPassword) {
    return { error: 'All fields are required' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const supabase = await createClient() as any
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
