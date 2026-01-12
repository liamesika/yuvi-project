'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import {
  FileText,
  CalendarCheck,
  Users,
  MessageCircle,
  RefreshCw,
  Clock,
} from 'lucide-react'

export function FeaturesSection() {
  const t = useTranslations('home.features')

  const features = [
    { num: '1', icon: FileText },
    { num: '2', icon: CalendarCheck },
    { num: '3', icon: MessageCircle },
    { num: '4', icon: Users },
    { num: '5', icon: RefreshCw },
    { num: '6', icon: Clock },
  ] as const

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map(({ num, icon: Icon }) => (
            <StaggerItem key={num}>
              <Card className="h-full group hover:border-primary/50 transition-colors">
                <CardContent className="p-6 lg:p-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {t(`items.${num}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`items.${num}.description`)}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
