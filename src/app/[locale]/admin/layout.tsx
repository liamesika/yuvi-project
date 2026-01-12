import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
import { AppHeader } from '@/components/app/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/app')
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-background">
        <AppHeader isAdmin />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </SessionProvider>
  )
}
