import { MetadataRoute } from 'next'
import { TOOL_SLUGS } from '@/lib/constants'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://auraforge.app'

const BLOG_SLUGS = [
  'how-to-go-viral-on-tiktok-with-ai',
  'ai-bio-generator-guide',
  'personality-types-for-creators',
  'best-ai-caption-generators-2025',
  'ai-resume-tips-land-job-2025',
  'youtube-title-click-through-rate-ai',
]

// Programmatic SEO pages
const SEO_PAGES = [
  'free-ai-roast-generator',
  'ai-personality-test-free',
  'ai-bio-generator-instagram',
  'ai-caption-generator-instagram',
  'ai-caption-generator-tiktok',
  'linkedin-summary-generator-ai',
  'ai-resume-bullet-points-generator',
  'youtube-title-generator-free',
  'ai-hashtag-generator',
  'ai-aura-test',
  'future-self-ai-predictor',
  'viral-hook-generator-ai',
  'ai-content-creator-tools',
  'free-ai-tools-for-creators',
  'ai-personal-brand-generator',
  'twitter-bio-generator-ai',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/signup`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const toolPages = TOOL_SLUGS.map(slug => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const blogPages = BLOG_SLUGS.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const seoPages = SEO_PAGES.map(slug => ({
    url: `${BASE_URL}/ai/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...toolPages, ...blogPages, ...seoPages]
}
