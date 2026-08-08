import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { admins } from '../../db/schema'
import { loginSchema } from '../../lib/validators'
import { signToken } from '../middleware/auth'

const router = Router()

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Usuario y contraseña son obligatorios' })
    return
  }
  const { username, password } = parsed.data

  const db = getDb()
  try {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username))
    if (!admin) {
      res.status(401).json({ error: 'Credenciales incorrectas' })
      return
    }
    const ok = await bcrypt.compare(password, admin.passwordHash)
    if (!ok) {
      res.status(401).json({ error: 'Credenciales incorrectas' })
      return
    }
    const token = signToken({ sub: admin.id, username: admin.username })
    res.json({ token })
  } catch (err) {
    console.error('Error en login:', err)
    res.status(500).json({ error: 'Error interno' })
  }
})

export default router
