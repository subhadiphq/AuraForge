import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — AI Creator Tips & Tutorials | AuraForge',
  description: 'Learn how to use AI tools for content creation, personal branding, and going viral on social media.',
}

// Mock blog posts — in production these come from Supabase or MDX files
const POSTS = [
  {
    slug: 'how-to-go-viral-on-tiktok-with-ai',
    title: 'How to Go Viral on TikTok Using AI Tools in 2025',
    description: 'Discover the AI-powered workflow top creators use to consistently produce viral TikTok content.',
    cover_image: null,
    tags: ['TikTok', 'AI Tools', 'Creator Tips'],
    read_time: 6,
    published_at: '2025-01-15',
    author: 'AuraForge Team',
    is_featured: true,
  },
  {
    slug: 'ai-bio-generator-guide',
    title: 'The Ultimate Guide to Writing Your Perfect AI Bio',
    description: 'Your bio is your first impression. Here\'s how AI can help you craft one that converts followers.',
    cover_image: null,
    tags: ['Bio Writing', 'Personal Brand', 'AI'],
    read_time: 4,
    published_at: '2025-01-10',
    author: 'AuraForge Team',
  },
  {
    slug: 'personality-types-for-creators',
    title: '8 Creator Personality Types (And Which AI Tools You Need)',
    description: 'Find your creator archetype and discover which tools will 10x your content game.',
    cover_image: null,
    tags: ['Personality', 'Creator DNA', 'Tools'],
    read_time: 7,
    published_at: '2025-01-05',
    author: 'AuraForge Team',
  },
  {
    slug: 'best-ai-caption-generators-2025',
    title: 'Best AI Caption Generators in 2025 (We Tested 12 Tools)',
    description: 'We put 12 AI caption tools through 500+ test prompts. Here\'s what actually works.',
    cover_image: null,
    tags: ['Captions', 'Instagram', 'Review'],
    read_time: 9,
    published_at: '2024-12-28',
    author: 'AuraForge Team',
  },
  {
    slug: 'ai-resume-tips-land-job-2025',
    title: '7 AI Resume Tricks That Will Land You More Interviews',
    description: 'These AI-powered resume optimization techniques helped our users increase interview rates by 3x.',
    cover_image: null,
    tags: ['Resume', 'Career', 'LinkedIn'],
    read_time: 5,
    published_at: '2024-12-20',
    author: 'AuraForge Team',
  },
  {
    slug: 'youtube-title-click-through-rate-ai',
    title: 'How I Increased My YouTube CTR from 3% to 12% Using AI Titles',
    description: 'A data-driven breakdown of the AI title formulas that generate the most clicks on YouTube.',
    cover_image: null,
    tags: ['YouTube', 'CTR', 'Titles'],
    read_time: 8,
    published_at: '2024-12-15',
    author: 'AuraForge Team',
  },
]

export default function BlogPage() {
  const [featured, ...rest] = POSTS

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Creator <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              AI tools, creator strategies, and viral content secrets.
            </p>
          </div>

          {/* Featured Post */}
          <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
            <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all hover:shadow-card-hover">
              <div className="h-48 sm:h-64 bg-gradient-to-br from-violet-500/20 to-blue-500/10 flex items-center justify-center">
                <span className="text-6xl">✍️</span>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-new">Featured</span>
                  {featured.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{t}</span>
                  ))}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground mb-4">{featured.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{featured.read_time} min read</span>
                  <span>·</span>
                  <span>{new Date(featured.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Post Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all hover:shadow-card h-full">
                  <div className="h-32 bg-gradient-to-br from-violet-500/10 to-blue-500/5 flex items-center justify-center">
                    <span className="text-3xl">
                      {post.tags[0] === 'TikTok' ? '🎵' :
                       post.tags[0] === 'YouTube' ? '🎥' :
                       post.tags[0] === 'Resume' ? '💼' :
                       post.tags[0] === 'Captions' ? '📸' : '✨'}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {post.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                      ))}
                    </div>
                    <h3 className="font-display font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.description}</p>
                    <div className="text-xs text-muted-foreground">{post.read_time} min read · {new Date(post.published_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
