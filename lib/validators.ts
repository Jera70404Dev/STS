import { z } from 'zod'

export const vehicleEnum = z.enum(['sedan', 'suv', 'van', 'bus'])

export const createBookingSchema = z.object({
  customerName: z.string().trim().min(2, 'El nombre es obligatorio').max(120),
  customerEmail: z.string().trim().email('Correo inválido'),
  customerPhone: z
    .string()
    .trim()
    .min(7, 'Teléfono inválido')
    .max(30),
  pickup: z.string().trim().min(2, 'El origen es obligatorio').max(255),
  dropoff: z.string().trim().min(2, 'El destino es obligatorio').max(255),
  tripDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),
  tripTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:MM)'),
  passengers: z.number().int().min(1).max(50),
  luggage: z.number().int().min(0).max(50).default(0),
  vehicle: vehicleEnum,
  flightNumber: z.string().trim().max(20).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
})

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
})

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
})

export const listBookingsQuery = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
