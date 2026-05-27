export const APP_NAME = 'AuraForge'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://auraforge.app'
export const APP_DESCRIPTION = 'Free viral AI identity and creator tools for everyone'

export const FREE_DAILY_CREDITS = 10
export const CREDITS_RESET_HOUR = 0 // midnight UTC

export const TOOL_SLUGS = [
  'ai-roast-me',
  'personality-scanner',
  'aura-detector',
  'future-self',
  'creator-toolkit',
  'ai-caption',
  'ai-title-generator',
  'resume-helper',
] as const

export const TOOL_META: Record<string, { name: string; emoji: string; description: string }> = {
  'ai-roast-me': {
    name: 'AI Roast Me',
    emoji: '🔥',
    description: 'Get brutally (but lovingly) roasted by AI based on your bio or profile',
  },
  'personality-scanner': {
    name: 'Personality Scanner',
    emoji: '🧠',
    description: 'Discover your internet personality type, creator archetype, and viral potential',
  },
  'aura-detector': {
    name: 'Aura Detector',
    emoji: '✨',
    description: 'Find out your aura color, energy level, and cosmic vibe',
  },
  'future-self': {
    name: 'AI Future Self',
    emoji: '🚀',
    description: 'AI predicts your future based on your current personality and goals',
  },
  'creator-toolkit': {
    name: 'Creator Toolkit',
    emoji: '🎨',
    description: 'Generate bios, captions, hashtags, hooks, and titles for any platform',
  },
  'ai-caption': {
    name: 'Caption Generator',
    emoji: '📸',
    description: 'Generate viral captions for Instagram, TikTok, and Twitter/X',
  },
  'ai-title-generator': {
    name: 'YouTube Title AI',
    emoji: '🎯',
    description: 'Create click-worthy titles that maximize YouTube CTR',
  },
  'resume-helper': {
    name: 'Resume Helper',
    emoji: '💼',
    description: 'Improve your resume bullets and LinkedIn profile with AI',
  },
}

export const SHARE_PLATFORMS = ['twitter', 'instagram', 'tiktok', 'linkedin', 'copy'] as const
