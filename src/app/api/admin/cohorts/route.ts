import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createCohortSchema = z.object({
  name: z.string().min(1),
  startDate: z.string(),
  enrollmentCode: z.string().optional(),
  isActive: z.boolean().default(true),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createCohortSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { name, startDate, enrollmentCode, isActive } = parsed.data

    // Create cohort with 4 weeks
    const cohort = await prisma.cohort.create({
      data: {
        name,
        startDate: new Date(startDate),
        enrollmentCode: enrollmentCode || null,
        isActive,
        weeks: {
          create: [
            {
              weekNumber: 1,
              title: 'Week 1: Mapping the Situation',
              description: '<p>Week 1 content goes here...</p>',
              deadline: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000),
            },
            {
              weekNumber: 2,
              title: 'Week 2: Building the System',
              description: '<p>Week 2 content goes here...</p>',
              deadline: new Date(new Date(startDate).getTime() + 14 * 24 * 60 * 60 * 1000),
            },
            {
              weekNumber: 3,
              title: 'Week 3: Analysis & Understanding',
              description: '<p>Week 3 content goes here...</p>',
              deadline: new Date(new Date(startDate).getTime() + 21 * 24 * 60 * 60 * 1000),
            },
            {
              weekNumber: 4,
              title: 'Week 4: Action & Planning',
              description: '<p>Week 4 content goes here...</p>',
              deadline: new Date(new Date(startDate).getTime() + 28 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
      include: { weeks: true },
    })

    return NextResponse.json(cohort, { status: 201 })
  } catch (error) {
    console.error('Create cohort error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cohorts = await prisma.cohort.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { enrollments: true } },
      },
    })

    return NextResponse.json(cohorts)
  } catch (error) {
    console.error('Get cohorts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
