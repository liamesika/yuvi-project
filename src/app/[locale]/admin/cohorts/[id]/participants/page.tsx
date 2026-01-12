import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { ParticipantsManagement } from '@/components/admin/participants-management'

interface Props {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<{ week?: string; status?: string; track?: string; search?: string }>
}

export default async function ParticipantsPage({ params, searchParams }: Props) {
  const { locale, id } = await params
  const filters = await searchParams
  setRequestLocale(locale)

  const cohort = await prisma.cohort.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          submissions: {
            include: { week: true },
          },
          checklistProgress: true,
        },
        where: {
          ...(filters.track && { track: filters.track as any }),
          ...(filters.search && {
            OR: [
              { user: { name: { contains: filters.search, mode: 'insensitive' as const } } },
              { user: { email: { contains: filters.search, mode: 'insensitive' as const } } },
            ],
          }),
        },
      },
    },
  })

  if (!cohort) {
    notFound()
  }

  type EnrollmentData = {
    id: string
    track: string
    createdAt: Date
    user: { id: string; name: string | null; email: string }
    submissions: Array<{ status: string; submittedAt: Date | null; week: { weekNumber: number } }>
    checklistProgress: Array<{ id: string }>
  }

  const participants = cohort.enrollments.map((enrollment: EnrollmentData) => {
    const weekStatuses = [1, 2, 3, 4].map((weekNum) => {
      const submission = enrollment.submissions.find((s: { week: { weekNumber: number } }) => s.week.weekNumber === weekNum)
      return submission?.status || 'NOT_STARTED'
    })

    const lastSubmission = enrollment.submissions
      .filter((s: { submittedAt: Date | null }) => s.submittedAt)
      .sort((a: { submittedAt: Date | null }, b: { submittedAt: Date | null }) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime())[0]

    return {
      enrollmentId: enrollment.id,
      userId: enrollment.user.id,
      name: enrollment.user.name || 'Unknown',
      email: enrollment.user.email,
      track: enrollment.track,
      weekStatuses,
      lastActivity: lastSubmission?.submittedAt || enrollment.createdAt,
    }
  })

  return (
    <ParticipantsManagement
      cohortId={id}
      cohortName={cohort.name}
      participants={participants}
      filters={filters}
    />
  )
}
