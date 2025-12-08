import { getUserProfile, getUserBadges, getAllBadges, getXPHistory } from '@/app/actions/gamification'
import { XPBar } from '@/components/gamification/xp-bar'
import { BadgeCard } from '@/components/gamification/badge-card'
import { Trophy, Zap, Star, TrendingUp, Award } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'ჩემი პროფილი - გონი',
  description: 'თქვენი პროგრესი და მიღწევები',
}

export default async function ProfilePage() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { profile, levelInfo, progress } = await getUserProfile()
  const userBadges = await getUserBadges()
  const allBadges = await getAllBadges()
  const xpHistory = await getXPHistory(10)

  // Calculate stats
  const earnedBadgesCount = userBadges.length
  const totalBadgesCount = allBadges.length
  const badgeProgress = Math.round((earnedBadgesCount / totalBadgesCount) * 100)

  // Group badges by category
  const badgesByCategory = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = []
    acc[badge.category].push(badge)
    return acc
  }, {} as Record<string, typeof allBadges>)

  // Get earned badge IDs for quick lookup
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id))

  return (
    <div className="bg-cosmic-main">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 georgian-heading tracking-tight text-glow">
            ჩემი პროფილი
          </h1>
          <p className="text-xl text-blue-200/60 georgian-body font-medium">
            შენი პროგრესი და მიღწევები
          </p>
        </div>

        {/* XP Progress Card */}
        {profile && (
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-cosmic p-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 opacity-50"></div>
              <div className="bg-[#0f172a]/60 backdrop-blur-xl rounded-[20px] p-6 md:p-8 relative z-10">
                <XPBar
                  profile={profile}
                  levelInfo={levelInfo}
                  progress={progress}
                  showDetails={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Total XP */}
          <div className="card-cosmic p-6 group hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-blue-200/60 uppercase tracking-wider georgian-body">
                  ჯამი XP
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white group-hover:text-blue-400 transition-colors">
                {profile?.total_xp.toLocaleString() || 0}
              </div>
            </div>
          </div>

          {/* Current Level */}
          <div className="card-cosmic p-6 group hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-purple-200/60 uppercase tracking-wider georgian-body">
                  დონე
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white group-hover:text-purple-400 transition-colors">
                {profile?.current_level || 1}
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="card-cosmic p-6 group hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-yellow-200/60 uppercase tracking-wider georgian-body">
                  ბეჯები
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white group-hover:text-yellow-400 transition-colors">
                {earnedBadgesCount}
              </div>
            </div>
          </div>

          {/* Badge Completion */}
          <div className="card-cosmic p-6 group hover-lift">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-pink-200/60 uppercase tracking-wider georgian-body">
                  შესრულება
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white group-hover:text-pink-400 transition-colors">
                {badgeProgress}%
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white georgian-heading flex items-center gap-3">
              <span className="text-4xl">🏆</span> ბეჯების კოლექცია
            </h2>
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold font-mono">
              {earnedBadgesCount} / {totalBadgesCount}
            </div>
          </div>

          {/* Badge Categories */}
          <div className="space-y-8">
            {Object.entries(badgesByCategory).map(([category, badges]) => {
              const categoryEarned = badges.filter(b => earnedBadgeIds.has(b.id)).length

              return (
                <div key={category} className="card-cosmic p-8 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-xl font-bold text-white georgian-heading capitalize flex items-center gap-2">
                      {category === 'achievement' && '🏆 მიღწევები'}
                      {category === 'streak' && '🔥 სტრიქი'}
                      {category === 'mastery' && '⭐ ოსტატობა'}
                      {category === 'special' && '✨ სპეციალური'}
                    </h3>
                    <span className="text-sm font-bold text-blue-200/60">
                      {categoryEarned} / {badges.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10">
                    {badges
                      .sort((a, b) => {
                        // Show earned badges first
                        const aEarned = earnedBadgeIds.has(a.id) ? 0 : 1
                        const bEarned = earnedBadgeIds.has(b.id) ? 0 : 1
                        return aEarned - bEarned
                      })
                      .map((badge) => {
                        const userBadge = userBadges.find(ub => ub.badge_id === badge.id)
                        return (
                          <BadgeCard
                            key={badge.id}
                            badge={badge}
                            userBadge={userBadge}
                            size="md"
                            showDetails={true}
                          />
                        )
                      })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent XP History */}
        {xpHistory.length > 0 && (
          <div className="glass-panel p-8 rounded-3xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-black text-white mb-6 georgian-heading flex items-center gap-3">
              <span className="text-3xl">📜</span> ბოლო აქტივობები
            </h2>

            <div className="space-y-3">
              {xpHistory.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Star className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white georgian-body text-lg">
                        {transaction.reason === 'correct_answer' && 'სწორი პასუხი'}
                        {transaction.reason === 'lesson_complete' && 'გაკვეთილის დასრულება'}
                        {transaction.reason === 'streak' && 'სტრიქი'}
                        {transaction.reason === 'badge_earned' && 'ბეჯის მიღება'}
                      </div>
                      <div className="text-sm text-blue-200/50 font-medium">
                        {new Date(transaction.created_at).toLocaleDateString('ka-GE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-xl font-black text-green-400 group-hover:text-green-300 transition-colors">
                    +{transaction.amount} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
