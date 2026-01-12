'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { Check, ArrowRight } from 'lucide-react'

export function PricingPreviewSection() {
  const t = useTranslations('home.pricing')
  const pt = useTranslations('pricing')

  const tiers = ['self', 'group', 'premium'] as const

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const isPopular = tier === 'group'
            return (
              <StaggerItem key={tier}>
                <Card
                  className={`h-full relative ${
                    isPopular ? 'border-primary shadow-lg scale-105' : ''
                  }`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 start-1/2 -translate-x-1/2">
                      {pt(`tiers.${tier}.popular`)}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{pt(`tiers.${tier}.name`)}</CardTitle>
                    <CardDescription>{pt(`tiers.${tier}.description`)}</CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-bold text-foreground">
                        {pt('currency')}
                        {pt(`tiers.${tier}.price.oneTime`)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {['1', '2', '3', '4'].map((num) => (
                        <li key={num} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {pt(`tiers.${tier}.features.${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing" className="block pt-4">
                      <Button
                        className="w-full"
                        variant={isPopular ? 'default' : 'outline'}
                      >
                        {pt(`tiers.${tier}.cta`)}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerChildren>

        <FadeIn delay={0.4} className="text-center mt-12">
          <Link href="/pricing">
            <Button variant="link" className="gap-2 group">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
