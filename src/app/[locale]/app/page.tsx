import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { StudentDashboard } from '@/components/app/student-dashboard'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AppPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  // Get enrollment with all related data
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          weeks: {
            orderBy: { weekNumber: 'asc' },
            include: {
              checklist: { orderBy: { order: 'asc' } },
            },
          },
        },
      },
      submissions: {
        include: {
          week: true,
        },
      },
      checklistProgress: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!enrollment) {
    redirect('/join')
  }

  // Types for Prisma query results
  type WeekData = {
    id: string
    weekNumber: number
    title: string
    deadline: Date | null
    checklist: Array<{ id: string }>
  }
  type SubmissionData = {
    weekId: string
    status: string
    submittedAt: Date | null
    week: { weekNumber: number }
  }
  type ChecklistProgressData = {
    checklistItemId: string
    isDone: boolean
  }

  // Transform data for the dashboard
  const weekData = enrollment.cohort.weeks.map((week: WeekData) => {
    const submission = enrollment.submissions.find((s: SubmissionData) => s.weekId === week.id)
    const checklistItems = week.checklist.length
    const completedItems = enrollment.checklistProgress.filter(
      (cp: ChecklistProgressData) => week.checklist.some((ci: { id: string }) => ci.id === cp.checklistItemId) && cp.isDone
    ).length

    return {
      weekNumber: week.weekNumber,
      title: week.title,
      deadline: week.deadline,
      status: submission?.status || 'NOT_STARTED',
      checklistProgress: checklistItems > 0 ? Math.round((completedItems / checklistItems) * 100) : 0,
    }
  })

  const totalProgress = weekData.reduce((acc: number, w: { status: string; checklistProgress: number }) => {
    if (w.status === 'COMPLETED') return acc + 25
    if (w.status === 'SUBMITTED') return acc + 20
    if (w.status === 'IN_PROGRESS') return acc + w.checklistProgress * 0.25
    return acc
  }, 0)

  return (
    <StudentDashboard
      userName={session.user.name || 'Student'}
      cohortName={enrollment.cohort.name}
      weeks={weekData}
      overallProgress={Math.round(totalProgress)}
      recentSubmissions={enrollment.submissions.slice(0, 3).map((s: SubmissionData) => ({
        weekNumber: s.week.weekNumber,
        status: s.status,
        submittedAt: s.submittedAt,
      }))}
    />
  )
}
