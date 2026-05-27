'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">⚡</div>
        <h1 className="font-display text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset}
            className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white">
            Try Again
          </button>
          <Link href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border hover:border-primary/30 text-sm font-medium transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  )
}
