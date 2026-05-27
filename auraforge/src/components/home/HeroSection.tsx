'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, ArrowRight, Play, Zap, Stars, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const HEADLINE_WORDS = ['Personality', 'Aura', 'Creator DNA', 'True Vibe', 'Future Self']
const LIVE_STATS = [
  { value: '2.4M+', label: 'Generations' },
  { value: '580K+', label: 'Users' },
  { value: '47', label: 'Countries' },
]

const FLOATING_CARDS = [
  {
    emoji: '🔥',
    text: '"Your aura is pure chaotic genius energy"',
    tool: 'Aura Detector',
    color: 'from-orange-500/20 to-red-500/10',
    position: 'left-4 top-20 md:left-8 md:top-16',
    delay: 0,
  },
  {
    emoji: '🧠',
    text: '"ENFP with sigma rizz undertones"',
    tool: 'Personality Scanner',
    color: 'from-violet-500/20 to-blue-500/10',
    position: 'right-4 top-24 md:right-8 md:top-20',
    delay: 0.5,
  },
  {
    emoji: '✨',
    text: '"Viral potential: 97% — you\'re built different"',
    tool: 'Creator DNA',
    color: 'from-cyan-500/20 to-teal-500/10',
    position: 'left-4 bottom-24 md:left-12 md:bottom-20',
    delay: 1,
  },
]

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const yParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const opacityParallax = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % HEADLINE_WORDS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 hero-grid opacity-40 dark:opacity-100 pointer-events-none" />
      <div className="absolute inset-0 aurora-bg pointer-events-none" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/8 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] rounded-full bg-cyan-500/6 blur-[80px] pointer-events-none" />

      {/* Floating Cards */}
      {FLOATING_CARDS.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + card.delay, duration: 0.6 }}
          className={cn(
            'absolute hidden lg:block z-10 max-w-[220px]',
            card.position
          )}
          style={{ y: useTransform(scrollYProgress, [0, 0.3], [0, -20 * (i + 1)]) }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            className={cn(
              'glass border border-white/10 rounded-2xl p-3 shadow-glass',
              'bg-gradient-to-br', card.color
            )}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{card.emoji}</span>
              <div>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.text}</p>
                <p className="text-[10px] text-primary font-medium mt-1">{card.tool}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        style={{ y: yParallax, opacity: opacityParallax }}
        className="relative z-10 text-center max-w-5xl mx-auto px-4"
      >
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm mb-8 cursor-pointer hover:border-primary/30 transition-colors"
        >
          <span className="flex items-center gap-1">
            <Stars className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-muted-foreground">New:</span>
            <span className="font-semibold">AI Aura Detector v2 is live</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]"
        >
          Discover Your
          <br />
          <span className="relative inline-block">
            <AnimatedWord words={HEADLINE_WORDS} currentWord={currentWord} />
          </span>
          <br />
          <span className="text-muted-foreground/60">with AI</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Free viral AI tools that scan your vibe, roast you, predict your future, 
          and supercharge your creator content. Go viral with a single click.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/tools"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white neon-glow group"
          >
            <Zap className="w-5 h-5 group-hover:animate-bounce-subtle" />
            Try Tools Free
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="#demo"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-border hover:border-primary/30 text-base font-medium transition-all hover:bg-card group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Play className="w-3.5 h-3.5 text-primary fill-primary" />
            </div>
            Watch Demo
          </Link>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center justify-center gap-8 sm:gap-12"
        >
          {LIVE_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground/40"
        >
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/40" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function AnimatedWord({ words, currentWord }: { words: string[]; currentWord: number }) {
  return (
    <div className="relative inline-block h-[1.2em] overflow-hidden">
      {words.map((word, i) => (
        <motion.span
          key={word}
          initial={{ y: '100%', opacity: 0 }}
          animate={{
            y: i === currentWord ? '0%' : i < currentWord ? '-100%' : '100%',
            opacity: i === currentWord ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute left-0 right-0 gradient-text"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
                                   }
          
