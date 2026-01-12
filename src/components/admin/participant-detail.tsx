'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { FadeIn } from '@/components/motion'
import { formatDate, formatFileSize, formatRelativeTime } from '@/lib/utils'
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
} from 'lucide-react'
import { Track, SubmissionStatus } from '@/types/enums'

interface SubmissionFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  size: number
}

interface Submission {
  id: string
  status: string
  textAnswer: string | null
  submittedAt: Date | null
  files: SubmissionFile[]
}

interface WeekData {
  weekNumber: number
  title: string
  submission: Submission | null
  checklistProgress: number
}

interface Note {
  id: string
  content: string
  weekNumber: number | null
  createdAt: Date
}

interface Props {
  cohortId: string
  cohortName: string
  participant: {
    enrollmentId: string
    name: string
    email: string
    track: string
    joinedAt: Date
  }
  weeks: WeekData[]
  notes: Note[]
}

const statusConfig: Record<SubmissionStatus, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted'; icon: typeof CheckCircle }> = {
  NOT_STARTED: { variant: 'muted', icon: Clock },
  IN_PROGRESS: { variant: 'warning', icon: Clock },
  SUBMITTED: { variant: 'default', icon: CheckCircle },
  COMPLETED: { variant: 'success', icon: CheckCircle },
  LATE: { variant: 'destructive', icon: AlertTriangle },
}

const trackColors: Record<Track, string> = {
  SELF: 'bg-blue-100 text-blue-800',
  GROUP: 'bg-green-100 text-green-800',
  PREMIUM: 'bg-purple-100 text-purple-800',
}

export function ParticipantDetail({ cohortId, cohortName, participant, weeks, notes }: Props) {
  const t = useTranslations('admin.participants')
  const locale = useLocale()
  const router = useRouter()
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setIsAddingNote(true)

    try {
      await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: participant.enrollmentId,
          content: newNote,
        }),
      })
      setNewNote('')
      router.refresh()
    } catch (error) {
      console.error('Failed to add note:', error)
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleMarkCompleted = async (weekNumber: number) => {
    const weekData = weeks.find((w) => w.weekNumber === weekNumber)
    if (!weekData?.submission) return

    try {
      await fetch(`/api/admin/submissions/${weekData.submission.id}/complete`, {
        method: 'POST',
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to mark completed:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4">
          <Link href={`/admin/cohorts/${cohortId}/participants`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('detail.title')}</h1>
            <p className="text-muted-foreground">{cohortName}</p>
          </div>
        </div>
      </FadeIn>

      {/* Participant Info */}
      <FadeIn delay={0.1}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold text-lg text-foreground">
                    {participant.name}
                  </span>
                  <Badge className={trackColors[participant.track as Track]}>
                    {participant.track}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{participant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {formatDate(participant.joinedAt, locale)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Week Submissions */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>{t('detail.submissions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeks.map((week) => {
              const status = (week.submission?.status || 'NOT_STARTED') as SubmissionStatus
              const { variant, icon: StatusIcon } = statusConfig[status]

              return (
                <div key={week.weekNumber} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Week {week.weekNumber}:</span>
                        <span className="text-muted-foreground">{week.title}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant={variant}>
                          <StatusIcon className="h-3 w-3 me-1" />
                          {status.replace('_', ' ')}
                        </Badge>
                        {week.submission?.submittedAt && (
                          <span className="text-sm text-muted-foreground">
                            Submitted: {formatDate(week.submission.submittedAt, locale)}
                          </span>
                        )}
                      </div>
                    </div>
                    {week.submission && status === 'SUBMITTED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkCompleted(week.weekNumber)}
                      >
                        {t('detail.markCompleted')}
                      </Button>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Checklist:</span>
                    <Progress value={week.checklistProgress} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground">{week.checklistProgress}%</span>
                  </div>

                  {/* Submission Content */}
                  {week.submission?.textAnswer && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-foreground">{week.submission.textAnswer}</p>
                    </div>
                  )}

                  {/* Files */}
                  {week.submission?.files && week.submission.files.length > 0 && (
                    <div className="space-y-2">
                      {week.submission.files.map((file) => (
                        <a
                          key={file.id}
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          {file.fileName}
                          <span className="text-muted-foreground">
                            ({formatFileSize(file.size)})
                          </span>
                          <Download className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Admin Notes */}
      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>{t('detail.notes')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Note */}
            <div className="space-y-2">
              <Textarea
                placeholder={t('detail.addNote')}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddNote} isLoading={isAddingNote} disabled={!newNote.trim()}>
                <Plus className="h-4 w-4 me-1" />
                {t('detail.addNote')}
              </Button>
            </div>

            {/* Notes List */}
            {notes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No notes yet</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-3">
                    <p className="text-foreground">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{formatRelativeTime(note.createdAt, locale)}</span>
                      {note.weekNumber && <span>• Week {note.weekNumber}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
