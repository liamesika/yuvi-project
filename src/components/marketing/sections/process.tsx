'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { ArrowRight, UserPlus, BookOpen, Send, TrendingUp } from 'lucide-react'

export function ProcessSection() {
  const t = useTranslations('home.process')

  const steps = [
    { num: '1', icon: UserPlus },
    { num: '2', icon: BookOpen },
    { num: '3', icon: Send },
    { num: '4', icon: TrendingUp },
  ] as const

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </FadeIn>

        <StaggerChildren className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map(({ num, icon: Icon }, index) => (
              <StaggerItem key={num} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="relative z-10 mb-4">
                    <div className="h-16 w-16 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="absolute -top-2 -end-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {num}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {t(`steps.${num}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(`steps.${num}.description`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerChildren>

        <FadeIn delay={0.4} className="text-center mt-12">
          <Link href="/process">
            <Button variant="outline" className="gap-2 group">
              {t('viewFull')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
