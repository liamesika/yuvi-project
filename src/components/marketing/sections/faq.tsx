'use client'

import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQSection() {
  const t = useTranslations('home.faq')

  const questions = ['1', '2', '3', '4', '5'] as const

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('title')}</h2>
        </FadeIn>

        <FadeIn delay={0.1} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {questions.map((num) => (
              <AccordionItem
                key={num}
                value={num}
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-start hover:no-underline">
                  {t(`questions.${num}.question`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t(`questions.${num}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}
