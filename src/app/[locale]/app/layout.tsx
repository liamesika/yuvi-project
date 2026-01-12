import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SessionProvider } from '@/components/providers/session-provider'
import { AppHeader } from '@/components/app/header'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get user's enrollment and cohort info
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      cohort: true,
      submissions: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate progress
  let progress = 0
  if (enrollment) {
    const completedWeeks = enrollment.submissions.filter(
      (s) => s.status === 'COMPLETED' || s.status === 'SUBMITTED'
    ).length
    progress = Math.round((completedWeeks / 4) * 100)
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-background">
        <AppHeader cohortName={enrollment?.cohort?.name} progress={progress} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </SessionProvider>
  )
}
