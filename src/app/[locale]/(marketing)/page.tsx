import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/marketing/sections/hero'
import { SocialProofSection } from '@/components/marketing/sections/social-proof'
import { FeaturesSection } from '@/components/marketing/sections/features'
import { ProcessSection } from '@/components/marketing/sections/process'
import { PricingPreviewSection } from '@/components/marketing/sections/pricing-preview'
import { FAQSection } from '@/components/marketing/sections/faq'
import { CTASection } from '@/components/marketing/sections/cta'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <ProcessSection />
      <PricingPreviewSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
