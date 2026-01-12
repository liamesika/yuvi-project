import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const joinSchema = z.object({
  code: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = joinSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { code } = parsed.data

    // Find cohort by enrollment code
    const cohort = await prisma.cohort.findFirst({
      where: { enrollmentCode: code, isActive: true },
      include: { _count: { select: { enrollments: true } } },
    })

    if (!cohort) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 })
    }

    // Check if cohort is full
    if (cohort.capacity && cohort._count.enrollments >= cohort.capacity) {
      return NextResponse.json({ error: 'Cohort is full' }, { status: 400 })
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId: session.user.id, cohortId: cohort.id },
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 })
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        cohortId: cohort.id,
        track: 'SELF', // Default track, can be changed later
      },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Join error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
