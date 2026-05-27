import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { TrendingTools } from '@/components/home/TrendingTools'

// Map SEO slugs → tool data
const SEO_PAGES: Record<string, {
  title: string
  h1: string
  description: string
  tool_href: string
  faq: Array<{ q: string; a: string }>
}> = {
  'free-ai-roast-generator': {
    title: 'Free AI Roast Generator — Get Brutally Roasted by AI',
    h1: 'Free AI Roast Generator',
    description: 'The funniest free AI roast generator online. Paste your bio and get roasted in seconds. No signup needed.',
    tool_href: '/tools/ai-roast-me',
    faq: [
      { q: 'Is the AI roast generator free?', a: 'Yes! You get 10 free roasts per day with no credit card needed.' },
      { q: 'How does the AI roast work?', a: 'You paste your bio or description, and our AI analyzes your text to generate a witty, personalized roast.' },
      { q: 'Is it safe and friendly?', a: 'Absolutely. Our AI is trained to be funny but never mean-spirited or harmful.' },
    ],
  },
  'ai-personality-test-free': {
    title: 'Free AI Personality Test — Discover Your Internet Personality Type',
    h1: 'Free AI Personality Test',
    description: 'Take the most accurate free AI personality test. Discover your creator archetype, internet vibe, and viral potential in seconds.',
    tool_href: '/tools/personality-scanner',
    faq: [
      { q: 'How accurate is the AI personality test?', a: 'Our AI analyzes language patterns to give you highly specific personality insights.' },
      { q: 'Is this different from Myers-Briggs?', a: 'Yes — we focus on your online personality, creator archetype, and viral potential.' },
    ],
  },
  'ai-bio-generator-instagram': {
    title: 'Free AI Bio Generator for Instagram — Create the Perfect Bio',
    h1: 'AI Bio Generator for Instagram',
    description: 'Generate a perfect Instagram bio with AI in seconds. Free, no signup required. Get professional bios for all platforms.',
    tool_href: '/tools/creator-toolkit',
    faq: [
      { q: 'How many Instagram bio variations will I get?', a: 'You get optimized bios for Instagram, TikTok, Twitter/X, and LinkedIn all at once.' },
      { q: 'Can I customize the bio tone?', a: 'Yes — choose from funny, professional, casual, or bold tone styles.' },
    ],
  },
  'linkedin-summary-generator-ai': {
    title: 'Free AI LinkedIn Summary Generator — Stand Out to Recruiters',
    h1: 'AI LinkedIn Summary Generator',
    description: 'Generate a compelling LinkedIn summary with AI. Get noticed by recruiters with keyword-optimized, professional summaries.',
    tool_href: '/tools/resume-helper',
    faq: [
      { q: 'Will the AI summary be ATS-friendly?', a: 'Yes — our AI is trained on LinkedIn profiles that get the most recruiter attention.' },
      { q: 'How long will my LinkedIn summary be?', a: 'We generate summaries optimized for LinkedIn\'s 2,600 character limit.' },
    ],
  },
  'ai-caption-generator-instagram': {
    title: 'Free AI Caption Generator for Instagram — Viral Captions Instantly',
    h1: 'AI Caption Generator for Instagram',
    description: 'Generate viral Instagram captions with AI. Get 3 caption styles plus hashtags for any photo or post topic.',
    tool_href: '/tools/ai-caption',
    faq: [
      { q: 'How many captions will the AI generate?', a: 'You get 3 different caption styles — funny, motivational, and trendy — plus relevant hashtags.' },
      { q: 'Does it generate hashtags too?', a: 'Yes! Every caption comes with a curated set of trending hashtags.' },
    ],
  },
}

interface Props {
  params: { tool: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = SEO_PAGES[params.tool]
  if (!page) return { title: 'AI Tool | AuraForge' }
  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description, type: 'website' },
    alternates: { canonical: `https://auraforge.app/ai/${params.tool}` },
  }
}

export default function SEOPage({ params }: Props) {
  const page = SEO_PAGES[params.tool]
  if (!page) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 gradient-text">{page.h1}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{page.description}</p>
            <Link href={page.tool_href}
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white neon-glow">
              Try Free Now →
            </Link>
            <p className="text-xs text-muted-foreground mt-3">No signup required · 10 free daily uses</p>
          </div>

          {/* FAQ for SEO */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faq.map((item, i) => (
                <div key={i} className="border border-border rounded-xl p-5 bg-card">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Schema markup */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: page.faq.map(item => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            }),
          }} />
        </div>

        {/* Related tools */}
        <TrendingTools />
      </main>
      <Footer />
    </>
  )
}

export function generateStaticParams() {
  return Object.keys(SEO_PAGES).map(tool => ({ tool }))
}
