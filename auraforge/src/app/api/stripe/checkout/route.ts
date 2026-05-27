import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, createPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { action, priceId } = await request.json()
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL!

    if (action === 'checkout') {
      const session = await createCheckoutSession({
        userId: user.id,
        email: user.email!,
        priceId: priceId || process.env.STRIPE_PRICE_ID_MONTHLY!,
        successUrl: `${origin}/dashboard?success=true`,
        cancelUrl: `${origin}/pricing?canceled=true`,
      })
      return NextResponse.json({ url: session.url })
    }

    if (action === 'portal') {
      const { data: profile } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

      if (!profile?.stripe_customer_id) {
        return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
      }

      const session = await createPortalSession({
        customerId: profile.stripe_customer_id,
        returnUrl: `${origin}/dashboard`,
      })
      return NextResponse.json({ url: session.url })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[Stripe]', error)
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 })
  }
}
