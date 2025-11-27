import { NextResponse } from 'next/server'
import { getUserProfile } from '@/app/actions/gamification'

export async function GET() {
  try {
    const { profile, levelInfo, progress } = await getUserProfile()
    
    return NextResponse.json({
      profile,
      levelInfo,
      progress
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { profile: null, levelInfo: null, progress: null },
      { status: 500 }
    )
  }
}
