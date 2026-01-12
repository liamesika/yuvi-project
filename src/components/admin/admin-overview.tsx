'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion'
import { formatRelativeTime } from '@/lib/utils'
import { Users, BookOpen, FileCheck, Clock, ArrowRight } from 'lucide-react'
import { Track, SubmissionStatus } from '@/types/enums'

interface Stats {
  totalCohorts: number
  activeCohorts: number
  totalParticipants: number
  pendingSubmissions: number
}

interface RecentEnrollment {
  id: string
  userName: string
  userEmail: string
  cohortName: string
  track: string
  createdAt: Date
}

interface RecentSubmission {
  id: string
  userName: string
  weekNumber: number
  status: string
  submittedAt: Date
}

interface Props {
  stats: Stats
  recentEnrollments: RecentEnrollment[]
  recentSubmissions: RecentSubmission[]
}

const trackColors: Record<Track, string> = {
  SELF: 'bg-blue-100 text-blue-800',
  GROUP: 'bg-green-100 text-green-800',
  PREMIUM: 'bg-purple-100 text-purple-800',
}

export function AdminOverview({ stats, recentEnrollments, recentSubmissions }: Props) {
  const t = useTranslations('admin')
  const locale = useLocale()

  const statCards = [
    { key: 'totalCohorts', value: stats.totalCohorts, icon: BookOpen },
    { key: 'activeCohorts', value: stats.activeCohorts, icon: BookOpen },
    { key: 'totalParticipants', value: stats.totalParticipants, icon: Users },
    { key: 'pendingSubmissions', value: stats.pendingSubmissions, icon: FileCheck },
  ]

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">{t('overview.title')}</h1>
          <Link href="/admin/cohorts">
            <Button className="gap-2">
              {t('cohorts.create')}
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, value, icon: Icon }) => (
          <StaggerItem key={key}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t(`overview.stats.${key}`)}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Enrollments
                </CardTitle>
                <Link href="/admin/cohorts">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ms-1 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No enrollments yet</p>
              ) : (
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">{enrollment.userName}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.cohortName}</p>
                      </div>
                      <div className="text-end">
                        <Badge className={trackColors[enrollment.track as Track]}>
                          {t(`participants.tracks.${enrollment.track.toLowerCase()}`)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(enrollment.createdAt, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Recent Submissions */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Recent Submissions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No submissions yet</p>
              ) : (
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">{submission.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          Week {submission.weekNumber}
                        </p>
                      </div>
                      <div className="text-end">
                        <Badge
                          variant={
                            submission.status === 'SUBMITTED'
                              ? 'default'
                              : submission.status === 'COMPLETED'
                                ? 'success'
                                : 'warning'
                          }
                        >
                          {submission.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(submission.submittedAt, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
