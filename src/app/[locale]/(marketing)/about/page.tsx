import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { Card, CardContent } from '@/components/ui/card'
import { Target, TrendingUp, BarChart3, Zap, CheckCircle } from 'lucide-react'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AboutContent />
}

function AboutContent() {
  const t = useTranslations('about')

  const pillars = [
    { num: '1', icon: BarChart3 },
    { num: '2', icon: Target },
    { num: '3', icon: TrendingUp },
    { num: '4', icon: Zap },
  ] as const

  const outcomes = ['1', '2', '3', '4', '5'] as const

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

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">{t('mission.title')}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('mission.description')}
                </p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <FadeIn delay={0.1}>
                <Card className="h-full border-destructive/20 bg-destructive/5">
                  <CardContent className="p-6 lg:p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {t('problem.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('problem.description')}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Card className="h-full border-success/20 bg-success/5">
                  <CardContent className="p-6 lg:p-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {t('solution.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('solution.description')}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('method.title')}</h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pillars.map(({ num, icon: Icon }) => (
              <StaggerItem key={num}>
                <Card className="h-full text-center">
                  <CardContent className="p-6 lg:p-8">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {t(`method.pillars.${num}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`method.pillars.${num}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('outcomes.title')}</h2>
          </FadeIn>

          <FadeIn delay={0.1} className="max-w-2xl mx-auto">
            <ul className="space-y-4">
              {outcomes.map((num) => (
                <li key={num} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-success shrink-0 mt-0.5" />
                  <span className="text-lg text-foreground">{t(`outcomes.items.${num}`)}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
