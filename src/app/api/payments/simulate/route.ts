import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { PaymentSimulationSchema } from '@/lib/validations'
import { sendConfirmationEmail } from '@/lib/email'

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
    const validation = PaymentSimulationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { registrationId } = validation.data

    // Find registration
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        user: true
      }
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada' },
        { status: 404 }
      )
    }

    // Check if user owns this registration
    if (registration.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Check if already paid
    if (registration.status === 'paid') {
      return NextResponse.json(
        { error: 'Pagamento já foi processado' },
        { status: 409 }
      )
    }

    // Update registration status to paid
    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: { status: 'paid' },
      include: {
        event: true,
        user: true
      }
    })

    // Send confirmation email
    await sendConfirmationEmail(
      updatedRegistration.user.email,
      updatedRegistration.event.title,
      updatedRegistration.qrCode
    )

    return NextResponse.json({
      message: 'Pagamento processado com sucesso',
      registration: updatedRegistration
    })
  } catch (error) {
    console.error('Erro ao simular pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}