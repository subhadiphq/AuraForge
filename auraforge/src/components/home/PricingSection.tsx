'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, Crown, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const FREE_FEATURES = [
  '10 AI generations / day',
  'All 8 core tools',
  'Shareable result cards',
  'Community feed access',
  'Basic export',
  'Watermark on exports',
]

const FREE_MISSING = [
  'Unlimited generations',
  'Premium AI models',
  'Watermark-free exports',
  'Ad-free experience',
]

const PRO_FEATURES = [
  'Unlimited generations',
  'All tools + exclusive pro tools',
  'Faster AI (GPT-4 quality)',
  'Watermark-free exports',
  'Priority support',
  'Private generations',
  'Advanced AI models',
  'Ad-free experience',
  '7-day free trial',
]

export function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  const monthlyPrice = 9.99
  const yearlyPrice = (79.99 / 12).toFixed(2)
  const savings = Math.round((1 - 79.99 / (9.99 * 12)) * 100)

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4" id="pricing">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Pricing
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Start free, upgrade when{' '}
            <span className="gradient-text">you're hooked</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No credit card required to start. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                billing === 'monthly'
                  ? 'bg-card border border-primary/30 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <div className="relative">
              <button
                onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  billing === 'yearly' ? 'bg-primary' : 'bg-muted'
                )}
              >
                <div className={cn(
                  'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm',
                  billing === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'
                )} />
              </button>
            </div>
            <button
              onClick={() => setBilling('yearly')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                billing === 'yearly'
                  ? 'bg-card border border-primary/30 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Yearly
              <span className="badge-new">{savings}% off</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl border border-border p-8 bg-card"
          >
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-1">Free Forever</div>
              <div className="font-display text-4xl font-bold mb-1">$0</div>
              <div className="text-sm text-muted-foreground">No credit card needed</div>
            </div>

            <Link
              href="/signup"
              className="block w-full text-center py-3 rounded-xl border border-border hover:border-primary/30 font-semibold text-sm transition-all hover:bg-card mb-8"
            >
              Get started free
            </Link>

            <div className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
              {FREE_MISSING.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-muted-foreground/50">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative rounded-2xl border border-primary/40 p-8 bg-gradient-to-br from-primary/5 to-blue-500/5 neon-glow overflow-hidden"
          >
            {/* Popular badge */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                <Crown className="w-3 h-3" />
                POPULAR
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-card-shine pointer-events-none" />

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-primary" />
                <div className="text-sm font-medium text-primary">Pro Plan</div>
              </div>
              <div className="font-display text-4xl font-bold mb-1">
                ${billing === 'monthly' ? monthlyPrice : yearlyPrice}
                <span className="text-lg font-normal text-muted-foreground">/mo</span>
              </div>
              {billing === 'yearly' && (
                <div className="text-sm text-emerald-400 font-medium">
                  $79.99/year — save ${(9.99 * 12 - 79.99).toFixed(2)}
                </div>
              )}
              {billing === 'monthly' && (
                <div className="text-sm text-muted-foreground">7-day free trial</div>
              )}
            </div>

            <Link
              href="/signup?plan=pro"
              className="btn-primary block w-full text-center py-3 rounded-xl font-semibold text-sm text-white mb-8 relative z-10"
            >
              Start 7-day free trial →
            </Link>

            <div className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 space-y-2"
        >
          <p className="text-sm text-muted-foreground">
            🔒 Secure payment via Stripe · Cancel anytime · No hidden fees
          </p>
          <p className="text-xs text-muted-foreground/60">
            Join 12,000+ Pro users already unlocking unlimited AI power
          </p>
        </motion.div>
      </div>
    </section>
  )
}
