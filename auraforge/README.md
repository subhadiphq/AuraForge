# AuraForge — Viral AI Identity & Creator Tools Platform

A production-ready AI SaaS platform with viral tools, premium subscriptions, and SEO-optimized pages.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth + Magic Link) |
| AI | OpenRouter API + Groq fallback |
| Payments | Stripe |
| Deployment | Vercel |
| Analytics | Google Analytics + PostHog + Microsoft Clarity |

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Signup pages
│   ├── (seo)/ai/[tool]/ # Programmatic SEO pages
│   ├── api/             # API routes (ai, auth, stripe, credits)
│   ├── blog/            # Blog listing + posts
│   ├── dashboard/       # User dashboard
│   ├── admin/           # Admin panel
│   ├── tools/           # All AI tool pages
│   ├── pricing/         # Pricing page
│   ├── share/[id]/      # Public result sharing
│   ├── sitemap.ts       # Dynamic XML sitemap
│   └── robots.ts        # robots.txt
├── components/
│   ├── home/            # Homepage sections
│   ├── layout/          # Navbar, Footer
│   ├── tools/           # Tool layout, result cards
│   ├── dashboard/       # Dashboard UI
│   ├── admin/           # Admin panel UI
│   ├── shared/          # Analytics, AdSlot, etc.
│   └── ui/              # Base UI components
├── lib/
│   ├── ai/              # OpenRouter + Groq providers
│   ├── supabase/        # Client + Server instances
│   ├── stripe.ts        # Stripe client
│   ├── rate-limit.ts    # IP rate limiting
│   └── utils.ts         # Helpers
├── hooks/               # useAuth, useCredits
└── types/               # TypeScript definitions
supabase/
└── schema.sql           # Full database schema
```

## 🛠️ Quick Setup

```bash
npm install
cp .env.example .env.local
# Fill in .env.local
npm run dev
```

See **DEPLOYMENT.md** for full setup instructions.

## 🎯 AI Tools Included

| Tool | Slug | Description |
|------|------|-------------|
| 🔥 AI Roast Me | `ai-roast-me` | Get brutally roasted by AI |
| 🧠 Personality Scanner | `personality-scanner` | Discover your internet personality |
| ✨ Aura Detector | `aura-detector` | Find your aura color & energy |
| 🚀 Future Self | `future-self` | AI predicts your future |
| 🎨 Creator Toolkit | `creator-toolkit` | Bio, captions, hooks, hashtags |
| 📸 Caption Generator | `ai-caption` | Viral captions for any platform |
| 🎯 Title Generator | `ai-title-generator` | Click-worthy YouTube titles |
| 💼 Resume Helper | `resume-helper` | AI-powered resume enhancement |

## 💰 Monetization

- **Free tier**: 10 credits/day
- **Pro tier**: $9.99/month or $79.99/year (unlimited)
- **Google AdSense**: Ready to enable on free pages
- **Referral system**: Built into user schema

## 📈 SEO

- Dynamic XML sitemap
- OpenGraph + Twitter cards
- Schema.org markup
- Programmatic SEO pages (`/ai/[tool]`)
- Blog architecture

## 🔐 Security

- Row Level Security on all Supabase tables
- Rate limiting (30 req/min per IP, 3 req/day anonymous)
- Input sanitization
- Security headers (HSTS, XSS, CSP)
- Auth middleware on protected routes

## 📄 License

MIT — Built with ❤️ by AuraForge Team
