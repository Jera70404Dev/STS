import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'

let cachedDb: ReturnType<typeof createDb> | null = null

function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL no está configurada. Revisa el archivo .env')
  }
  const sql = neon(url)
  return drizzle(sql, { schema })
}

export function getDb() {
  if (!cachedDb) cachedDb = createDb()
  return cachedDb
}
