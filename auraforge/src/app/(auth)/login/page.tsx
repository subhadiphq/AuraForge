'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Chrome, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import toast from 'react-hot-toast'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}`,
      },
    })
    if (error) { toast.error(error.message); setGoogleLoading(false) }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Enter your email'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}` },
    })
    if (error) { toast.error(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="font-display text-2xl font-bold">Check your email!</h2>
        <p className="text-muted-foreground">We sent a magic link to <strong>{email}</strong></p>
        <button onClick={() => setSent(false)} className="text-sm text-primary hover:underline">
          Use a different email
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Button onClick={handleGoogleLogin} loading={googleLoading} variant="outline" size="lg" className="w-full">
        <Chrome className="w-5 h-5 text-blue-500" />
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or use email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleMagicLink} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-2 block">Email address</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required />
        </div>
        <Button type="submit" loading={loading} size="lg" className="w-full">
          <Mail className="w-4 h-4" />
          Send Magic Link
          <ArrowRight className="w-4 h-4 ml-auto" />
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        No password needed · Secure email link login
      </p>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 aurora-bg">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold gradient-text">AuraForge</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mt-6 mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to access your AI tools and saved results</p>
        </div>

        {/* Card */}
        <div className="glass border border-white/10 rounded-2xl p-8">
          <Suspense fallback={<div className="loader mx-auto" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up free →
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="hover:underline">Terms</Link> and{' '}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
