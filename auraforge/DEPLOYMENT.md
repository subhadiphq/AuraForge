# AuraForge Platform — Deployment Guide

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free)
- A Vercel account (free)
- An OpenRouter API key (free tier available)

---

## Step 1: Set Up Supabase (Database + Auth)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Name: `auraforge` | Region: closest to your users | Password: save this!
3. Wait ~2 min for project to provision
4. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run
5. Go to **Authentication → Providers** → Enable **Google**
   - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
   - Add to Supabase Google provider
6. Go to **Authentication → URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/api/auth/callback`

**Copy from Supabase Settings → API:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2: Get AI API Keys

### OpenRouter (Primary - Free models available)
1. Go to [openrouter.ai](https://openrouter.ai) → Sign up
2. Go to Keys → Create new key
3. Copy as `OPENROUTER_API_KEY`

### Groq (Fallback - Very fast & free)
1. Go to [console.groq.com](https://console.groq.com) → Sign up
2. API Keys → Create API Key
3. Copy as `GROQ_API_KEY`

---

## Step 3: Set Up Stripe (Payments)

1. Go to [stripe.com](https://stripe.com) → Create account
2. Go to **Products** → Create product:
   - Name: "AuraForge Pro"
   - Price: $9.99/month recurring → Copy price ID as `STRIPE_PRICE_ID_MONTHLY`
   - Also create: $79.99/year → Copy as `STRIPE_PRICE_ID_YEARLY`
3. **API Keys** → Copy `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. **Webhooks** → Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook signing secret as `STRIPE_WEBHOOK_SECRET`

---

## Step 4: Deploy to Vercel

### Option A: One-Click Deploy
```bash
npx vercel --cwd /path/to/auraforge
```

### Option B: GitHub Deploy
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your repo → Framework: Next.js (auto-detected)
4. Add all environment variables (see `.env.example`)
5. Deploy

### Option C: Manual CLI
```bash
cd auraforge
npm install
npx vercel login
npx vercel --prod
```

---

## Step 5: Configure Environment Variables in Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL          = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY         = eyJhbGciOi...
OPENROUTER_API_KEY                = sk-or-v1-...
GROQ_API_KEY                      = gsk_...
STRIPE_SECRET_KEY                 = sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET             = whsec_...
STRIPE_PRICE_ID_MONTHLY           = price_...
STRIPE_PRICE_ID_YEARLY            = price_...
NEXT_PUBLIC_APP_URL               = https://yourdomain.com
```

---

## Step 6: Optional Integrations

### Google Analytics
1. Create property at [analytics.google.com](https://analytics.google.com)
2. Copy Measurement ID: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

### Google AdSense
1. Apply at [adsense.google.com](https://adsense.google.com)
2. Once approved, add: `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx`

### Microsoft Clarity (Heatmaps - Free)
1. Go to [clarity.microsoft.com](https://clarity.microsoft.com) → New Project
2. Add: `NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx`

### PostHog (Product Analytics - Free)
1. Go to [posthog.com](https://posthog.com)
2. Add: `NEXT_PUBLIC_POSTHOG_KEY=phc_...`

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# 3. Run development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## Daily Credit Reset (Important!)

Free users get 10 credits/day that reset at midnight. Set up automatic reset:

### Option A: Supabase pg_cron
In Supabase SQL Editor:
```sql
SELECT cron.schedule('reset-credits', '0 0 * * *', 'SELECT public.reset_daily_credits()');
```

### Option B: Vercel Cron Job
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reset-credits",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

## Performance Optimizations (Already Included)

- ✅ Next.js Image optimization with WebP/AVIF
- ✅ Edge runtime for API routes
- ✅ Static generation for SEO pages
- ✅ Code splitting per route
- ✅ Font optimization (Google Fonts)
- ✅ Security headers
- ✅ Gzip compression

---

## First Admin User

After deploying, run in Supabase SQL Editor:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

Then visit: `https://yourdomain.com/admin`

---

## Support

- Docs: See README.md
- Email: hello@auraforge.app
- Issues: GitHub Issues
