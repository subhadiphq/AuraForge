'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, History, Star, Settings, Crown, Zap,
  TrendingUp, LogOut, ChevronRight, Sparkles
} from 'lucide-react'
import { cn, timeAgo, formatNumber } from '@/lib/utils'
import { FREE_DAILY_CREDITS, TOOL_META } from '@/lib/constants'
import type { User, Generation } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  profile: User | null
  recentGenerations: Generation[]
}

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'history', label: 'History', icon: History },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function DashboardContent({ profile, recentGenerations }: Props) {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const supabase = createClient()

  const creditsUsed = profile?.credits_used ?? 0
  const creditsLimit = profile?.is_premium ? Infinity : FREE_DAILY_CREDITS
  const creditsPct = profile?.is_premium ? 100 : Math.min(100, (creditsUsed / FREE_DAILY_CREDITS) * 100)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="glass border border-white/5 rounded-2xl p-5 sticky top-24">
            {/* User info */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{profile?.full_name || 'User'}</div>
                <div className="text-xs text-muted-foreground truncate">{profile?.email}</div>
              </div>
            </div>

            {/* Credits */}
            <div className="mb-6 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">Daily Credits</span>
                <span className="text-xs font-bold text-primary">
                  {profile?.is_premium ? '∞' : `${creditsUsed}/${FREE_DAILY_CREDITS}`}
                </span>
              </div>
              {!profile?.is_premium && (
                <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${creditsPct}%` }}
                  />
                </div>
              )}
              {!profile?.is_premium && (
                <Link href="/pricing" className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                  <Crown className="w-3 h-3" />
                  Upgrade for unlimited
                </Link>
              )}
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {NAV.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    activeTab === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab profile={profile} recentGenerations={recentGenerations} />
          )}
          {activeTab === 'history' && (
            <HistoryTab generations={recentGenerations} />
          )}
          {activeTab === 'favorites' && (
            <FavoritesTab generations={recentGenerations.filter(g => g.likes > 0)} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab profile={profile} />
          )}
        </main>
      </div>
    </div>
  )
}

function OverviewTab({ profile, recentGenerations }: { profile: User | null; recentGenerations: Generation[] }) {
  const stats = [
    { label: 'Total Generations', value: formatNumber(profile?.total_generations || 0), icon: Sparkles, color: 'text-violet-400' },
    { label: 'Today Used', value: `${profile?.credits_used || 0}/${profile?.is_premium ? '∞' : FREE_DAILY_CREDITS}`, icon: Zap, color: 'text-blue-400' },
    { label: 'Shared Results', value: formatNumber(recentGenerations.filter(g => g.is_public).length), icon: TrendingUp, color: 'text-emerald-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">
          Welcome back {profile?.full_name?.split(' ')[0] || ''} 👋
        </h1>
        <p className="text-muted-foreground text-sm">Here's what's happening with your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass border border-white/5 rounded-2xl p-5">
            <div className={cn('w-8 h-8 rounded-lg bg-card flex items-center justify-center mb-3', s.color)}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="font-display text-2xl font-bold mb-0.5">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Generations */}
      <div>
        <h2 className="font-semibold mb-4">Recent Generations</h2>
        {recentGenerations.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No generations yet</p>
            <Link href="/tools" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white font-medium">
              Try your first tool
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGenerations.slice(0, 8).map(gen => (
              <GenerationRow key={gen.id} generation={gen} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryTab({ generations }: { generations: Generation[] }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Generation History</h1>
      {generations.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground">No history yet. Start generating!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map(gen => <GenerationRow key={gen.id} generation={gen} />)}
        </div>
      )}
    </div>
  )
}

function FavoritesTab({ generations }: { generations: Generation[] }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Saved Favorites</h1>
      {generations.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No favorites yet. Like your results to save them here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map(gen => <GenerationRow key={gen.id} generation={gen} />)}
        </div>
      )}
    </div>
  )
}

function SettingsTab({ profile }: { profile: User | null }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Settings</h1>
      <div className="glass border border-white/5 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Email</span>
            <span>{profile?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Plan</span>
            <span className={profile?.is_premium ? 'text-yellow-400 font-semibold' : ''}>
              {profile?.is_premium ? '⭐ Pro' : 'Free'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Member since</span>
            <span>{new Date(profile?.created_at || '').toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Referral code</span>
            <span className="font-mono text-primary">{profile?.referral_code}</span>
          </div>
        </div>
      </div>
      {!profile?.is_premium && (
        <div className="glass border border-primary/20 rounded-2xl p-6 bg-primary/5">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            Upgrade to Pro
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Unlimited generations, no watermarks, faster AI.</p>
          <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white font-semibold">
            View Plans →
          </Link>
        </div>
      )}
    </div>
  )
}

function GenerationRow({ generation }: { generation: Generation }) {
  const meta = TOOL_META[generation.tool_slug]
  const preview = typeof generation.output === 'string'
    ? generation.output.slice(0, 100)
    : JSON.stringify(generation.output).slice(0, 100)

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/20 transition-colors bg-card/50 group">
      <div className="text-2xl flex-shrink-0">{meta?.emoji || '✨'}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{meta?.name || generation.tool_slug}</div>
        <div className="text-xs text-muted-foreground truncate mt-0.5">{preview}...</div>
      </div>
      <div className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(generation.created_at)}</div>
      {generation.share_id && (
        <Link href={`/share/${generation.share_id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      )}
    </div>
  )
}
