'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Copy, Check, RefreshCw } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { Button } from '@/components/ui/button'
import { Textarea, Input, Label } from '@/components/ui/index'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type SubTool = 'bio' | 'caption' | 'hashtag' | 'hook' | 'title'

const SUB_TOOLS: { id: SubTool; emoji: string; label: string }[] = [
  { id: 'bio', emoji: '👤', label: 'Bio Generator' },
  { id: 'caption', emoji: '📸', label: 'Caption' },
  { id: 'hashtag', emoji: '#', label: 'Hashtags' },
  { id: 'hook', emoji: '🎣', label: 'Hook Generator' },
  { id: 'title', emoji: '🎯', label: 'Title Generator' },
]

export default function CreatorToolkitPage() {
  const [activeTool, setActiveTool] = useState<SubTool>('bio')
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const { isPremium } = useAuth()

  const getSlug = () => {
    const map: Record<SubTool, string> = {
      bio: 'creator-bio',
      caption: 'caption-generator',
      hashtag: 'caption-generator',
      hook: 'hook-generator',
      title: 'title-generator',
    }
    return map[activeTool]
  }

  const getPlaceholder = () => {
    const map: Record<SubTool, string> = {
      bio: 'Describe yourself: your niche, personality, what you create...',
      caption: 'Describe your post or photo in a few words...',
      hashtag: 'What is your post/content about?',
      hook: 'What is your content/video about?',
      title: 'What is your YouTube video or blog post about?',
    }
    return map[activeTool]
  }

  const handleGenerate = async () => {
    if (!input.trim()) { toast.error('Please enter some text!'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: getSlug(), input: input.trim(), platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data.result)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <ToolLayout
        emoji="🎨"
        name="Creator Toolkit"
        description="Your AI-powered content team. Bio, captions, hashtags, hooks, and titles — all in one place."
        gradient={['#ec4899', '#8b5cf6']}
        isPremiumUser={isPremium}
      >
        {/* Sub-tool tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {SUB_TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id); setResult(null); setInput('') }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                activeTool === tool.id
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{tool.emoji}</span>
              {tool.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="space-y-4 mb-8">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="min-h-[120px]"
            maxLength={500}
          />

          {(activeTool === 'bio' || activeTool === 'caption') && (
            <div>
              <Label className="mb-2 block">Platform</Label>
              <div className="flex gap-2 flex-wrap">
                {['instagram', 'tiktok', 'twitter', 'linkedin', 'youtube'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                      platform === p
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'border border-border text-muted-foreground hover:border-primary/20'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleGenerate} loading={loading} size="lg" className="w-full sm:w-auto">
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-sm">Generating your content...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Your Results
                </h3>
                <Button variant="outline" size="sm" onClick={handleGenerate}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </Button>
              </div>

              {Object.entries(result).map(([key, value]) => (
                <ResultBlock key={key} label={key} value={value} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </ToolLayout>
      <Footer />
    </>
  )
}

function ResultBlock({ label, value }: { label: string; value: unknown }) {
  const [copied, setCopied] = useState(false)
  const displayLabel = label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (Array.isArray(value)) {
    return (
      <div className="border border-border rounded-xl p-4 bg-card">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{displayLabel}</div>
        <div className="space-y-2">
          {value.map((item: unknown, i: number) => {
            const text = typeof item === 'object' ? JSON.stringify(item) : String(item)
            return (
              <div key={i} className="flex items-start gap-2 group">
                <div className="flex-1 text-sm p-3 rounded-lg bg-muted/30 leading-relaxed">{text}</div>
                <button
                  onClick={() => handleCopy(text)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:border-primary/30 flex-shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const text = String(value)
  return (
    <div className="border border-border rounded-xl p-4 bg-card group">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{displayLabel}</div>
        <button
          onClick={() => handleCopy(text)}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded-lg"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          Copy
        </button>
      </div>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  )
}
