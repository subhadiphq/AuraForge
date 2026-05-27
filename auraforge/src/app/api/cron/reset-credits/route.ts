import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()
    await supabase.rpc('reset_daily_credits')
    return NextResponse.json({ success: true, message: 'Credits reset for all free users' })
  } catch (error) {
    console.error('[Cron] Credit reset failed:', error)
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 })
  }
}
