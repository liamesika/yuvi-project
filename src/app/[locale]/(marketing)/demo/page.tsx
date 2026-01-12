'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { Play, X, ArrowRight, Monitor, Smartphone, LayoutDashboard } from 'lucide-react'

export default function DemoPage() {
  const t = useTranslations('demo')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const screenshots = [
    { num: '1', icon: LayoutDashboard },
    { num: '2', icon: Monitor },
    { num: '3', icon: Smartphone },
  ] as const

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

      {/* Video Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('video.title')}</h2>
              <p className="text-muted-foreground">{t('video.description')}</p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center relative group cursor-pointer">
                  {/* Placeholder for video - in production, embed actual video */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                      <Play className="h-8 w-8 text-primary-foreground ms-1" />
                    </div>
                    <span className="text-foreground font-medium">Click to Play Demo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('screenshots.title')}</h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {screenshots.map(({ num, icon: Icon }) => (
              <StaggerItem key={num}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer group hover:border-primary/50 transition-all hover:shadow-lg">
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] bg-muted flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                          <Icon className="h-16 w-16 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-foreground font-medium transition-opacity">
                              Click to View
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-1">
                            {t(`screenshots.items.${num}.title`)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(`screenshots.items.${num}.description`)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="h-24 w-24 text-muted-foreground/30" />
                    </div>
                  </DialogContent>
                </Dialog>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
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
