'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/motion'

export default function TermsPage() {
  const t = useTranslations('legal.terms')

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">{t('title')}</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">{t('lastUpdated')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.acceptance.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.acceptance.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.services.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.services.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.accounts.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.accounts.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.payment.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.payment.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.intellectual.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.intellectual.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.termination.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.termination.content')}</p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">{t('sections.contact.title')}</h2>
            <p className="text-muted-foreground mb-4">{t('sections.contact.content')}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
