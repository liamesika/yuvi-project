import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const submission = await prisma.submission.update({
      where: { id },
      data: { status: 'COMPLETED' },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Complete submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
