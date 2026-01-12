import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SubmissionsHistory } from '@/components/app/submissions-history'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SubmissionsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      submissions: {
        include: {
          week: true,
          files: true,
        },
        orderBy: { week: { weekNumber: 'asc' } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!enrollment) {
    redirect('/join')
  }

  return (
    <SubmissionsHistory
      submissions={enrollment.submissions.map((s) => ({
        id: s.id,
        weekNumber: s.week.weekNumber,
        weekTitle: s.week.title,
        status: s.status,
        textAnswer: s.textAnswer,
        submittedAt: s.submittedAt,
        files: s.files,
      }))}
    />
  )
}
