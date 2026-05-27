import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FREE_DAILY_CREDITS } from '@/lib/constants'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ used: 0, limit: FREE_DAILY_CREDITS, is_premium: false })
  }

  const { data } = await supabase
    .from('users')
    .select('credits_used, is_premium')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    used: data?.credits_used ?? 0,
    limit: data?.is_premium ? null : FREE_DAILY_CREDITS,
    is_premium: data?.is_premium ?? false,
  })
}

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data } = await supabase
    .from('users')
    .select('credits_used, is_premium')
    .eq('id', user.id)
    .single()

  if (data?.is_premium) {
    return NextResponse.json({ used: 0, limit: null, is_premium: true })
  }

  if ((data?.credits_used ?? 0) >= FREE_DAILY_CREDITS) {
    return NextResponse.json({ error: 'Credits exhausted' }, { status: 402 })
  }

  await supabase.rpc('increment_credits', { user_id: user.id })

  return NextResponse.json({
    used: (data?.credits_used ?? 0) + 1,
    limit: FREE_DAILY_CREDITS,
    is_premium: false,
  })
}
