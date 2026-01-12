import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { uploadToS3 } from '@/lib/s3'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const enrollmentId = formData.get('enrollmentId') as string
    const weekId = formData.get('weekId') as string
    const textAnswer = formData.get('textAnswer') as string
    const files = formData.getAll('files') as File[]

    if (!enrollmentId || !weekId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, userId: session.user.id },
      include: {
        cohort: {
          include: {
            weeks: {
              where: { id: weekId },
            },
          },
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    const week = enrollment.cohort.weeks[0]
    if (!week) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 })
    }

    // Determine status
    let status: 'IN_PROGRESS' | 'SUBMITTED' | 'LATE' = 'SUBMITTED'
    if (week.deadline && new Date() > week.deadline) {
      status = 'LATE'
    }

    // Upload files to S3
    const uploadedFiles: { fileUrl: string; fileName: string; fileType: string; size: number }[] =
      []

    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileUrl = await uploadToS3(buffer, file.name, file.type)
        uploadedFiles.push({
          fileUrl,
          fileName: file.name,
          fileType: file.type,
          size: file.size,
        })
      }
    }

    // Upsert submission
    const submission = await prisma.submission.upsert({
      where: {
        enrollmentId_weekId: {
          enrollmentId,
          weekId,
        },
      },
      update: {
        textAnswer,
        status,
        submittedAt: new Date(),
        files: {
          create: uploadedFiles,
        },
      },
      create: {
        enrollmentId,
        weekId,
        textAnswer,
        status,
        submittedAt: new Date(),
        files: {
          create: uploadedFiles,
        },
      },
      include: {
        files: true,
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
