import Link from 'next/link'
import { Sparkles, Twitter, Github, Instagram } from 'lucide-react'

const FOOTER_LINKS = {
  'Product': [
    { href: '/tools', label: 'All Tools' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/changelog', label: 'Changelog' },
  ],
  'Tools': [
    { href: '/tools/ai-roast-me', label: 'AI Roast Me' },
    { href: '/tools/personality-scanner', label: 'Personality Scanner' },
    { href: '/tools/aura-detector', label: 'Aura Detector' },
    { href: '/tools/creator-toolkit', label: 'Creator Toolkit' },
    { href: '/tools/resume-helper', label: 'Resume Helper' },
    { href: '/tools/ai-caption', label: 'Caption Generator' },
  ],
  'Company': [
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
    { href: '/api-docs', label: 'API' },
    { href: '/affiliates', label: 'Affiliates' },
  ],
  'Legal': [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/dmca', label: 'DMCA' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">AuraForge</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Free viral AI identity tools for creators and curious minds. Join 500K+ users discovering themselves with AI.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/auraforge_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/auraforge_app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/auraforge-app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SEO Tool Pages */}
        <div className="border-t border-border pt-8 mb-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Popular AI Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Free AI Roast Generator', 'AI Personality Test', 'AI Bio Generator',
              'AI Caption Generator', 'LinkedIn Summary Generator', 'AI Resume Enhancer',
              'AI YouTube Title Generator', 'Viral Hook Generator', 'AI Aura Test',
              'Future Self AI Predictor', 'AI Hashtag Generator', 'Content Creator AI',
            ].map((item) => (
              <Link
                key={item}
                href={`/tools/${item.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors border border-transparent hover:border-border rounded px-2 py-1"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AuraForge. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for creators worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
