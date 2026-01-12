'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  const t = useTranslations('home.cta')

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 lg:p-16 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 start-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 end-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              {t('subtitle')}
            </p>
            <Link href="/pricing">
              <Button
                size="xl"
                variant="secondary"
                className="gap-2 group"
              >
                {t('button')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
