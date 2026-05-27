'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, TrendingUp, Flame, Star, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOOLS = [
  {
    slug: 'ai-roast-me',
    emoji: '🔥',
    name: 'AI Roast Me',
    description: 'Let AI absolutely destroy you. Upload your bio and get roasted harder than your situationship.',
    gradient: 'from-orange-500 to-red-500',
    bg: 'from-orange-500/10 to-red-500/5',
    border: 'border-orange-500/20 hover:border-orange-500/50',
    badge: 'VIRAL',
    badgeColor: 'bg-orange-500/20 text-orange-400',
    uses: '284K',
    tag: 'Fun',
  },
  {
    slug: 'personality-scanner',
    emoji: '🧠',
    name: 'Personality Scanner',
    description: 'Paste your text or social profile. Get your internet personality type, creator archetype, and viral potential.',
    gradient: 'from-violet-500 to-blue-500',
    bg: 'from-violet-500/10 to-blue-500/5',
    border: 'border-violet-500/20 hover:border-violet-500/50',
    badge: 'TRENDING',
    badgeColor: 'bg-violet-500/20 text-violet-400',
    uses: '196K',
    tag: 'Identity',
  },
  {
    slug: 'aura-detector',
    emoji: '✨',
    name: 'Aura Detector',
    description: 'What is your aura color? What energy do you project? The AI sees all.',
    gradient: 'from-cyan-500 to-teal-500',
    bg: 'from-cyan-500/10 to-teal-500/5',
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    badge: 'NEW',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
    uses: '142K',
    tag: 'Identity',
  },
  {
    slug: 'future-self',
    emoji: '🚀',
    name: 'AI Future Self',
    description: 'AI predicts your 10-year future based on your current vibe. Eerily accurate or hilariously wrong.',
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'from-blue-500/10 to-indigo-500/5',
    border: 'border-blue-500/20 hover:border-blue-500/50',
    badge: null,
    badgeColor: '',
    uses: '98K',
    tag: 'Fun',
  },
  {
    slug: 'creator-toolkit',
    emoji: '🎨',
    name: 'Creator Toolkit',
    description: 'Generate viral bios, captions, hashtags, hooks, and titles. Your AI content team.',
    gradient: 'from-pink-500 to-violet-500',
    bg: 'from-pink-500/10 to-violet-500/5',
    border: 'border-pink-500/20 hover:border-pink-500/50',
    badge: 'ALL-IN-ONE',
    badgeColor: 'bg-pink-500/20 text-pink-400',
    uses: '221K',
    tag: 'Creator',
  },
  {
    slug: 'ai-caption',
    emoji: '📸',
    name: 'Caption Generator',
    description: 'Describe your photo, get 3 different viral captions with hashtags for any platform.',
    gradient: 'from-fuchsia-500 to-pink-500',
    bg: 'from-fuchsia-500/10 to-pink-500/5',
    border: 'border-fuchsia-500/20 hover:border-fuchsia-500/50',
    badge: null,
    badgeColor: '',
    uses: '173K',
    tag: 'Creator',
  },
  {
    slug: 'ai-title-generator',
    emoji: '🎯',
    name: 'YouTube Title AI',
    description: 'Generate click-worthy YouTube and content titles. A/B tested formats proven to get clicks.',
    gradient: 'from-red-500 to-orange-500',
    bg: 'from-red-500/10 to-orange-500/5',
    border: 'border-red-500/20 hover:border-red-500/50',
    badge: null,
    badgeColor: '',
    uses: '87K',
    tag: 'Creator',
  },
  {
    slug: 'resume-helper',
    emoji: '💼',
    name: 'Resume Helper',
    description: 'Paste a job description. AI rewrites your resume bullets with impact-driven language.',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/20 hover:border-emerald-500/50',
    badge: null,
    badgeColor: '',
    uses: '64K',
    tag: 'Career',
  },
]

export function TrendingTools() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4" id="tools">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Flame className="w-3.5 h-3.5" />
            Trending Tools
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            AI tools built to go{' '}
            <span className="gradient-text">viral</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every result generates a stunning shareable card. Post to TikTok, Instagram, X — watch the engagement roll in.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} inView={inView} />
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/40 text-sm font-medium transition-all hover:bg-card group"
          >
            View all tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ToolCard({ tool, index, inView }: { tool: typeof TOOLS[0]; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
    >
      <Link href={`/tools/${tool.slug}`} className="block h-full">
        <div className={cn(
          'tool-card h-full p-5 group cursor-pointer',
          `bg-gradient-to-br ${tool.bg}`,
          tool.border,
          'border transition-all duration-300'
        )}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">{tool.emoji}</div>
            {tool.badge && (
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', tool.badgeColor)}>
                {tool.badge}
              </span>
            )}
          </div>

          {/* Content */}
          <h3 className="font-display font-semibold text-base mb-2 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
            {tool.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              {tool.uses} uses
            </div>
            <div className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-lg',
              'bg-white/5 dark:bg-white/5',
              `bg-gradient-to-r ${tool.gradient}`,
              'text-white'
            )}>
              Try free →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
