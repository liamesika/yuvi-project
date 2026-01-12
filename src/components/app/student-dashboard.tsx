'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { formatDate } from '@/lib/utils'
import { ArrowRight, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { SubmissionStatus } from '@/types/enums'

interface WeekData {
  weekNumber: number
  title: string
  deadline: Date | null
  status: SubmissionStatus
  checklistProgress: number
}

interface SubmissionData {
  weekNumber: number
  status: SubmissionStatus
  submittedAt: Date | null
}

interface Props {
  userName: string
  cohortName: string
  weeks: WeekData[]
  overallProgress: number
  recentSubmissions: SubmissionData[]
}

const statusConfig: Record<SubmissionStatus, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted'; icon: typeof CheckCircle }> = {
  NOT_STARTED: { variant: 'muted', icon: Clock },
  IN_PROGRESS: { variant: 'warning', icon: Clock },
  SUBMITTED: { variant: 'default', icon: CheckCircle },
  COMPLETED: { variant: 'success', icon: CheckCircle },
  LATE: { variant: 'destructive', icon: AlertCircle },
}

export function StudentDashboard({
  userName,
  cohortName,
  weeks,
  overallProgress,
  recentSubmissions,
}: Props) {
  const t = useTranslations('dashboard')
  const locale = useLocale()

  const nextAction = weeks.find((w) => w.status === 'NOT_STARTED' || w.status === 'IN_PROGRESS')

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('welcome', { name: userName.split(' ')[0] })}
            </h1>
            <p className="text-muted-foreground mt-1">{cohortName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-end">
              <p className="text-sm text-muted-foreground">{t('cohort.progress')}</p>
              <p className="text-2xl font-bold text-foreground">{overallProgress}%</p>
            </div>
            <div className="h-16 w-16">
              <svg viewBox="0 0 36 36" className="transform -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${overallProgress} 100`}
                  className="text-primary"
                />
              </svg>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Next Action Card */}
      {nextAction && (
        <FadeIn delay={0.1}>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-primary font-medium mb-1">{t('cohort.nextAction')}</p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('weeks.week', { number: nextAction.weekNumber })}: {nextAction.title}
                  </h3>
                  {nextAction.deadline && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t('weeks.deadline')}: {formatDate(nextAction.deadline, locale)}
                    </p>
                  )}
                </div>
                <Link href={`/app/week/${nextAction.weekNumber}`}>
                  <Button className="gap-2 group">
                    {nextAction.status === 'NOT_STARTED'
                      ? t('weeks.actions.start')
                      : t('weeks.actions.continue')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Weeks Grid */}
      <div>
        <FadeIn delay={0.2}>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('weeks.title')}</h2>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeks.map((week) => {
            const { variant, icon: Icon } = statusConfig[week.status]
            return (
              <StaggerItem key={week.weekNumber}>
                <Link href={`/app/week/${week.weekNumber}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">{week.weekNumber}</span>
                        </div>
                        <Badge variant={variant} className="text-xs">
                          <Icon className="h-3 w-3 me-1" />
                          {t(`weeks.status.${week.status.toLowerCase().replace('_', '')}`)}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-3">{week.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {week.deadline && (
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(week.deadline, locale)}
                        </p>
                      )}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground">{week.checklistProgress}%</span>
                        </div>
                        <Progress value={week.checklistProgress} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </div>

      {/* Recent Submissions */}
      <FadeIn delay={0.4}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('submissions.title')}</CardTitle>
              <Link href="/app/submissions">
                <Button variant="ghost" size="sm">
                  {t('submissions.viewAll')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">{t('submissions.empty')}</p>
            ) : (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => {
                  const { variant, icon: Icon } = statusConfig[submission.status]
                  return (
                    <div
                      key={submission.weekNumber}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">{submission.weekNumber}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {t('weeks.week', { number: submission.weekNumber })}
                          </p>
                          {submission.submittedAt && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(submission.submittedAt, locale)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={variant}>
                        <Icon className="h-3 w-3 me-1" />
                        {t(`weeks.status.${submission.status.toLowerCase().replace('_', '')}`)}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
