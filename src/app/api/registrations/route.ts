import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { RegistrationSchema } from '@/lib/validations'
import { generateQRCode, generatePaymentText } from '@/lib/qrcode'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = RegistrationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { eventId } = validation.data

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    // Check if user is already registered for this event
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId: user.userId,
        eventId: eventId
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Usuário já está inscrito neste evento' },
        { status: 409 }
      )
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        userId: user.userId,
        eventId: eventId,
        qrCode: '', // Will be updated after creation
      }
    })

    // Generate QR Code
    const paymentText = generatePaymentText(registration.id, event.title)
    const qrCode = await generateQRCode(paymentText)

    // Update registration with QR code
    const updatedRegistration = await prisma.registration.update({
      where: { id: registration.id },
      data: { qrCode },
      include: {
        event: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(updatedRegistration, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar inscrição:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: user.userId },
      include: {
        event: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}