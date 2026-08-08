import { Router, type Response } from 'express'
import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { bookings } from '../../db/schema'
import { createBookingSchema } from '../../lib/validators'
import { sendBookingNotification, sendConfirmationToClient } from '../../lib/email'

const router = Router()

router.post('/', async (req, res) => {
  const parsed = createBookingSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos', details: parsed.error.flatten() })
    return
  }
  const data = parsed.data

  const db = getDb()
  try {
    const [booking] = await db
      .insert(bookings)
      .values({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        pickup: data.pickup,
        dropoff: data.dropoff,
        tripDate: data.tripDate,
        tripTime: data.tripTime,
        passengers: data.passengers,
        luggage: data.luggage ?? 0,
        vehicle: data.vehicle,
        flightNumber: data.flightNumber || null,
        notes: data.notes || null,
      })
      .returning()

    res.status(201).json({ booking })
    notify(res, booking)
  } catch (err) {
    console.error('Error creando reserva:', err)
    res.status(500).json({ error: 'No se pudo guardar la reserva. Inténtalo de nuevo.' })
  }
})

router.get('/:id', async (req, res) => {
  const db = getDb()
  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, req.params.id))
    if (!booking) {
      res.status(404).json({ error: 'Reserva no encontrada' })
      return
    }
    res.json({ booking })
  } catch (err) {
    console.error('Error buscando reserva:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

async function notify(res: Response, booking: any) {
  try {
    await Promise.allSettled([sendBookingNotification(booking), sendConfirmationToClient(booking)])
  } catch (err) {
    console.error('Error enviando emails:', err)
  }
}

export default router
