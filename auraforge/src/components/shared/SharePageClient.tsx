'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Twitter } from 'lucide-react'
import { TOOL_META } from '@/lib/constants'
import toast from 'react-hot-toast'

interface Props {
  result: Record<string, unknown>
  meta: typeof TOOL_META[string] | undefined
  shareId: string
}

export function SharePageClient({ result, meta, shareId }: Props) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://auraforge.app'}/share/${shareId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTweet = () => {
    const text = encodeURIComponent(`I just got my AI ${meta?.name} result 🤯\n\n${shareUrl}\n\nTry it free at auraforge.app`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Result card */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-6 space-y-4">
        {Object.entries(result).map(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          return (
            <div key={key}>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2">
                  {value.map((v: unknown, i: number) => (
                    <span key={i} className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">{String(v)}</span>
                  ))}
                </div>
              ) : typeof value === 'number' ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }} />
                  </div>
                  <span className="text-sm font-bold">{value}/100</span>
                </div>
              ) : (
                <p className="text-sm leading-relaxed font-medium">{String(value)}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Share actions */}
      <div className="flex gap-3">
        <button onClick={handleTweet}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:border-[#1DA1F2]/40 hover:text-[#1DA1F2] transition-colors text-sm font-medium">
          <Twitter className="w-4 h-4" /> Share on X
        </button>
        <button onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:border-primary/40 hover:text-primary transition-colors text-sm font-medium">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </motion.div>
  )
}
