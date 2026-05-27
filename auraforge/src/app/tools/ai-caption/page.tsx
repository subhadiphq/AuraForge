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

export default function CaptionPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareId] = useState(generateShareId())
  const { isPremium } = useAuth()

  const handle = async () => {
    if (!input.trim()) { toast.error('Describe your post!'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: 'caption-generator', input: input.trim() }),
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
      <ToolLayout emoji="📸" name="Caption Generator"
        description="Describe your photo or post. Get 3 viral caption styles with hashtags for any platform."
        gradient={['#ec4899', '#8b5cf6']} isPremiumUser={isPremium}>
        <div className="space-y-6">
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Describe your photo: 'Sunset at the beach with friends, golden hour vibe, summer energy'" className="min-h-[120px]" />
          <Button onClick={handle} loading={loading} size="lg">📸 Generate Captions</Button>
          {result && !loading && <ResultCard result={result} toolName="Caption Generator" toolEmoji="📸"
            gradient={['#ec4899', '#8b5cf6']} shareId={shareId} isPremium={isPremium} />}
        </div>
      </ToolLayout>
      <Footer />
    </>
  )
}
