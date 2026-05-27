// ============================================================
// AuraForge Platform - TypeScript Types
// ============================================================

export type Theme = 'light' | 'dark' | 'system'

// --- USER ---
export interface User {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  username: string | null
  created_at: string
  updated_at: string
  is_premium: boolean
  premium_expires_at: string | null
  credits_used: number
  credits_limit: number
  stripe_customer_id: string | null
  role: 'user' | 'admin'
  referral_code: string
  referred_by: string | null
  total_generations: number
}

// --- TOOL ---
export interface Tool {
  id: string
  slug: string
  name: string
  description: string
  short_description: string
  emoji: string
  category: ToolCategory
  tags: string[]
  is_premium: boolean
  is_active: boolean
  usage_count: number
  trending_score: number
  created_at: string
}

export type ToolCategory =
  | 'identity'
  | 'creator'
  | 'career'
  | 'fun'
  | 'social'
  | 'writing'

// --- GENERATION ---
export interface Generation {
  id: string
  user_id: string | null
  tool_id: string
  tool_slug: string
  input: Record<string, unknown>
  output: string
  share_id: string | null
  is_public: boolean
  likes: number
  created_at: string
}

// --- BLOG ---
export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  author: string
  author_avatar?: string
  published_at: string
  updated_at?: string
  tags: string[]
  cover_image?: string
  read_time: number
  is_featured?: boolean
}

// --- SUBSCRIPTION ---
export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
}

// --- PLAN ---
export interface Plan {
  id: 'free' | 'pro' | 'ultra'
  name: string
  price_monthly: number
  price_yearly: number
  credits_per_day: number | null // null = unlimited
  features: string[]
  popular?: boolean
  stripe_price_id_monthly?: string
  stripe_price_id_yearly?: string
}

// --- API RESPONSE ---
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// --- AI ---
export interface AiRequest {
  prompt: string
  system?: string
  model?: string
  max_tokens?: number
  temperature?: number
  tool_slug: string
  user_id?: string
}

export interface AiResponse {
  content: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// --- SHARE CARD ---
export interface ShareCardData {
  tool_name: string
  result: string
  user_name?: string
  emoji: string
  gradient: [string, string]
  share_id: string
}

// --- ADMIN ---
export interface AdminStats {
  total_users: number
  premium_users: number
  total_generations: number
  generations_today: number
  revenue_mtd: number
  active_subscriptions: number
  top_tools: Array<{ tool_slug: string; count: number }>
}

// --- COMMUNITY FEED ---
export interface FeedItem {
  id: string
  tool_name: string
  tool_emoji: string
  preview: string
  username: string | null
  avatar_url: string | null
  likes: number
  created_at: string
  share_id: string
}

// --- SEARCH PARAMS ---
export interface SearchParams {
  [key: string]: string | string[] | undefined
}

// --- FORM STATES ---
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// --- TOOL INPUT ---
export interface ToolInput {
  text?: string
  name?: string
  platform?: 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'youtube'
  tone?: 'funny' | 'professional' | 'casual' | 'bold'
  length?: 'short' | 'medium' | 'long'
  topic?: string
}

// --- CREDITS ---
export interface CreditsInfo {
  used: number
  limit: number
  is_premium: boolean
  resets_at: string
}
