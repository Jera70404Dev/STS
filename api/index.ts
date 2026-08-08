import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bookingsRouter from './routes/bookings.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import { requireAuth } from './middleware/auth.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN ?? true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'transport-agency-api' })
})

app.use('/api/bookings', bookingsRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', requireAuth, adminRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// En producción (Vercel) no se hace listen: Vercel importa `app` como función serverless.
// En desarrollo local se inicia el servidor con: npm run dev:api
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 3001)
  app.listen(port, () => {
    console.log(`✔ API lista en http://localhost:${port}`)
  })
}

export default app
