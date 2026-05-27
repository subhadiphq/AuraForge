import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateAI } from '@/lib/ai/provider'
import { TOOL_PROMPTS, type ToolSlug } from '@/lib/ai/provider'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sanitizeInput, generateShareId } from '@/lib/utils'
import { FREE_DAILY_CREDITS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - IP based
    const ip = getClientIp(request)
    const rl = rateLimit(`ai:${ip}`, 30, 60_000) // 30 req/min per IP
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const body = await request.json()
    const { tool_slug, input, platform } = body

    if (!tool_slug || !input) {
      return NextResponse.json({ error: 'Missing tool_slug or input' }, { status: 400 })
    }

    if (!TOOL_PROMPTS[tool_slug as ToolSlug]) {
      return NextResponse.json({ error: 'Invalid tool' }, { status: 400 })
    }

    const cleanInput = sanitizeInput(String(input))
    if (!cleanInput || cleanInput.length < 5) {
      return NextResponse.json({ error: 'Input too short' }, { status: 400 })
    }

    // Check user credits
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isPremium = false
    let userId: string | null = null

    if (user) {
      userId = user.id
      const { data: profile } = await supabase
        .from('users')
        .select('is_premium, credits_used')
        .eq('id', user.id)
        .single()

      isPremium = profile?.is_premium ?? false

      if (!isPremium && (profile?.credits_used ?? 0) >= FREE_DAILY_CREDITS) {
        return NextResponse.json(
          { error: 'Daily credits exhausted. Upgrade to Pro for unlimited generations.' },
          { status: 402 }
        )
      }
    } else {
      // Anonymous: rate limit by IP more strictly
      const anonRl = rateLimit(`anon:${ip}`, 3, 86_400_000) // 3 per day for anonymous
      if (!anonRl.success) {
        return NextResponse.json(
          { error: 'Sign up for free to get 10 daily credits!' },
          { status: 402 }
        )
      }
    }

    // Build prompt
    const toolConfig = TOOL_PROMPTS[tool_slug as ToolSlug]
    const prompt = toolConfig.userPrompt(
      platform ? `${cleanInput} (Platform: ${platform})` : cleanInput
    )

    // Generate AI response
    const tier = isPremium ? 'fast' : 'free'
    const aiResponse = await generateAI(
      {
        prompt,
        system: toolConfig.system,
        tool_slug,
        user_id: userId ?? undefined,
        max_tokens: 1200,
        temperature: 0.85,
      },
      tier
    )

    // Parse JSON response
    let result: Record<string, unknown>
    try {
      const clean = aiResponse.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      result = JSON.parse(clean)
    } catch {
      // If not JSON, wrap in object
      result = { result: aiResponse.content }
    }

    // Save generation & update credits
    const shareId = generateShareId()

    if (userId) {
      // Save generation
      await supabase.from('generations').insert({
        user_id: userId,
        tool_id: tool_slug,
        tool_slug,
        input: { text: cleanInput, platform },
        output: aiResponse.content,
        share_id: shareId,
        is_public: false,
      })

      // Increment credits
      if (!isPremium) {
        await supabase.rpc('increment_credits', { user_id: userId })
      }

      // Increment total_generations
      await supabase.rpc('increment_total_generations', { user_id: userId })
    }

    return NextResponse.json({ result, share_id: shareId, model: aiResponse.model })
  } catch (error) {
    console.error('[AI API]', error)
    return NextResponse.json(
      { error: 'AI generation failed. Please try again.' },
      { status: 500 }
    )
  }
}
