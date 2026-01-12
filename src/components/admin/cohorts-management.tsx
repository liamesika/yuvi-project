'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FadeIn } from '@/components/motion'
import { formatDate } from '@/lib/utils'
import { Plus, Users, Calendar, Settings, Eye } from 'lucide-react'

interface Cohort {
  id: string
  name: string
  startDate: Date
  isActive: boolean
  enrollmentCode: string | null
  participantCount: number
}

interface Props {
  cohorts: Cohort[]
}

export function CohortsManagement({ cohorts }: Props) {
  const t = useTranslations('admin.cohorts')
  const locale = useLocale()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    enrollmentCode: '',
    isActive: true,
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to create cohort:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('create')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('create')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('form.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('form.startDate')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentCode">{t('form.enrollmentCode')}</Label>
                  <Input
                    id="enrollmentCode"
                    value={formData.enrollmentCode}
                    onChange={(e) => setFormData({ ...formData, enrollmentCode: e.target.value })}
                    placeholder="e.g., COHORT2024"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked as boolean })
                    }
                  />
                  <Label htmlFor="isActive">{t('form.isActive')}</Label>
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  {t('create')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid gap-4">
          {cohorts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No cohorts yet. Create your first cohort.</p>
              </CardContent>
            </Card>
          ) : (
            cohorts.map((cohort) => (
              <Card key={cohort.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-foreground">{cohort.name}</h3>
                        <Badge variant={cohort.isActive ? 'success' : 'secondary'}>
                          {cohort.isActive ? t('status.active') : t('status.inactive')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(cohort.startDate, locale)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {cohort.participantCount} {t('table.participants')}
                        </span>
                        {cohort.enrollmentCode && (
                          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                            {cohort.enrollmentCode}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/cohorts/${cohort.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/cohorts/${cohort.id}/weeks`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Settings className="h-4 w-4" />
                          Weeks
                        </Button>
                      </Link>
                      <Link href={`/admin/cohorts/${cohort.id}/participants`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Users className="h-4 w-4" />
                          Participants
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </FadeIn>
    </div>
  )
}
