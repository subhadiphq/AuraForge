'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Send, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { ResultCard } from '@/components/tools/ResultCard'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/index'
import { useAuth } from '@/hooks/useAuth'
import { generateShareId } from '@/lib/utils'
import toast from 'react-hot-toast'

const EXAMPLES = [
  '"Coffee addict. I love hiking but haven\'t been in 2 years. Netflix and philosophy podcasts. Looking for my person."',
  '"CEO of my own vibes. Amateur chef. Professional overthinker. Dog mom x2. Manifesting my dream life."',
  '"Software engineer by day, aspiring DJ by night. I quote The Office too much. Plant killer."',
]

export default function AIRoastMePage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareId] = useState(generateShareId())
  const { user, isPremium } = useAuth()

  const handleSubmit = async () => {
    if (!input.trim() || input.trim().length < 10) {
      toast.error('Please enter at least 10 characters!')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: 'ai-roast-me', input: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data.result)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <ToolLayout
        emoji="🔥"
        name="AI Roast Me"
        description="Paste your bio, dating profile, or social handle. AI will absolutely destroy you (lovingly)."
        gradient={['#f97316', '#ef4444']}
        isPremiumUser={isPremium}
      >
        <div className="space-y-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Your bio or description
              </label>
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste your dating profile, Instagram bio, Twitter/X bio, or just describe yourself... AI will handle the rest 😈"
                className="min-h-[140px] text-sm"
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {input.length}/1000 characters
                </span>
                {!input && (
                  <button
                    onClick={() => setInput(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)])}
                    className="text-xs text-primary hover:underline"
                  >
                    Use an example
                  </button>
                )}
              </div>
            </div>

            {/* Example chips */}
            {!input && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(ex.replace(/"/g, ''))}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors text-left line-clamp-1 max-w-[200px]"
                    >
                      {ex.substring(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!input.trim() || loading}
              size="lg"
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Roasting you...
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  Roast Me 🔥
                </>
              )}
            </Button>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-8 text-center"
            >
              <div className="text-3xl mb-3 animate-bounce">🔥</div>
              <p className="text-sm text-muted-foreground">
                AI is carefully crafting your roast...
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                This usually takes 3–5 seconds
              </p>
            </motion.div>
          )}

          {/* Result */}
          {result && !loading && (
            <ResultCard
              result={result}
              toolName="AI Roast Me"
              toolEmoji="🔥"
              gradient={['#f97316', '#ef4444']}
              shareId={shareId}
              isPremium={isPremium}
            />
          )}

          {/* How it works */}
          {!result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="border border-border rounded-2xl p-6 bg-card/50"
            >
              <h3 className="font-semibold mb-4 text-sm">How it works</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { step: '1', text: 'Paste your bio or description', icon: '📝' },
                  { step: '2', text: 'AI analyzes your personality and vibe', icon: '🤖' },
                  { step: '3', text: 'Get roasted + share with your friends', icon: '🔥' },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <p className="text-sm text-muted-foreground">{s.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </ToolLayout>
      <Footer />
    </>
  )
}
