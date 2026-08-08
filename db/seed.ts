import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { getDb } from './index.js'
import { admins } from './schema.js'

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.error('ERROR: define ADMIN_PASSWORD en tu archivo .env antes de ejecutar el seed.')
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('ERROR: ADMIN_PASSWORD debe tener al menos 8 caracteres.')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const db = getDb()

  await db
    .insert(admins)
    .values({ username, passwordHash })
    .onConflictDoNothing()

  console.log(`✔ Admin listo: "${username}"`)
  console.log('  Inicia sesión en /admin/login con estas credenciales.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
