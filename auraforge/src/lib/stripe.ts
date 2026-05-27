import Stripe from 'stripe'
import type { Plan } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    credits_per_day: 10,
    features: [
      '10 AI generations per day',
      'All core tools',
      'Shareable result cards',
      'Community feed',
      'Basic export',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price_monthly: 999, // $9.99
    price_yearly: 7999, // $79.99
    credits_per_day: null, // unlimited
    popular: true,
    stripe_price_id_monthly: process.env.STRIPE_PRICE_ID_MONTHLY,
    stripe_price_id_yearly: process.env.STRIPE_PRICE_ID_YEARLY,
    features: [
      'Unlimited generations',
      'All tools + exclusive pro tools',
      'Faster AI (GPT-4 quality)',
      'Watermark-free exports',
      'Priority support',
      'Private generations',
      'Advanced models',
      'Ad-free experience',
    ],
  },
]

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
      trial_period_days: 7,
    },
    allow_promotion_codes: true,
  })
  
  return session
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  
  return session
}
