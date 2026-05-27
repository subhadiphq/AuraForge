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

export default function TitleGeneratorPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareId] = useState(generateShareId())
  const { isPremium } = useAuth()

  const handle = async () => {
    if (!input.trim()) { toast.error('Describe your content!'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: 'title-generator', input: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.result)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <ToolLayout emoji="🎯" name="YouTube Title AI"
        description="Describe your video. Get 5 click-worthy title variations proven to maximize CTR."
        gradient={['#f97316', '#ef4444']} isPremiumUser={isPremium}>
        <div className="space-y-6">
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="What is your video or content about? E.g. 'How I saved $10,000 in 6 months as a 24 year old'" className="min-h-[120px]" />
          <Button onClick={handle} loading={loading} size="lg">🎯 Generate Titles</Button>
          {result && !loading && <ResultCard result={result} toolName="YouTube Title AI" toolEmoji="🎯"
            gradient={['#f97316', '#ef4444']} shareId={shareId} isPremium={isPremium} />}
        </div>
      </ToolLayout>
      <Footer />
    </>
  )
}
