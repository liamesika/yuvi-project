import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const toggleSchema = z.object({
  enrollmentId: z.string(),
  checklistItemId: z.string(),
  isDone: z.boolean(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = toggleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { enrollmentId, checklistItemId, isDone } = parsed.data

    // Verify enrollment belongs to user
    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, userId: session.user.id },
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Upsert the progress
    const progress = await prisma.checklistProgress.upsert({
      where: {
        enrollmentId_checklistItemId: {
          enrollmentId,
          checklistItemId,
        },
      },
      update: { isDone },
      create: {
        enrollmentId,
        checklistItemId,
        isDone,
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Checklist toggle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
