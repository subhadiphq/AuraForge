'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader2, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { ResultCard } from '@/components/tools/ResultCard'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/index'
import { useAuth } from '@/hooks/useAuth'
import { generateShareId } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PersonalityScannerPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareId] = useState(generateShareId())
  const { isPremium } = useAuth()

  const handleScan = async () => {
    if (!input.trim() || input.length < 15) { toast.error('Add more text for a better scan!'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: 'personality-scanner', input: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scan failed')
      setResult(data.result)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Scan failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <ToolLayout
        emoji="🧠"
        name="Personality Scanner"
        description="Paste anything you've written — bio, tweets, diary entry. AI detects your personality type, creator archetype, and viral potential."
        gradient={['#8b5cf6', '#3d9bff']}
        isPremiumUser={isPremium}
      >
        <div className="space-y-6">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your Twitter bio, Instagram description, a few tweets, or just describe how you think and feel..."
            className="min-h-[160px]"
            maxLength={2000}
          />
          <div className="text-xs text-muted-foreground">{input.length}/2000 · More text = more accurate results</div>

          <Button onClick={handleScan} loading={loading} size="lg">
            <Brain className="w-4 h-4" />
            Scan My Personality
          </Button>

          {loading && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-4xl mb-4 inline-block"
              >
                🧠
              </motion.div>
              <p className="text-sm text-muted-foreground">Scanning your personality matrix...</p>
            </div>
          )}

          {result && !loading && (
            <ResultCard
              result={result}
              toolName="Personality Scanner"
              toolEmoji="🧠"
              gradient={['#8b5cf6', '#3d9bff']}
              shareId={shareId}
              isPremium={isPremium}
            />
          )}
        </div>
      </ToolLayout>
      <Footer />
    </>
  )
}
