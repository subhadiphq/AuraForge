'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Chrome, Mail, Check, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import toast from 'react-hot-toast'

const PERKS = [
  '10 free AI generations every day',
  'Save & share your results',
  'Access all 8+ viral tools',
  'Community feed access',
]

function SignupForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const supabase = createClient()

  const redirect = plan === 'pro' ? '/dashboard?checkout=pro' : '/dashboard'

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}` },
    })
    if (error) { toast.error(error.message); setGoogleLoading(false) }
  }

  const handleEmail = async (e: React.FormEvent) => {
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
        <div className="text-5xl">📧</div>
        <h2 className="font-display text-2xl font-bold">Almost there!</h2>
        <p className="text-muted-foreground">We sent a magic link to <strong>{email}</strong>. Click it to activate your account.</p>
        <button onClick={() => setSent(false)} className="text-sm text-primary hover:underline">Different email?</button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-5">
      <Button onClick={handleGoogle} loading={googleLoading} variant="outline" size="lg" className="w-full">
        <Chrome className="w-5 h-5 text-blue-500" />
        Sign up with Google
      </Button>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or email</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <form onSubmit={handleEmail} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-2 block">Email address</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <Button type="submit" loading={loading} size="lg" className="w-full">
          <Mail className="w-4 h-4" />
          Create Free Account
          <ArrowRight className="w-4 h-4 ml-auto" />
        </Button>
      </form>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 aurora-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold gradient-text">AuraForge</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mt-6 mb-2">Create your account</h1>
          <p className="text-muted-foreground">Free forever. No credit card needed.</p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {PERKS.map(p => (
            <div key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              {p}
            </div>
          ))}
        </div>

        <div className="glass border border-white/10 rounded-2xl p-8">
          <Suspense fallback={<div className="loader mx-auto" />}>
            <SignupForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
