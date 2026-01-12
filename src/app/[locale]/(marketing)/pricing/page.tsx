'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { Check, X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const t = useTranslations('pricing')
  const [isMonthly, setIsMonthly] = useState(false)

  const tiers = ['self', 'group', 'premium'] as const

  const comparisonFeatures = [
    'content',
    'templates',
    'community',
    'updates',
    'weeklyMeetings',
    'feedback',
    'whatsapp',
    'personalCalls',
    'privateSupport',
    'customization',
  ] as const

  const tierFeatures: Record<string, string[]> = {
    self: ['content', 'templates', 'community', 'updates'],
    group: ['content', 'templates', 'community', 'updates', 'weeklyMeetings', 'feedback', 'whatsapp'],
    premium: ['content', 'templates', 'community', 'updates', 'weeklyMeetings', 'feedback', 'whatsapp', 'personalCalls', 'privateSupport', 'customization'],
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{t('hero.subtitle')}</p>

            {/* Payment Toggle */}
            <div className="inline-flex items-center gap-4 bg-muted p-1 rounded-full">
              <button
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-colors',
                  !isMonthly ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                )}
                onClick={() => setIsMonthly(false)}
              >
                {t('toggle.oneTime')}
              </button>
              <button
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-colors',
                  isMonthly ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
                )}
                onClick={() => setIsMonthly(true)}
              >
                {t('toggle.monthly')}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => {
              const isPopular = tier === 'group'
              return (
                <StaggerItem key={tier}>
                  <Card
                    className={cn(
                      'h-full relative',
                      isPopular ? 'border-primary shadow-xl scale-105 z-10' : ''
                    )}
                  >
                    {isPopular && (
                      <Badge className="absolute -top-3 start-1/2 -translate-x-1/2">
                        {t(`tiers.${tier}.popular`)}
                      </Badge>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl">{t(`tiers.${tier}.name`)}</CardTitle>
                      <CardDescription className="text-base">
                        {t(`tiers.${tier}.description`)}
                      </CardDescription>
                      <div className="pt-6">
                        <span className="text-5xl font-bold text-foreground">
                          {t('currency')}
                          {isMonthly
                            ? t(`tiers.${tier}.price.monthly`)
                            : t(`tiers.${tier}.price.oneTime`)}
                        </span>
                        {isMonthly && (
                          <span className="text-muted-foreground ms-2">{t('perMonth')}</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {['1', '2', '3', '4'].map((num) => (
                          <li key={num} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground">
                              {t(`tiers.${tier}.features.${num}`)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Link href={tier === 'premium' ? '/contact' : '/register'} className="block">
                        <Button
                          className="w-full"
                          size="lg"
                          variant={isPopular ? 'default' : 'outline'}
                        >
                          {t(`tiers.${tier}.cta`)}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('comparison.title')}</h2>
          </FadeIn>

          <FadeIn delay={0.1} className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-start py-4 pe-4"></th>
                  {tiers.map((tier) => (
                    <th key={tier} className="text-center py-4 px-4">
                      <span className="font-semibold text-foreground">
                        {t(`tiers.${tier}.name`)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature} className="border-b">
                    <td className="py-4 pe-4 text-foreground">
                      {t(`comparison.features.${feature}`)}
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier} className="text-center py-4 px-4">
                        {tierFeatures[tier].includes(feature) ? (
                          <Check className="h-5 w-5 text-success mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        </div>
      </section>

      {/* Notes & Refund */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <FadeIn>
              <Card>
                <CardContent className="p-6 lg:p-8">
                  <h3 className="font-semibold text-lg text-foreground mb-4">{t('notes.title')}</h3>
                  <ul className="space-y-3">
                    {['1', '2', '3'].map((num) => (
                      <li key={num} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">•</span>
                        {t(`notes.items.${num}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="border-success/20 bg-success/5">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-success" />
                    <h3 className="font-semibold text-lg text-foreground">{t('refund.title')}</h3>
                  </div>
                  <p className="text-muted-foreground">{t('refund.description')}</p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
