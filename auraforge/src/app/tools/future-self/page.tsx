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

export default function FutureSelfPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareId] = useState(generateShareId())
  const { isPremium } = useAuth()

  const handlePredict = async () => {
    if (!input.trim()) { toast.error('Tell me about yourself!'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: 'future-self', input: input.trim() }),
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
        emoji="🚀"
        name="AI Future Self"
        description="Where will you be in 10 years? AI predicts your future based on your current personality and goals."
        gradient={['#3d9bff', '#6d28d9']}
        isPremiumUser={isPremium}
      >
        <div className="space-y-6">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe who you are now — your goals, habits, personality, dreams, and current life situation..."
            className="min-h-[160px]"
          />
          <Button onClick={handlePredict} loading={loading} size="lg">
            🔮 Predict My Future
          </Button>
          {result && !loading && (
            <ResultCard result={result} toolName="AI Future Self" toolEmoji="🚀"
              gradient={['#3d9bff', '#6d28d9']} shareId={shareId} isPremium={isPremium} />
          )}
        </div>
      </ToolLayout>
      <Footer />
    </>
  )
}
