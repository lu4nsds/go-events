import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const EventSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  imageUrl: z.string().url('URL da imagem inválida'),
  date: z.string().datetime('Data inválida'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
})

export const UpdateEventSchema = EventSchema.partial()

export const RegistrationSchema = z.object({
  eventId: z.string().uuid('ID do evento inválido'),
})

export const PaymentSimulationSchema = z.object({
  registrationId: z.string().uuid('ID da inscrição inválido'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type EventInput = z.infer<typeof EventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type RegistrationInput = z.infer<typeof RegistrationSchema>
export type PaymentSimulationInput = z.infer<typeof PaymentSimulationSchema>