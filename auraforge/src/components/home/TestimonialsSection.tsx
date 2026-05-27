'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    handle: '@sarahcreates',
    avatar: '🎨',
    role: 'Content Creator · 2.1M followers',
    text: 'The AI Roast Me tool went absolutely viral on my TikTok. 4 million views in 3 days. This platform is pure gold.',
    stars: 5,
    gradient: 'from-pink-500/10 to-violet-500/10',
  },
  {
    name: 'Marcus T.',
    handle: '@techfounder',
    avatar: '🚀',
    role: 'Startup Founder',
    text: 'Used the Resume Helper before my Google interview prep. The AI rewrote my bullets so well I barely recognized them — in the best way.',
    stars: 5,
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    name: 'Priya K.',
    handle: '@priyavibes',
    avatar: '✨',
    role: 'Instagram Influencer · 890K followers',
    text: 'My Aura Detector result card got 50K likes on Instagram. I use the Caption Generator every single day now. Game changer.',
    stars: 5,
    gradient: 'from-cyan-500/10 to-teal-500/10',
  },
  {
    name: 'Jordan L.',
    handle: '@jordanmakes',
    avatar: '🎯',
    role: 'YouTube Creator · 450K subs',
    text: 'The YouTube Title Generator is insane. My CTR went from 4% to 11% after using the AI-suggested titles. That\'s real money.',
    stars: 5,
    gradient: 'from-orange-500/10 to-red-500/10',
  },
  {
    name: 'Alex R.',
    handle: '@alexrandomly',
    avatar: '🌊',
    role: 'Twitter/X Creator',
    text: 'The Personality Scanner gave me my entire brand identity in 30 seconds. "Cosmic chaos merchant with good taste" — that\'s my bio now.',
    stars: 5,
    gradient: 'from-violet-500/10 to-blue-500/10',
  },
  {
    name: 'Zoe C.',
    handle: '@zoecreative',
    avatar: '🌸',
    role: 'Digital Nomad · Creator',
    text: 'I share my AuraForge results instead of Buzzfeed quizzes now. Everyone I know is using it. It\'s the new astrology.',
    stars: 5,
    gradient: 'from-pink-500/10 to-fuchsia-500/10',
  },
]

const STATS = [
  { value: '2.4M+', label: 'AI Generations Made' },
  { value: '580K+', label: 'Active Users' },
  { value: '98%', label: 'User Satisfaction' },
  { value: '47', label: 'Countries Reached' },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center p-6 rounded-2xl glass border border-white/5"
            >
              <div className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Creators are{' '}
            <span className="gradient-text">obsessed</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't take our word for it. Here's what the internet says.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.handle}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.07, duration: 0.5 }}
              className={cn(
                'p-6 rounded-2xl border border-white/5 relative overflow-hidden',
                'bg-gradient-to-br', t.gradient,
                'backdrop-blur-sm hover:border-white/10 transition-all duration-300'
              )}
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              
              <p className="text-sm leading-relaxed mb-5 text-foreground/90">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-base">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.handle} · {t.role}</div>
                </div>
                <div className="flex">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
