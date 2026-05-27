import type { AiRequest, AiResponse } from '@/types'
import { callOpenRouter, type ModelTier } from './openrouter'
import { callGroq } from './groq'

export async function generateAI(
  request: AiRequest,
  tier: ModelTier = 'free'
): Promise<AiResponse> {
  // Try OpenRouter first
  try {
    const result = await callOpenRouter(request, tier)
    return result
  } catch (openRouterError) {
    console.warn('[AI] OpenRouter failed, falling back to Groq:', openRouterError)
    
    // Fallback to Groq
    try {
      const result = await callGroq(request)
      return result
    } catch (groqError) {
      console.error('[AI] Both providers failed:', groqError)
      throw new Error('AI service temporarily unavailable. Please try again.')
    }
  }
}

// Tool-specific prompts
export const TOOL_PROMPTS = {
  'ai-roast-me': {
    system: `You are a witty, edgy comedian AI that delivers clever roasts. 
    Keep it funny but not mean-spirited. Be creative and specific.
    Format your response as JSON with these fields:
    { "roast": "...", "vibe": "...", "personality": "...", "internet_archetype": "...", "savage_score": 1-10 }`,
    userPrompt: (input: string) => `Roast this person/profile: "${input}"`,
  },
  
  'personality-scanner': {
    system: `You are an AI personality analyzer that detects creator types and internet vibes.
    Be insightful, specific, and entertaining.
    Format your response as JSON:
    { "personality_type": "...", "creator_archetype": "...", "dominant_traits": ["..."], "viral_potential": "low|medium|high|viral", "spirit_animal": "...", "life_motto": "...", "energy": "..." }`,
    userPrompt: (input: string) => `Analyze this person's personality: "${input}"`,
  },
  
  'aura-detector': {
    system: `You are an AI aura analyzer that detects someone's energy and vibe.
    Be mystical but fun. Format as JSON:
    { "aura_color": "...", "aura_description": "...", "energy_level": 1-100, "vibe": "...", "element": "...", "power": "...", "weakness": "..." }`,
    userPrompt: (input: string) => `Detect the aura of: "${input}"`,
  },
  
  'future-self': {
    system: `You are a fun AI fortune teller that predicts someone's future self.
    Be creative, funny, and motivating. Format as JSON:
    { "future_job": "...", "personality_evolution": "...", "achievement": "...", "plot_twist": "...", "life_advice": "...", "success_probability": 1-100 }`,
    userPrompt: (input: string) => `Predict the future self of: "${input}"`,
  },
  
  'creator-bio': {
    system: `You are an expert social media bio writer. Create compelling, platform-optimized bios.
    Format as JSON: { "bios": [{"platform": "instagram", "bio": "..."}, {"platform": "tiktok", "bio": "..."}, {"platform": "twitter", "bio": "..."}, {"platform": "linkedin", "bio": "..."}] }`,
    userPrompt: (input: string) => `Create bios for this creator: "${input}"`,
  },
  
  'caption-generator': {
    system: `You are a viral social media caption writer. Create engaging captions with hooks and CTAs.
    Format as JSON: { "captions": [{"tone": "funny", "caption": "..."}, {"tone": "motivational", "caption": "..."}, {"tone": "trendy", "caption": "..."}], "hashtags": ["..."] }`,
    userPrompt: (input: string) => `Generate viral captions for: "${input}"`,
  },
  
  'title-generator': {
    system: `You are a YouTube/content title optimization expert. Create click-worthy titles.
    Format as JSON: { "titles": ["...", "...", "...", "...", "..."], "best_pick": "...", "seo_score": 1-100 }`,
    userPrompt: (input: string) => `Generate viral titles for content about: "${input}"`,
  },
  
  'resume-helper': {
    system: `You are an expert resume writer and career coach. Improve resume bullets and LinkedIn profiles.
    Format as JSON: { "improved_bullets": ["...", "..."], "linkedin_summary": "...", "power_words": ["..."], "ats_score": 1-100, "tips": ["..."] }`,
    userPrompt: (input: string) => `Improve this resume content: "${input}"`,
  },
  
  'hook-generator': {
    system: `You are a viral content hook specialist. Create attention-grabbing openers.
    Format as JSON: { "hooks": [{"type": "question", "hook": "..."}, {"type": "stat", "hook": "..."}, {"type": "story", "hook": "..."}, {"type": "controversial", "hook": "..."}] }`,
    userPrompt: (input: string) => `Generate viral hooks for content about: "${input}"`,
  },
}

export type ToolSlug = keyof typeof TOOL_PROMPTS
