'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import {
  ArrowRight,
  UserPlus,
  BookOpen,
  Send,
  MessageCircle,
  Trophy,
  Check,
} from 'lucide-react'

export default function ProcessPage() {
  const t = useTranslations('process')

  const steps = [
    { key: 'enrollment', icon: UserPlus },
    { key: 'weeklyWork', icon: BookOpen },
    { key: 'submission', icon: Send },
    { key: 'checkin', icon: MessageCircle },
    { key: 'completion', icon: Trophy },
  ] as const

  const weeks = ['week1', 'week2', 'week3', 'week4'] as const

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground">{t('hero.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t('overview.title')}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('overview.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute start-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              <StaggerChildren className="space-y-8 md:space-y-12">
                {steps.map(({ key, icon: Icon }, index) => (
                  <StaggerItem key={key}>
                    <div className="relative flex gap-6 md:gap-8">
                      {/* Step Number */}
                      <div className="relative z-10 hidden md:block">
                        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                      </div>

                      {/* Content Card */}
                      <Card className="flex-1">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center md:hidden">
                              <span className="font-bold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <CardTitle className="text-xl flex items-center gap-2">
                                <Icon className="h-5 w-5 text-primary hidden md:inline" />
                                {t(`steps.${key}.title`)}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            {t(`steps.${key}.description`)}
                          </p>
                          <ul className="grid sm:grid-cols-2 gap-2">
                            {['1', '2', '3', '4'].map((num) => (
                              <li key={num} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-success shrink-0" />
                                <span className="text-foreground">
                                  {t(`steps.${key}.details.${num}`)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('weeks.title')}</h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {weeks.map((week, index) => (
              <StaggerItem key={week}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                      <CardTitle>{t(`weeks.${week}.title`)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {['1', '2', '3', '4'].map((num) => (
                        <li key={num} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                          <span className="text-muted-foreground">
                            {t(`weeks.${week}.topics.${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">{t('cta.title')}</h2>
            <Link href="/pricing">
              <Button size="xl" className="gap-2 group">
                {t('cta.button')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
