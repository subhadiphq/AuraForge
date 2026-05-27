'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Share2, Copy, Download, Twitter, Instagram, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ResultCardProps {
  result: Record<string, unknown>
  toolName: string
  toolEmoji: string
  gradient: [string, string]
  shareId?: string
  isPremium?: boolean
}

export function ResultCard({
  result,
  toolName,
  toolEmoji,
  gradient,
  shareId,
  isPremium = false,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const shareUrl = shareId
    ? `${process.env.NEXT_PUBLIC_APP_URL}/share/${shareId}`
    : ''

  const handleCopyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`I just got my AI analysis! 🤯 Check it out 👇\n${shareUrl}\n\nTry it free at auraforge.app`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const handleDownload = async () => {
    if (!isPremium) {
      toast.error('Upgrade to Pro for watermark-free downloads!')
      return
    }
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = `auraforge-${toolName.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Downloaded!')
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  const resultEntries = Object.entries(result).filter(
    ([key]) => !['error', 'raw'].includes(key)
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="space-y-6"
    >
      {/* Confetti effect trigger */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-semibold">Your Result</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Share buttons */}
          <button
            onClick={handleShareTwitter}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-colors"
            title="Share on Twitter/X"
          >
            <Twitter className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyLink}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className={cn(
              'w-9 h-9 rounded-lg border flex items-center justify-center transition-colors',
              isPremium
                ? 'border-border text-muted-foreground hover:text-primary hover:border-primary/30'
                : 'border-border/50 text-muted-foreground/40 cursor-not-allowed'
            )}
            title={isPremium ? 'Download as image' : 'Pro: Download without watermark'}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Result Card */}
      <div ref={cardRef} className="relative overflow-hidden rounded-2xl">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}20 0%, ${gradient[1]}15 100%)`,
          }}
        />
        <div className="absolute inset-0 border border-white/10 rounded-2xl" />

        <div className="relative p-6 sm:p-8">
          {/* Tool badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">{toolEmoji}</span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
            >
              {toolName.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">auraforge.app</span>
          </div>

          {/* Result fields */}
          <div className="space-y-4">
            {resultEntries.map(([key, value]) => (
              <ResultField key={key} label={key} value={value} gradient={gradient} />
            ))}
          </div>

          {/* Watermark for free users */}
          {!isPremium && (
            <div className="absolute bottom-3 right-4 text-[10px] text-white/30 font-medium">
              auraforge.app
            </div>
          )}
        </div>
      </div>

      {/* Try again button */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Not happy with the result?{' '}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-primary hover:underline font-medium"
          >
            Try again ↑
          </button>
        </p>
      </div>
    </motion.div>
  )
}

function ResultField({
  label,
  value,
  gradient,
}: {
  label: string
  value: unknown
  gradient: [string, string]
}) {
  const displayLabel = label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())

  if (Array.isArray(value)) {
    return (
      <div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {displayLabel}
        </div>
        <div className="flex flex-wrap gap-2">
          {value.map((item: unknown, i: number) => (
            <span
              key={i}
              className="text-sm px-3 py-1 rounded-full border border-white/10 bg-white/5"
            >
              {String(item)}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (typeof value === 'number') {
    const pct = Math.min(100, Math.max(0, value))
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {displayLabel}
          </div>
          <span className="text-sm font-bold">{pct}/100</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        {displayLabel}
      </div>
      <p className="text-sm sm:text-base leading-relaxed font-medium">{String(value)}</p>
    </div>
  )
}
