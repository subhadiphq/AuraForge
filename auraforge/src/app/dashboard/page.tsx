import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DashboardContent } from '@/components/dashboard/DashboardContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | AuraForge',
  description: 'Your AuraForge dashboard — saved generations, usage stats, and account settings.',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: recentGenerations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <DashboardContent
          profile={profile}
          recentGenerations={recentGenerations || []}
        />
      </main>
      <Footer />
    </>
  )
}
