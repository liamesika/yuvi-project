'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { Quote } from 'lucide-react'

export function SocialProofSection() {
  const t = useTranslations('home.socialProof')

  const testimonials = ['1', '2', '3'] as const

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('title')}</h2>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((num) => (
            <StaggerItem key={num}>
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    &ldquo;{t(`testimonials.${num}.quote`)}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {t(`testimonials.${num}.author`).charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {t(`testimonials.${num}.author`)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(`testimonials.${num}.role`)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
