'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FadeIn } from '@/components/motion'
import { formatDate, formatFileSize, isDeadlinePassed } from '@/lib/utils'
import {
  ArrowLeft,
  Calendar,
  Download,
  Upload,
  Play,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react'
import { SubmissionStatus, AssetType } from '@prisma/client'

interface ChecklistItem {
  id: string
  title: string
  isRequired: boolean
  isDone: boolean
}

interface Asset {
  id: string
  title: string
  fileUrl: string
  type: AssetType
}

interface SubmissionFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  size: number
}

interface Submission {
  id: string
  status: SubmissionStatus
  textAnswer: string | null
  submittedAt: Date | null
  files: SubmissionFile[]
}

interface Props {
  enrollmentId: string
  week: {
    id: string
    weekNumber: number
    title: string
    description: string
    videoUrl: string | null
    deadline: Date | null
  }
  checklist: ChecklistItem[]
  assets: Asset[]
  submission: Submission | null
}

const statusConfig: Record<SubmissionStatus, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted'; icon: typeof CheckCircle }> = {
  NOT_STARTED: { variant: 'muted', icon: Clock },
  IN_PROGRESS: { variant: 'warning', icon: Clock },
  SUBMITTED: { variant: 'default', icon: CheckCircle },
  COMPLETED: { variant: 'success', icon: CheckCircle },
  LATE: { variant: 'destructive', icon: AlertTriangle },
}

export function WeekContent({ enrollmentId, week, checklist, assets, submission }: Props) {
  const t = useTranslations('week')
  const locale = useLocale()

  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    checklist.reduce((acc, item) => ({ ...acc, [item.id]: item.isDone }), {})
  )
  const [textAnswer, setTextAnswer] = useState(submission?.textAnswer || '')
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLate = isDeadlinePassed(week.deadline)
  const currentStatus = submission?.status || 'NOT_STARTED'
  const { variant, icon: StatusIcon } = statusConfig[currentStatus]

  const handleChecklistChange = async (itemId: string, checked: boolean) => {
    setChecklistState((prev) => ({ ...prev, [itemId]: checked }))

    try {
      await fetch('/api/checklist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, checklistItemId: itemId, isDone: checked }),
      })
    } catch (error) {
      console.error('Failed to update checklist:', error)
      setChecklistState((prev) => ({ ...prev, [itemId]: !checked }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('enrollmentId', enrollmentId)
      formData.append('weekId', week.id)
      formData.append('textAnswer', textAnswer)
      files.forEach((file) => formData.append('files', file))

      await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      })

      window.location.reload()
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedItems = Object.values(checklistState).filter(Boolean).length
  const totalItems = checklist.length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/app">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t('title', { number: week.weekNumber })}
              </h1>
              <Badge variant={variant}>
                <StatusIcon className="h-3 w-3 me-1" />
                {t(`submission.status`)}: {currentStatus.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mt-1">{week.title}</p>
          </div>
        </div>

        {/* Deadline Warning */}
        {week.deadline && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg mb-6 ${
              isLate ? 'bg-destructive/10 text-destructive' : 'bg-muted'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {t('submission.deadline')}: {formatDate(week.deadline, locale)}
            </span>
            {isLate && (
              <>
                <AlertTriangle className="h-4 w-4 ms-2" />
                <span className="text-sm font-medium">{t('submission.lateWarning')}</span>
              </>
            )}
          </div>
        )}
      </FadeIn>

      {/* Content Section */}
      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>{t('content.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: week.description }}
            />
          </CardContent>
        </Card>
      </FadeIn>

      {/* Video Section */}
      {week.videoUrl && (
        <FadeIn delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                {t('video.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <iframe
                  src={week.videoUrl}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Checklist Section */}
      {checklist.length > 0 && (
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('checklist.title')}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {t('checklist.progress', { completed: completedItems, total: totalItems })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Checkbox
                    id={item.id}
                    checked={checklistState[item.id]}
                    onCheckedChange={(checked) =>
                      handleChecklistChange(item.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={item.id}
                    className={`text-sm cursor-pointer flex-1 ${
                      checklistState[item.id] ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {item.title}
                    {item.isRequired && (
                      <Badge variant="outline" className="ms-2 text-xs">
                        {t('checklist.required')}
                      </Badge>
                    )}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Assets Section */}
      {assets.length > 0 && (
        <FadeIn delay={0.25}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('assets.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assets.map((asset) => (
                  <a
                    key={asset.id}
                    href={asset.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{asset.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {asset.type}
                      </Badge>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Submission Section */}
      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>{t('submission.title')}</CardTitle>
            {submission?.submittedAt && (
              <CardDescription>
                {t('submission.submitted', {
                  date: formatDate(submission.submittedAt, locale),
                })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Answer */}
            <div className="space-y-2">
              <Label htmlFor="textAnswer">{t('submission.textAnswer.label')}</Label>
              <Textarea
                id="textAnswer"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder={t('submission.textAnswer.placeholder')}
                rows={6}
                disabled={currentStatus === 'COMPLETED'}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>{t('submission.files.title')}</Label>

              {/* Existing Files */}
              {submission?.files && submission.files.length > 0 && (
                <div className="space-y-2 mb-4">
                  {submission.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 rounded border bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.fileName}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* New Files */}
              {files.length > 0 && (
                <div className="space-y-2 mb-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {currentStatus !== 'COMPLETED' && (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('submission.files.dragDrop')}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {t('submission.files.maxSize')}
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>{t('submission.files.upload')}</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {currentStatus !== 'COMPLETED' && (
              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
                disabled={!textAnswer.trim()}
              >
                {submission ? t('submission.update') : t('submission.submit')}
              </Button>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
