import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { EventSchema } from '@/lib/validations'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validation = EventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: validation.data
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}