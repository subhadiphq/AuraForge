'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { ResultCard } from '@/components/tools/ResultCard'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/index'
import { useAuth } from '@/hooks/useAuth'
import { generateShareId } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AuraDetectorPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareId] = useState(generateShareId())
  const { isPremium } = useAuth()

  const handleDetect = async () => {
    if (!input.trim()) { toast.error('Tell me about yourself first!'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: 'aura-detector', input: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data.result)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <ToolLayout
        emoji="✨"
        name="Aura Detector"
        description="What energy do you radiate? Describe yourself and AI will detect your aura color, energy level, and cosmic vibe."
        gradient={['#06b6d4', '#8b5cf6']}
        isPremiumUser={isPremium}
      >
        <div className="space-y-6">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your personality, daily mood, how people perceive you, your energy..."
            className="min-h-[140px]"
          />
          <Button onClick={handleDetect} loading={loading} size="lg">
            ✨ Detect My Aura
          </Button>
          {result && !loading && (
            <ResultCard result={result} toolName="Aura Detector" toolEmoji="✨"
              gradient={['#06b6d4', '#8b5cf6']} shareId={shareId} isPremium={isPremium} />
          )}
        </div>
      </ToolLayout>
      <Footer />
    </>
  )
}
