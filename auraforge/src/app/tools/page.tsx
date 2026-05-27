import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TrendingTools } from '@/components/home/TrendingTools'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All AI Tools — Free Viral AI Tools for Creators',
  description: 'Browse all free AI tools: personality scanner, AI roast, aura detector, caption generator, resume helper & more.',
}

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              All <span className="gradient-text">AI Tools</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Free viral AI tools for creators, curious minds, and everyone in between.
            </p>
          </div>
        </div>
        <TrendingTools />
      </main>
      <Footer />
    </>
  )
}
