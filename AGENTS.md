# AGENTS.md — Transport Agency (Sistema de Reservas)

Sistema de reservas para una agencia de transporte en EE. UU. Los clientes reservan desde la web; el jefe ve las reservas en un calendario y recibe notificación por correo.

**Stack:** React 18 + Vite + Tailwind CSS 4 (frontend) · Node.js + Express 4 + TypeScript (backend serverless en Vercel) · PostgreSQL en Neon (Drizzle ORM) · Resend (email) · JWT + bcrypt (panel admin).

**Costo total:** $0/mes (planes gratuitos de Vercel, Neon y Resend).

---

## Estructura del repositorio

```
STS/
├── api/                      # Backend Express (serverless en Vercel)
│   ├── index.ts              # App Express (importada por Vercel; escucha si no está en Vercel)
│   ├── middleware/auth.ts    # JWT: signToken + requireAuth
│   └── routes/
│       ├── bookings.ts       # POST /api/bookings (público), GET /api/bookings/:id
│       ├── auth.ts           # POST /api/auth/login (público)
│       └── admin.ts          # CRUD de reservas (protegido con JWT)
├── db/
│   ├── schema.ts             # Tablas: bookings, admins (+ enums)
│   ├── index.ts              # Cliente Drizzle + Neon HTTP (caché por instancia)
│   └── seed.ts               # Crea el admin desde ADMIN_USERNAME/ADMIN_PASSWORD
├── lib/
│   ├── email.ts              # Resend: notificación al jefe + confirmación al cliente
│   ├── validators.ts         # Esquemas zod (booking, login, status, query)
│   └── vehicles.ts           # Catálogo de vehículos (label, capacidad, precio)
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/            # Home, Confirmation, Login, Admin
│   │   ├── components/       # BookingForm, ui (badges/spinner/inputs)
│   │   ├── api.ts            # Cliente fetch + token JWT en localStorage
│   │   └── types.ts          # Tipos Booking/Vehicle + catálogo de vehículos
├── vercel.json               # build frontend + rewrites /api y SPA
├── drizzle.config.ts         # Configuración de drizzle-kit
├── .env.example              # Plantilla de variables de entorno
└── package.json              # Scripts del monorepo
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala deps del backend (raíz) — y `npm --prefix frontend install` para el frontend |
| `npm run dev` | Arranca API (puerto 3001) + frontend Vite (5173, con proxy `/api`) |
| `npm run dev:api` | Solo la API con hot-reload (tsx watch) |
| `npm run dev:front` | Solo Vite |
| `npm run build` | Compila el frontend de producción a `frontend/dist` |
| `npm run typecheck` | Typecheck del backend + frontend |
| `npm run db:generate` | Genera migraciones con drizzle-kit |
| `npm run db:push` | Sincroniza el esquema con la BD (crear/alterar tablas) |
| `npm run db:seed` | Crea el admin en la BD (requiere `.env` con `DATABASE_URL`, `ADMIN_PASSWORD`) |

> ⚠️ El backend corre como función serverless de Vercel. En local, `api/index.ts` solo ejecuta `app.listen(3001)` cuando `VERCEL` no está definida.

## Variables de entorno (`.env` / Vercel)

| Variable | Requerida | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Connection string de Neon PostgreSQL (con `?sslmode=require`) |
| `RESEND_API_KEY` | Sí* | API key de Resend. *Sin ella no se envían emails (la reserva sí se guarda) |
| `RESEND_FROM` | Sí | Remitente. Antes de verificar dominio: `Onboarding <onboarding@resend.dev>` |
| `ADMIN_NOTIFY_EMAIL` | Sí | Correo del jefe que recibe cada nueva reserva |
| `JWT_SECRET` | Sí | Secreto para firmar tokens (generar con `openssl rand -base64 32`) |
| `ADMIN_USERNAME` | Para seed | Usuario del panel (default `admin`) |
| `ADMIN_PASSWORD` | Para seed | Contraseña del admin (mín. 8 caracteres) |
| `CORS_ORIGIN` | No | Origin permitido en CORS. En producción Vercel se sirve todo desde el mismo dominio (no hace falta) |
| `PORT` | No | Puerto local de la API (default `3001`) |

Copiar `.env.example` → `.env`. **Nunca subir `.env` al repositorio** (está en `.gitignore`).

## API

### Públicas
- `GET /api/health` → `{ ok: true }`
- `POST /api/bookings` → crea reserva (valida zod, inserta, envía emails). Body: `{ customerName, customerEmail, customerPhone, pickup, dropoff, tripDate (YYYY-MM-DD), tripTime (HH:MM), passengers, luggage?, vehicle (sedan|suv|van|bus), flightNumber?, notes? }`
- `GET /api/bookings/:id` → detalle público de una reserva (página de confirmación)

### Admin (header `Authorization: Bearer <token>`)
- `POST /api/auth/login` → body `{ username, password }` → `{ token }`
- `GET /api/admin/bookings?from=YYYY-MM-DD&to=YYYY-MM-DD` → reservas en rango (para el calendario)
- `GET /api/admin/bookings/:id`
- `PATCH /api/admin/bookings/:id/status` → body `{ status: pending|confirmed|completed|cancelled }`
- `DELETE /api/admin/bookings/:id`

## Base de datos

Tabla `bookings`: `id (uuid pk)`, `customer_name`, `customer_email`, `customer_phone`, `pickup`, `dropoff`, `trip_date (date)`, `trip_time (time)`, `passengers`, `luggage`, `vehicle (enum sedan|suv|van|bus)`, `flight_number`, `notes`, `status (enum pending|confirmed|completed|cancelled, default pending)`, `created_at`.

Tabla `admins`: `id (uuid pk)`, `username (unique)`, `password_hash (bcrypt)`, `created_at`.

Enums creados por Drizzle: `booking_status`, `vehicle_type`. El esquema vive en `db/schema.ts`; los cambios se aplican con `npm run db:push`.

## Flujo de email (Resend)

1. `POST /api/bookings` guarda la reserva y **en paralelo** (sin bloquear la respuesta) envía:
   - **Al jefe** (`ADMIN_NOTIFY_EMAIL`): resumen completo de la reserva.
   - **Al cliente**: confirmación de recepción.
2. Si `RESEND_API_KEY` no está configurada, los emails se omiten con un warning en consola (la reserva sigue guardándose).
3. Resend gratis = 100 emails/día. Para enviar desde tu dominio hay que verificar DNS (SPF + DKIM) y luego poner `RESEND_FROM` con tu dominio.

## Despliegue en Vercel (plan gratuito)

1. **Neon** (`neon.tech`): crear proyecto PostgreSQL, copiar connection string → `DATABASE_URL`. Alternativa: conectar Neon como integración dentro de Vercel (inyecta `DATABASE_URL` automáticamente).
2. **Resend** (`resend.com`): crear API key. Verificar dominio propio (DNS SPF/DKIM) para enviar desde `reservas@tuagencia.com`; mientras tanto usar `onboarding@resend.dev`.
3. **GitHub**: subir el repo.
4. **Vercel**: importar el repo. La config está en `vercel.json` (build → `frontend/dist`, rewrites de `/api` y SPA). Agregar env vars: `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_NOTIFY_EMAIL`, `JWT_SECRET`.
5. **Migrar BD**: ejecutar `npm run db:push` y `npm run db:seed` con las env vars apuntando a Neon (localmente con `.env`, o en un entorno Vercel).
6. **Dominio propio** (opcional): conectarlo en Vercel + añadir `VERCEL_DOMAIN`/DNS en Resend para autenticación de email.
7. Probar el flujo: reservar desde la web → ver reserva en el calendario del admin → correos al jefe y al cliente.

### Detalles de Vercel
- `vercel.json`: `buildCommand: "npm run build"`, `outputDirectory: "frontend/dist"`. El archivo `api/index.ts` se convierte en la función serverless `/api`.
- Las peticiones a `/api/*` no se cachean (header `Cache-Control: no-store`).
- El token JWT se guarda en `localStorage` del navegador del admin (clave `ta_token`). No usar para datos críticos adicionales; para esta app es suficiente.

## Panel del jefe

- `/admin/login` → usuario/contraseña (creado con `npm run db:seed`).
- `/admin` → calendario FullCalendar (vista semana/mes), colores por estado:
  - Pendiente = ámbar · Confirmada = azul · Completada = verde · Cancelada = gris.
- Click en una reserva → modal con detalle, botones para cambiar estado y eliminar.
- Contadores: viajes de hoy, pendientes, confirmadas, total en rango. Filtro por estado.
- Sesión válida 7 días (`JWT_SECRET`).

## Limitaciones del plan gratuito (conocerlas)

- **Cold start** del serverless: primera petición ~100-300 ms.
- **Neon gratis** "duerme" tras 5 min sin uso: la primera consulta tras el reposo tarda unos segundos en despertar la BD. Aceptable; si molesta, un ping periódico (cron) a `GET /api/health` lo mitiga.
- **Resend gratis**: 100 emails/día, 3000 totales. Al crecer, plan de pago (~$20/mes).
- No hay rate limiting global (solo validación). Para uso público intenso considerar límites por IP.

## Notas para desarrolladores / agentes

- **TypeScript estricto** en todo el repo. Verificar siempre con `npm run typecheck` y `npm run build` antes de terminar una tarea.
- El catálogo de vehículos está duplicado a propósito: `lib/vehicles.ts` (backend) y `frontend/src/types.ts` (frontend). Cambiarlos a la vez.
- Los mensajes de error al cliente deben estar en español y ser accionables.
- No añadir comentarios innecesarios al código; el estilo es TypeScript moderno, componentes funcionales con hooks, Tailwind para estilos.
- El estado del calendario (rango visible) se recarga vía `datesSet`; las actualizaciones de estado del modal reutilizan la fila existente sin re-fetch.
- Seed del admin: idempotente (`onConflictDoNothing`). Si se pierde la contraseña, volver a ejecutar `npm run db:seed` con una nueva `ADMIN_PASSWORD`.
