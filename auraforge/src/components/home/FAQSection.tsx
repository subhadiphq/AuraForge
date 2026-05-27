'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'Is AuraForge completely free?',
    a: 'Yes! You get 10 free AI generations every day with no credit card required. Upgrade to Pro for unlimited generations and premium features.',
  },
  {
    q: 'How accurate are the AI personality results?',
    a: 'Our AI analyzes patterns in your text or bio to generate insightful (and entertaining) personality readings. Think of it as a much more fun Myers-Briggs — surprisingly accurate, always shareable.',
  },
  {
    q: 'Can I share my results on social media?',
    a: 'Absolutely — that\'s the whole point! Every result generates a beautiful shareable card optimized for Instagram, TikTok, Twitter/X, and more. Free users get cards with a small watermark; Pro users get clean, watermark-free exports.',
  },
  {
    q: 'What AI models power AuraForge?',
    a: 'We use a combination of top-tier models via OpenRouter (including Llama 3.1, Claude, and GPT-4 class models), with Groq as our ultra-fast fallback. Pro users get access to the most advanced models.',
  },
  {
    q: 'How do daily credits work?',
    a: 'Free users get 10 AI generation credits per day, which reset at midnight UTC. Each tool use = 1 credit. Pro users have unlimited credits — no resets, no limits.',
  },
  {
    q: 'Can I cancel my Pro subscription anytime?',
    a: 'Yes, completely hassle-free. Cancel anytime from your dashboard and you\'ll retain access until the end of your billing period. No questions asked.',
  },
  {
    q: 'Is my data private?',
    a: 'Your private generations are only visible to you. Public generations (shared to the community feed) are visible to everyone. You can delete your data and account at any time from settings.',
  },
  {
    q: 'Do you have an API?',
    a: 'We\'re working on a public API for developers! Join the waitlist at /api-docs to get early access when we launch.',
  },
]

export function FAQSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Got <span className="gradient-text">questions?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about AuraForge.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={cn(
                'rounded-xl border transition-all duration-200',
                openIndex === i
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-card hover:border-border/80'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-sm sm:text-base pr-4">{faq.q}</span>
                <div className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                  openIndex === i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                )}>
                  {openIndex === i
                    ? <Minus className="w-3.5 h-3.5" />
                    : <Plus className="w-3.5 h-3.5" />
                  }
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm">
            Still have questions?{' '}
            <a href="mailto:hello@auraforge.app" className="text-primary hover:underline font-medium">
              hello@auraforge.app
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
