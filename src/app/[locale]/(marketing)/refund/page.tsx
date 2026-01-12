'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/motion'

export default function RefundPage() {
  const t = useTranslations('legal.refund')

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">{t('title')}</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">{t('lastUpdated')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.guarantee.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.guarantee.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.eligibility.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.eligibility.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.process.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.process.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.exceptions.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.exceptions.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.contact.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.contact.content')}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
