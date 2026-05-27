import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard | AuraForge' }

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch stats
  const [usersRes, generationsRes, subsRes] = await Promise.all([
    supabase.from('users').select('id, created_at, is_premium', { count: 'exact' }),
    supabase.from('generations').select('id, tool_slug, created_at', { count: 'exact' }),
    supabase.from('subscriptions').select('id, status', { count: 'exact' }).eq('status', 'active'),
  ])

  const today = new Date().toISOString().split('T')[0]
  const todayGens = generationsRes.data?.filter(g => g.created_at.startsWith(today)).length || 0

  const toolCounts = generationsRes.data?.reduce((acc: Record<string, number>, g) => {
    acc[g.tool_slug] = (acc[g.tool_slug] || 0) + 1
    return acc
  }, {}) || {}

  const topTools = Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tool_slug, count]) => ({ tool_slug, count }))

  const stats = {
    total_users: usersRes.count || 0,
    premium_users: usersRes.data?.filter(u => u.is_premium).length || 0,
    total_generations: generationsRes.count || 0,
    generations_today: todayGens,
    revenue_mtd: (subsRes.count || 0) * 999,
    active_subscriptions: subsRes.count || 0,
    top_tools: topTools,
  }

  const recentUsers = usersRes.data?.slice(-10).reverse() || []

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <AdminDashboard stats={stats} recentUsers={recentUsers} />
      </main>
    </>
  )
}
