import type { AiRequest, AiResponse } from '@/types'

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

export const GROQ_MODELS = {
  fast: 'llama-3.1-8b-instant',
  smart: 'llama-3.1-70b-versatile',
  mixtral: 'mixtral-8x7b-32768',
} as const

export async function callGroq(request: AiRequest): Promise<AiResponse> {
  const model = GROQ_MODELS.fast // Default to fastest model
  
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
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
    throw new Error(`Groq error: ${response.status} ${error}`)
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
