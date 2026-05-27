const rateMap = new Map<string, { count: number; resetAt: number }>()

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now()
  const entry = rateMap.get(identifier)
  
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    rateMap.set(identifier, { count: 1, resetAt })
    return { success: true, remaining: limit - 1, resetAt }
  }
  
  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }
  
  entry.count++
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  rateMap.forEach((value, key) => {
    if (now > value.resetAt) rateMap.delete(key)
  })
}, 60_000)

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
