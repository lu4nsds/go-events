import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Senha deve conter pelo menos 1 número e 1 caractere especial"
    ),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .max(255, "Senha muito longa"),
});

export const EventSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(2000, "Descrição deve ter no máximo 2000 caracteres"),
  imageUrl: z
    .string()
    .url("URL da imagem inválida")
    .max(500, "URL da imagem muito longa"),
  date: z
    .string()
    .datetime("Data inválida")
    .refine((date) => new Date(date) > new Date(), "Data deve ser no futuro"),
  price: z
    .number()
    .min(0, "Preço deve ser maior ou igual a 0")
    .max(10000, "Preço deve ser menor que R$ 10.000"),
  distance: z
    .string()
    .min(1, "Distância é obrigatória")
    .max(10, "Distância deve ter no máximo 10 caracteres")
    .regex(
      /^\d+(\.\d+)?(km|K|k)$/,
      "Formato inválido. Use: 5km, 10km, 21km, etc."
    ),
});

export const UpdateEventSchema = EventSchema.partial();

export const RegistrationSchema = z.object({
  eventId: z.string().uuid("ID do evento inválido"),
});

export const PaymentSimulationSchema = z.object({
  registrationId: z.string().uuid("ID da inscrição inválido"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type EventInput = z.infer<typeof EventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type RegistrationInput = z.infer<typeof RegistrationSchema>;
export type PaymentSimulationInput = z.infer<typeof PaymentSimulationSchema>;
