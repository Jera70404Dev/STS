import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AdminJwtPayload {
  sub: string
  username: string
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminJwtPayload
    }
  }
}

export function signToken(payload: AdminJwtPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no está configurada')
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    res.status(401).json({ error: 'No autorizado. Inicia sesión.' })
    return
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload
    req.admin = { sub: payload.sub as string, username: payload.username as string }
    next()
  } catch {
    res.status(401).json({ error: 'Sesión expirada o inválida. Vuelve a iniciar sesión.' })
  }
}
