import { redirect, notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { WeekContent } from '@/components/app/week-content'

interface Props {
  params: Promise<{ locale: string; weekNumber: string }>
}

export default async function WeekPage({ params }: Props) {
  const { locale, weekNumber } = await params
  setRequestLocale(locale)

  const weekNum = parseInt(weekNumber)
  if (isNaN(weekNum) || weekNum < 1 || weekNum > 4) {
    notFound()
  }

  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          weeks: {
            where: { weekNumber: weekNum },
            include: {
              checklist: { orderBy: { order: 'asc' } },
              assets: true,
            },
          },
        },
      },
      submissions: {
        where: {
          week: { weekNumber: weekNum },
        },
        include: {
          files: true,
        },
      },
      checklistProgress: {
        where: {
          checklistItem: {
            week: { weekNumber: weekNum },
          },
        },
      },
    },
  })

  if (!enrollment) {
    redirect('/join')
  }

  const week = enrollment.cohort.weeks[0]
  if (!week) {
    notFound()
  }

  const submission = enrollment.submissions[0]

  type ChecklistItem = { id: string; title: string; order: number; isRequired: boolean }
  type ChecklistProgress = { checklistItemId: string; isDone: boolean }

  const checklistWithProgress = week.checklist.map((item: ChecklistItem) => ({
    ...item,
    isDone: enrollment.checklistProgress.some(
      (cp: ChecklistProgress) => cp.checklistItemId === item.id && cp.isDone
    ),
  }))

  return (
    <WeekContent
      enrollmentId={enrollment.id}
      week={{
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        description: week.description,
        videoUrl: week.videoUrl,
        deadline: week.deadline,
      }}
      checklist={checklistWithProgress}
      assets={week.assets}
      submission={
        submission
          ? {
              id: submission.id,
              status: submission.status,
              textAnswer: submission.textAnswer,
              submittedAt: submission.submittedAt,
              files: submission.files,
            }
          : null
      }
    />
  )
}
