'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/motion'
import { formatDate, formatFileSize } from '@/lib/utils'
import { ArrowRight, FileText, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { SubmissionStatus } from '@/types/enums'

interface SubmissionFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  size: number
}

interface Submission {
  id: string
  weekNumber: number
  weekTitle: string
  status: SubmissionStatus
  textAnswer: string | null
  submittedAt: Date | null
  files: SubmissionFile[]
}

interface Props {
  submissions: Submission[]
}

const statusConfig: Record<SubmissionStatus, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted'; icon: typeof CheckCircle }> = {
  NOT_STARTED: { variant: 'muted', icon: Clock },
  IN_PROGRESS: { variant: 'warning', icon: Clock },
  SUBMITTED: { variant: 'default', icon: CheckCircle },
  COMPLETED: { variant: 'success', icon: CheckCircle },
  LATE: { variant: 'destructive', icon: AlertTriangle },
}

export function SubmissionsHistory({ submissions }: Props) {
  const t = useTranslations('submissions')
  const locale = useLocale()

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <h1 className="text-3xl font-bold text-foreground mb-8">{t('title')}</h1>
      </FadeIn>

      {submissions.length === 0 ? (
        <FadeIn delay={0.1}>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{t('empty')}</p>
              <Link href="/app">
                <Button>
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission, index) => {
            const { variant, icon: StatusIcon } = statusConfig[submission.status]
            return (
              <FadeIn key={submission.id} delay={index * 0.1}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {submission.weekNumber}
                            </span>
                          </div>
                          {submission.weekTitle}
                        </CardTitle>
                        {submission.submittedAt && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Submitted: {formatDate(submission.submittedAt, locale)}
                          </p>
                        )}
                      </div>
                      <Badge variant={variant}>
                        <StatusIcon className="h-3 w-3 me-1" />
                        {submission.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {submission.textAnswer && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Answer:</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {submission.textAnswer}
                        </p>
                      </div>
                    )}

                    {submission.files.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Files:</h4>
                        <div className="space-y-2">
                          {submission.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.fileName}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({formatFileSize(file.size)})
                                </span>
                              </div>
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Link href={`/app/week/${submission.weekNumber}`}>
                        <Button variant="outline" size="sm">
                          View Week
                          <ArrowRight className="h-4 w-4 ms-1 rtl:rotate-180" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      )}
    </div>
  )
}
