import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { UpdateEventSchema } from '@/lib/validations'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Erro ao buscar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = await getAuthUser()
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validation = UpdateEventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    const event = await prisma.event.update({
      where: { id },
      data: validation.data
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = await getAuthUser()
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { id } = await params
    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Evento excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}