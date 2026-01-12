import { setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { CohortsManagement } from '@/components/admin/cohorts-management'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CohortsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const cohorts = await prisma.cohort.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
  })

  type CohortData = {
    id: string
    name: string
    startDate: Date
    isActive: boolean
    enrollmentCode: string | null
    _count: { enrollments: number }
  }

  return (
    <CohortsManagement
      cohorts={cohorts.map((c: CohortData) => ({
        id: c.id,
        name: c.name,
        startDate: c.startDate,
        isActive: c.isActive,
        enrollmentCode: c.enrollmentCode,
        participantCount: c._count.enrollments,
      }))}
    />
  )
}
