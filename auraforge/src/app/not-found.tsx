import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 aurora-bg">
        <div className="text-center">
          <div className="text-8xl mb-6">🤖</div>
          <h1 className="font-display text-5xl font-bold mb-4 gradient-text">404</h1>
          <p className="text-xl text-muted-foreground mb-8">This page doesn't exist in our dimension.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white">
              Go Home
            </Link>
            <Link href="/tools" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/30 text-sm font-medium transition-colors">
              Try AI Tools
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
