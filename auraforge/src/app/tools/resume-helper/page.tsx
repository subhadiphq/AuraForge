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

export default function ResumeHelperPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareId] = useState(generateShareId())
  const { isPremium } = useAuth()

  const handleImprove = async () => {
    if (!input.trim()) { toast.error('Paste your resume content first!'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: 'resume-helper', input: input.trim() }),
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
        emoji="💼"
        name="Resume Helper"
        description="Paste your resume bullets, job description, or LinkedIn summary. AI rewrites them with powerful action words."
        gradient={['#10b981', '#059669']}
        isPremiumUser={isPremium}
      >
        <div className="space-y-6">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your resume bullets, experience description, or LinkedIn summary here..."
            className="min-h-[200px] font-mono text-sm"
          />
          <Button onClick={handleImprove} loading={loading} size="lg">
            💼 Improve My Resume
          </Button>
          {result && !loading && (
            <ResultCard result={result} toolName="Resume Helper" toolEmoji="💼"
              gradient={['#10b981', '#059669']} shareId={shareId} isPremium={isPremium} />
          )}
        </div>
      </ToolLayout>
      <Footer />
    </>
  )
}
