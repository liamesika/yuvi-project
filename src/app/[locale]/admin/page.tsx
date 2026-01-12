import { setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { AdminOverview } from '@/components/admin/admin-overview'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [totalCohorts, activeCohorts, totalParticipants, pendingSubmissions] = await Promise.all([
    prisma.cohort.count(),
    prisma.cohort.count({ where: { isActive: true } }),
    prisma.enrollment.count(),
    prisma.submission.count({ where: { status: 'SUBMITTED' } }),
  ])

  const recentEnrollments = await prisma.enrollment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      cohort: { select: { name: true } },
    },
  })

  const recentSubmissions = await prisma.submission.findMany({
    take: 5,
    orderBy: { submittedAt: 'desc' },
    where: { submittedAt: { not: null } },
    include: {
      enrollment: {
        include: {
          user: { select: { name: true } },
        },
      },
      week: { select: { weekNumber: true } },
    },
  })

  type EnrollmentItem = {
    id: string
    track: string
    createdAt: Date
    user: { name: string | null; email: string }
    cohort: { name: string }
  }

  type SubmissionItem = {
    id: string
    status: string
    submittedAt: Date | null
    enrollment: { user: { name: string | null } }
    week: { weekNumber: number }
  }

  return (
    <AdminOverview
      stats={{
        totalCohorts,
        activeCohorts,
        totalParticipants,
        pendingSubmissions,
      }}
      recentEnrollments={recentEnrollments.map((e: EnrollmentItem) => ({
        id: e.id,
        userName: e.user.name || 'Unknown',
        userEmail: e.user.email,
        cohortName: e.cohort.name,
        track: e.track,
        createdAt: e.createdAt,
      }))}
      recentSubmissions={recentSubmissions.map((s: SubmissionItem) => ({
        id: s.id,
        userName: s.enrollment.user.name || 'Unknown',
        weekNumber: s.week.weekNumber,
        status: s.status,
        submittedAt: s.submittedAt!,
      }))}
    />
  )
}
