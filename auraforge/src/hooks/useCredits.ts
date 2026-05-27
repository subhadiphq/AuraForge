'use client'

import { useState, useCallback } from 'react'
import { FREE_DAILY_CREDITS } from '@/lib/constants'

export function useCredits(userId?: string, isPremium?: boolean) {
  const [creditsUsed, setCreditsUsed] = useState(0)
  const [loading, setLoading] = useState(false)

  const checkCredits = useCallback(async (): Promise<boolean> => {
    if (isPremium) return true

    try {
      const res = await fetch('/api/credits')
      const data = await res.json()
      if (!res.ok) return false
      setCreditsUsed(data.used)
      return data.used < FREE_DAILY_CREDITS
    } catch {
      return true // Allow on error
    }
  }, [isPremium])

  const consumeCredit = useCallback(async (): Promise<boolean> => {
    if (isPremium) return true

    try {
      const res = await fetch('/api/credits', { method: 'POST' })
      if (!res.ok) return false
      const data = await res.json()
      setCreditsUsed(data.used)
      return true
    } catch {
      return false
    }
  }, [isPremium])

  const remaining = isPremium ? Infinity : Math.max(0, FREE_DAILY_CREDITS - creditsUsed)
  const hasCredits = isPremium || creditsUsed < FREE_DAILY_CREDITS

  return { creditsUsed, remaining, hasCredits, checkCredits, consumeCredit, loading }
}
