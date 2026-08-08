import { Router } from 'express'
import { and, asc, eq, gte, lte } from 'drizzle-orm'
import { getDb } from '../../db'
import { bookings } from '../../db/schema'
import { listBookingsQuery, updateStatusSchema } from '../../lib/validators'

const router = Router()

router.get('/bookings', async (req, res) => {
  const q = listBookingsQuery.safeParse(req.query)
  if (!q.success) {
    res.status(400).json({ error: 'Parámetros inválidos' })
    return
  }
  const { from, to } = q.data

  const db = getDb()
  try {
    const conditions = []
    if (from) conditions.push(gte(bookings.tripDate, from))
    if (to) conditions.push(lte(bookings.tripDate, to))

    const rows = await db
      .select()
      .from(bookings)
      .where(and(...conditions))
      .orderBy(asc(bookings.tripDate), asc(bookings.tripTime))

    res.json({ bookings: rows })
  } catch (err) {
    console.error('Error listando reservas:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

router.get('/bookings/:id', async (req, res) => {
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

router.patch('/bookings/:id/status', async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Estado inválido' })
    return
  }

  const db = getDb()
  try {
    const [booking] = await db
      .update(bookings)
      .set({ status: parsed.data.status })
      .where(eq(bookings.id, req.params.id))
      .returning()
    if (!booking) {
      res.status(404).json({ error: 'Reserva no encontrada' })
      return
    }
    res.json({ booking })
  } catch (err) {
    console.error('Error actualizando reserva:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

router.delete('/bookings/:id', async (req, res) => {
  const db = getDb()
  try {
    const [deleted] = await db
      .delete(bookings)
      .where(eq(bookings.id, req.params.id))
      .returning()
    if (!deleted) {
      res.status(404).json({ error: 'Reserva no encontrada' })
      return
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('Error eliminando reserva:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
