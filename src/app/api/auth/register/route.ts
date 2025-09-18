import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, setAuthCookie } from '@/lib/auth'
import { RegisterSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = RegisterSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { name, email, password } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este email' },
        { status: 409 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    // Set authentication cookie
    await setAuthCookie({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}