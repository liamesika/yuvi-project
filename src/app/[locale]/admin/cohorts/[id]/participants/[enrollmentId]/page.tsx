import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { ParticipantDetail } from '@/components/admin/participant-detail'

interface Props {
  params: Promise<{ locale: string; id: string; enrollmentId: string }>
}

export default async function ParticipantDetailPage({ params }: Props) {
  const { locale, id: cohortId, enrollmentId } = await params
  setRequestLocale(locale)

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { name: true, email: true } },
      cohort: {
        include: {
          weeks: {
            orderBy: { weekNumber: 'asc' },
            include: { checklist: true },
          },
        },
      },
      submissions: {
        include: {
          week: true,
          files: true,
        },
      },
      checklistProgress: true,
      adminNotes: {
        orderBy: { createdAt: 'desc' },
        include: { week: true },
      },
    },
  })

  if (!enrollment || enrollment.cohortId !== cohortId) {
    notFound()
  }

  const weeksData = enrollment.cohort.weeks.map((week: { id: string; weekNumber: number; title: string; checklist: { id: string }[] }) => {
    const submission = enrollment.submissions.find((s: { weekId: string }) => s.weekId === week.id)
    const checklistItems = week.checklist.length
    const completedItems = enrollment.checklistProgress.filter(
      (cp: { checklistItemId: string; isDone: boolean }) => week.checklist.some((ci: { id: string }) => ci.id === cp.checklistItemId) && cp.isDone
    ).length

    return {
      weekNumber: week.weekNumber,
      title: week.title,
      submission: submission
        ? {
            id: submission.id,
            status: submission.status,
            textAnswer: submission.textAnswer,
            submittedAt: submission.submittedAt,
            files: submission.files,
          }
        : null,
      checklistProgress: checklistItems > 0 ? Math.round((completedItems / checklistItems) * 100) : 0,
    }
  })

  return (
    <ParticipantDetail
      cohortId={cohortId}
      cohortName={enrollment.cohort.name}
      participant={{
        enrollmentId: enrollment.id,
        name: enrollment.user.name || 'Unknown',
        email: enrollment.user.email,
        track: enrollment.track,
        joinedAt: enrollment.createdAt,
      }}
      weeks={weeksData}
      notes={enrollment.adminNotes.map((note) => ({
        id: note.id,
        content: note.content,
        weekNumber: note.week?.weekNumber || null,
        createdAt: note.createdAt,
      }))}
    />
  )
}
