'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FREE_DAILY_CREDITS } from '@/lib/constants'

interface ToolLayoutProps {
  children: ReactNode
  emoji: string
  name: string
  description: string
  gradient: [string, string]
  isPremium?: boolean
  creditsUsed?: number
  isPremiumUser?: boolean
}

export function ToolLayout({
  children,
  emoji,
  name,
  description,
  gradient,
  isPremiumUser = false,
  creditsUsed = 0,
}: ToolLayoutProps) {
  const remaining = isPremiumUser ? Infinity : Math.max(0, FREE_DAILY_CREDITS - creditsUsed)

  return (
    <div className="min-h-screen">
      {/* Tool Header */}
      <div
        className="relative py-12 sm:py-20 px-4 overflow-hidden border-b border-border"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${gradient[0]}15, transparent 70%)`,
        }}
      >
        <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Tools
            </Link>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl sm:text-7xl"
            >
              {emoji}
            </motion.div>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-3xl sm:text-4xl font-bold mb-2"
              >
                {name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-muted-foreground text-base sm:text-lg"
              >
                {description}
              </motion.p>
            </div>

            {/* Credits badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              {isPremiumUser ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium">
                  <Crown className="w-4 h-4" />
                  Unlimited
                </div>
              ) : (
                <Link href="/pricing" className="block">
                  <div className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
                    remaining > 3
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : remaining > 0
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  )}>
                    <Zap className="w-4 h-4" />
                    {remaining === Infinity ? '∞' : remaining} credits left
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        {children}
      </div>
    </div>
  )
}
