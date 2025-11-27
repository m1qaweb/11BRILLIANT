import { getUserProfile } from '@/app/actions/gamification'
import { HeaderWithXP } from './header-with-xp'

export async function HeaderWrapper() {
  const { profile, levelInfo, progress } = await getUserProfile()

  return (
    <HeaderWithXP 
      profile={profile} 
      levelInfo={levelInfo} 
      progress={progress}
    />
  )
}
