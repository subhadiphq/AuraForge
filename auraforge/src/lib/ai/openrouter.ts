import type { AiRequest, AiResponse } from '@/types'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

// Model routing — free models first, premium models for pro users
export const AI_MODELS = {
  free: 'meta-llama/llama-3.1-8b-instruct:free',
  fast: 'meta-llama/llama-3.1-70b-instruct',
  premium: 'anthropic/claude-3.5-sonnet',
  vision: 'openai/gpt-4o',
} as const

export type ModelTier = keyof typeof AI_MODELS

export async function callOpenRouter(
  request: AiRequest,
  tier: ModelTier = 'free'
): Promise<AiResponse> {
  const model = AI_MODELS[tier]
  
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://auraforge.app',
      'X-Title': 'AuraForge Platform',
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(request.system ? [{ role: 'system', content: request.system }] : []),
        { role: 'user', content: request.prompt },
      ],
      max_tokens: request.max_tokens || 1000,
      temperature: request.temperature ?? 0.8,
    }),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter error: ${response.status} ${error}`)
  }
  
  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  
  return {
    content,
    model: data.model || model,
    usage: {
      prompt_tokens: data.usage?.prompt_tokens || 0,
      completion_tokens: data.usage?.completion_tokens || 0,
      total_tokens: data.usage?.total_tokens || 0,
    },
  }
}
