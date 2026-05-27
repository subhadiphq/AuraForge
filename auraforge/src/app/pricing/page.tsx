import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PricingSection } from '@/components/home/PricingSection'
import { FAQSection } from '@/components/home/FAQSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans | AuraForge',
  description: 'Start free with 10 daily AI generations. Upgrade to Pro for unlimited access, faster AI, and watermark-free exports.',
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
