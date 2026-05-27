import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { TrendingTools } from '@/components/home/TrendingTools'
import { CommunityFeed } from '@/components/home/CommunityFeed'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PricingSection } from '@/components/home/PricingSection'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AuraForge — Free Viral AI Identity & Creator Tools',
  description: 'Discover your AI personality, aura, future self, and supercharge your creator content. 2.4M+ generations made. 100% free to start.',
  alternates: { canonical: 'https://auraforge.app' },
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrendingTools />
        <CommunityFeed />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
