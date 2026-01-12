'use client'

import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { LanguageToggle } from '@/components/language-toggle'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings } from 'lucide-react'

interface AppHeaderProps {
  cohortName?: string
  progress?: number
  isAdmin?: boolean
}

export function AppHeader({ cohortName, progress = 0, isAdmin = false }: AppHeaderProps) {
  const t = useTranslations('nav')
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Cohort Info */}
          <div className="flex items-center gap-4">
            <Link href={isAdmin ? '/admin' : '/app'} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
            </Link>

            {!isAdmin && cohortName && (
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{cohortName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={progress} className="h-1.5 w-24" />
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="hidden sm:flex items-center gap-1">
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    {t('dashboard')}
                  </Button>
                </Link>
                <Link href="/admin/cohorts">
                  <Button variant="ghost" size="sm">
                    {t('cohorts')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar
                    src={session?.user?.image}
                    name={session?.user?.name}
                    size="sm"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar src={session?.user?.image} name={session?.user?.name} size="md" />
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? '/admin/settings' : '/app/profile'} className="cursor-pointer">
                    <User className="h-4 w-4 me-2" />
                    {t('profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? '/admin/settings' : '/app/profile'} className="cursor-pointer">
                    <Settings className="h-4 w-4 me-2" />
                    {t('settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4 me-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
