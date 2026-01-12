'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FadeIn } from '@/components/motion'
import { formatRelativeTime } from '@/lib/utils'
import { ArrowLeft, Search, Eye } from 'lucide-react'
import { Track, SubmissionStatus } from '@prisma/client'
import { useState } from 'react'

interface Participant {
  enrollmentId: string
  userId: string
  name: string
  email: string
  track: Track
  weekStatuses: string[]
  lastActivity: Date
}

interface Props {
  cohortId: string
  cohortName: string
  participants: Participant[]
  filters: {
    week?: string
    status?: string
    track?: string
    search?: string
  }
}

const statusColors: Record<string, string> = {
  NOT_STARTED: 'bg-gray-200 text-gray-800',
  IN_PROGRESS: 'bg-yellow-200 text-yellow-800',
  SUBMITTED: 'bg-blue-200 text-blue-800',
  COMPLETED: 'bg-green-200 text-green-800',
  LATE: 'bg-red-200 text-red-800',
}

const trackColors: Record<Track, string> = {
  SELF: 'bg-blue-100 text-blue-800',
  GROUP: 'bg-green-100 text-green-800',
  PREMIUM: 'bg-purple-100 text-purple-800',
}

export function ParticipantsManagement({ cohortId, cohortName, participants, filters }: Props) {
  const t = useTranslations('admin.participants')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const [search, setSearch] = useState(filters.search || '')

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (filters.week) params.set('week', filters.week)
    if (filters.status) params.set('status', filters.status)
    if (filters.track) params.set('track', filters.track)
    if (filters.search) params.set('search', filters.search)

    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters('search', search)
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-4">
          <Link href="/admin/cohorts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground">{cohortName}</p>
          </div>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('filters.search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ps-10"
                  />
                </div>
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              </form>

              <Select
                value={filters.track || 'all'}
                onValueChange={(value) => updateFilters('track', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t('filters.track')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tracks</SelectItem>
                  <SelectItem value="SELF">{t('tracks.self')}</SelectItem>
                  <SelectItem value="GROUP">{t('tracks.group')}</SelectItem>
                  <SelectItem value="PREMIUM">{t('tracks.premium')}</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => updateFilters('status', value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t('filters.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="LATE">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Participants Table */}
      <FadeIn delay={0.2}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-start p-4 font-medium">{t('table.name')}</th>
                    <th className="text-start p-4 font-medium">{t('table.email')}</th>
                    <th className="text-center p-4 font-medium">{t('table.track')}</th>
                    <th className="text-center p-4 font-medium">{t('table.week1')}</th>
                    <th className="text-center p-4 font-medium">{t('table.week2')}</th>
                    <th className="text-center p-4 font-medium">{t('table.week3')}</th>
                    <th className="text-center p-4 font-medium">{t('table.week4')}</th>
                    <th className="text-start p-4 font-medium">{t('table.lastActivity')}</th>
                    <th className="text-center p-4 font-medium">{t('table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground">
                        No participants found
                      </td>
                    </tr>
                  ) : (
                    participants.map((participant) => (
                      <tr key={participant.enrollmentId} className="border-t">
                        <td className="p-4 font-medium">{participant.name}</td>
                        <td className="p-4 text-muted-foreground">{participant.email}</td>
                        <td className="p-4 text-center">
                          <Badge className={trackColors[participant.track]}>
                            {t(`tracks.${participant.track.toLowerCase()}`)}
                          </Badge>
                        </td>
                        {participant.weekStatuses.map((status, index) => (
                          <td key={index} className="p-4 text-center">
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${statusColors[status]}`}
                              title={status}
                            >
                              {status === 'COMPLETED' ? '✓' : status === 'LATE' ? '!' : index + 1}
                            </span>
                          </td>
                        ))}
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatRelativeTime(participant.lastActivity, locale)}
                        </td>
                        <td className="p-4 text-center">
                          <Link
                            href={`/admin/cohorts/${cohortId}/participants/${participant.enrollmentId}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
