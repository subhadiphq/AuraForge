-- ============================================================
-- AuraForge Platform — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE NOT NULL,
  premium_expires_at TIMESTAMPTZ,
  credits_used INTEGER DEFAULT 0 NOT NULL,
  credits_limit INTEGER DEFAULT 10 NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')) NOT NULL,
  referral_code TEXT UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
  referred_by TEXT,
  total_generations INTEGER DEFAULT 0 NOT NULL
);

-- ============================================================
-- GENERATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  tool_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  input JSONB DEFAULT '{}',
  output TEXT NOT NULL,
  share_id TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  likes INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')) NOT NULL,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TOOLS TABLE (for future dynamic tool management)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '✨',
  category TEXT DEFAULT 'fun',
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  trending_score FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'AuraForge Team',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  read_time INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0
);

-- ============================================================
-- GENERATION LIKES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.generation_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generation_id UUID NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(generation_id, user_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_tool_slug ON public.generations(tool_slug);
CREATE INDEX IF NOT EXISTS idx_generations_share_id ON public.generations(share_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_is_public ON public.generations(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Public can read public generations
CREATE POLICY "Public can read public generations" ON public.generations
  FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert generations" ON public.generations
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update own generations" ON public.generations
  FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions: users can only see their own
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Tools: everyone can read active tools
CREATE POLICY "Anyone can read active tools" ON public.tools
  FOR SELECT USING (is_active = TRUE);

-- Blog posts: anyone can read published posts
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (is_published = TRUE);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment credits function (called from API)
CREATE OR REPLACE FUNCTION public.increment_credits(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET credits_used = credits_used + 1, updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment total_generations
CREATE OR REPLACE FUNCTION public.increment_total_generations(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET total_generations = total_generations + 1, updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset daily credits (run via pg_cron or Supabase Edge Function daily)
CREATE OR REPLACE FUNCTION public.reset_daily_credits()
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET credits_used = 0, updated_at = NOW()
  WHERE is_premium = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- SEED DEFAULT TOOLS
-- ============================================================
INSERT INTO public.tools (id, name, slug, description, emoji, category, is_active)
VALUES
  ('ai-roast-me', 'AI Roast Me', 'ai-roast-me', 'Get brutally roasted by AI based on your bio', '🔥', 'fun', TRUE),
  ('personality-scanner', 'Personality Scanner', 'personality-scanner', 'Discover your internet personality type', '🧠', 'identity', TRUE),
  ('aura-detector', 'Aura Detector', 'aura-detector', 'Find out your aura color and energy', '✨', 'identity', TRUE),
  ('future-self', 'AI Future Self', 'future-self', 'AI predicts your future', '🚀', 'fun', TRUE),
  ('creator-bio', 'Creator Bio Generator', 'creator-toolkit', 'Generate bios for every platform', '🎨', 'creator', TRUE),
  ('caption-generator', 'Caption Generator', 'ai-caption', 'Viral captions for social media', '📸', 'creator', TRUE),
  ('title-generator', 'YouTube Title AI', 'ai-title-generator', 'Click-worthy content titles', '🎯', 'creator', TRUE),
  ('resume-helper', 'Resume Helper', 'resume-helper', 'AI-powered resume enhancement', '💼', 'career', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.tools TO anon, authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT SELECT ON public.generations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT ON public.generations TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_credits TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_total_generations TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reset_daily_credits TO service_role;

-- ============================================================
-- SETUP COMPLETE ✅
-- ============================================================
-- After running this schema:
-- 1. Enable Google OAuth in Supabase Auth → Providers
-- 2. Set Site URL in Auth → URL Configuration  
-- 3. Add your domain to allowed redirect URLs
-- 4. Set up pg_cron for daily credit resets (optional)
--    SELECT cron.schedule('reset-credits', '0 0 * * *', 'SELECT public.reset_daily_credits()');
-- ============================================================
