'use client'

import { motion } from 'framer-motion'
import { Users, Zap, DollarSign, TrendingUp, Crown, Activity, BarChart3 } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { TOOL_META } from '@/lib/constants'
import type { AdminStats } from '@/types'

interface Props {
  stats: AdminStats
  recentUsers: Array<{ id: string; created_at: string; is_premium: boolean }>
}

export function AdminDashboard({ stats, recentUsers }: Props) {
  const cards = [
    { label: 'Total Users', value: formatNumber(stats.total_users), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pro Users', value: formatNumber(stats.premium_users), icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Total Generations', value: formatNumber(stats.total_generations), icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { label: 'Generations Today', value: formatNumber(stats.generations_today), icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Subscriptions', value: formatNumber(stats.active_subscriptions), icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { label: 'Revenue MTD', value: `$${(stats.revenue_mtd / 100).toFixed(0)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass border border-white/5 rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="font-display text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tools */}
        <div className="glass border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Top Tools
          </h2>
          <div className="space-y-3">
            {stats.top_tools.map((tool, i) => {
              const meta = TOOL_META[tool.tool_slug]
              const max = stats.top_tools[0]?.count || 1
              const pct = (tool.count / max) * 100
              return (
                <div key={tool.tool_slug}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{meta?.emoji} {meta?.name || tool.tool_slug}</span>
                    <span className="text-xs text-muted-foreground font-mono">{formatNumber(tool.count)}</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            {stats.top_tools.length === 0 && (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="glass border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-5 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Recent Signups
          </h2>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs text-white font-bold">
                    U
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  {user.is_premium && <span className="text-xs text-yellow-400 font-medium">PRO</span>}
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-muted-foreground">No users yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
