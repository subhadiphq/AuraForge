'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Sparkles, Menu, X, Sun, Moon, Zap, ChevronDown,
  User, LogOut, Settings, LayoutDashboard, Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User as UserType } from '@/types'

const NAV_LINKS = [
  { href: '/tools', label: 'Tools' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
]

const TOOL_LINKS = [
  { href: '/tools/ai-roast-me', label: '🔥 AI Roast Me', desc: 'Get brutally roasted' },
  { href: '/tools/personality-scanner', label: '🧠 Personality Scanner', desc: 'Discover your type' },
  { href: '/tools/aura-detector', label: '✨ Aura Detector', desc: 'Find your energy' },
  { href: '/tools/creator-toolkit', label: '🎨 Creator Toolkit', desc: 'Bio, captions & more' },
  { href: '/tools/ai-roast-me', label: '🚀 Future Self', desc: 'See your destiny' },
  { href: '/tools/resume-helper', label: '💼 Resume Helper', desc: 'Level up your career' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser(data)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'glass border-b border-white/5 shadow-lg shadow-black/10'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight gradient-text">
                AuraForge
              </span>
              <span className="hidden sm:inline-flex items-center badge-new ml-1">Beta</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {/* Tools Dropdown */}
              <div className="relative" onMouseLeave={() => setToolsOpen(false)}>
                <button
                  onMouseEnter={() => setToolsOpen(true)}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                  )}
                >
                  Tools
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', toolsOpen && 'rotate-180')} />
                </button>
                
                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-72 glass border border-white/5 rounded-xl shadow-xl p-2"
                    >
                      {TOOL_LINKS.map((link) => (
                        <Link
                          key={link.href + link.label}
                          href={link.href}
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/10 transition-colors group"
                        >
                          <div>
                            <div className="text-sm font-medium">{link.label}</div>
                            <div className="text-xs text-muted-foreground">{link.desc}</div>
                          </div>
                        </Link>
                      ))}
                      <div className="border-t border-white/5 mt-2 pt-2">
                        <Link
                          href="/tools"
                          className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-accent/10 transition-colors text-sm text-primary font-medium"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          View all tools →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {NAV_LINKS.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-foreground bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                aria-label="Toggle theme"
              >
                <Sun className="w-4 h-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all absolute" />
                <Moon className="w-4 h-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
              </button>

              {/* User Menu or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">
                      {user.full_name?.split(' ')[0] || 'You'}
                    </span>
                    {user.is_premium && (
                      <Crown className="w-3.5 h-3.5 text-yellow-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 glass border border-white/5 rounded-xl shadow-xl p-2"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <div className="text-sm font-medium truncate">{user.full_name || 'User'}</div>
                          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent/10 transition-colors">
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Dashboard
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent/10 transition-colors">
                          <Settings className="w-3.5 h-3.5" />
                          Settings
                        </Link>
                        {!user.is_premium && (
                          <Link href="/pricing" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent/10 transition-colors text-primary">
                            <Crown className="w-3.5 h-3.5" />
                            Upgrade to Pro
                          </Link>
                        )}
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary inline-flex px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent/10 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden pt-16"
          >
            <div className="p-6 space-y-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Popular Tools
              </div>
              {TOOL_LINKS.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="flex items-center gap-3 py-3 border-b border-border text-foreground"
                >
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {NAV_LINKS.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-muted-foreground font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {!user && (
                <div className="pt-4 space-y-3">
                  <Link href="/login" className="block w-full py-3 rounded-xl border border-border text-center font-medium">
                    Sign in
                  </Link>
                  <Link href="/signup" className="block w-full py-3 rounded-xl btn-primary text-center font-semibold text-white">
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
