# AGENTS.md — Transport Agency (Sistema de Reservas)

Sistema de reservas para **Secure Transportation Service** (agencia de transporte en Miami, FL). Los clientes reservan desde la web pública (en inglés); el jefe ve las reservas en un calendario y recibe notificación por correo.

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
│   │   ├── content/index.ts  # ⚠️ Toda la copia EN INGLÉS + imágenes (la editas aquí)
│   │   ├── pages/            # Home, About, Fleet, Chauffeurs, Services, Reserve, Confirmation, Privacy, Terms, Login, Admin
│   │   ├── components/       # layout/ (Header, Footer, Layout), ui (Button, Reveal, PageHero…)
│   │   ├── api.ts            # Cliente fetch + token JWT en localStorage
│   │   └── types.ts          # Tipos Booking/Vehicle + catálogo de vehículos (contrato con el backend)
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
| `npm run build` | Instala deps del frontend (`npm ci --prefix frontend`) y compila a `frontend/dist`. Vercel solo instala las deps de la raíz |
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
- `vercel.json`: `buildCommand: "npm run build"`, `outputDirectory: "frontend/dist"`. El archivo `api/index.ts` se convierte en la función serverless `/api`. **No usar el bloque `functions` con `runtime` en `vercel.json`** (ver errores típicos nº 3).
- Las peticiones a `/api/*` no se cachean (header `Cache-Control: no-store`).
- El token JWT se guarda en `localStorage` del navegador del admin (clave `ta_token`). No usar para datos críticos adicionales; para esta app es suficiente.

### Errores típicos y reglas (lecciones de producción)

#### 1. Vercel solo instala las dependencias de la RAÍZ
- **Síntoma:** el build falla con `Cannot find module 'react' / 'react-router-dom' / '@fullcalendar/...'`.
- **Regla:** el `build` raíz debe instalar las deps del frontend antes de compilar:
  `"build": "npm ci --prefix frontend && npm --prefix frontend run build"`.
- Mantener `frontend/package-lock.json` commiteado y en sync con `frontend/package.json`.

#### 2. La función serverless NO se bundlea: se ejecuta como ESM suelto
- Vercel transpila cada `.ts` de `api/`, `db/` y `lib/` a `.js` y los carga como **ESM** (no bundlea los imports).
- **Regla A:** `"type": "module"` en el `package.json` raíz es **obligatorio**. Quitarlo produce `SyntaxError: Cannot use import statement outside a module`.
- **Regla B:** todos los imports relativos del backend llevan **extensión `.js`** (p. ej. `./routes/bookings.js`, `../../db/index.js`, `./schema.js`). Sin extensión, ESM crashea con `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/api/routes/bookings'`.
- **Síntoma:** `FUNCTION_INVOCATION_FAILED` (HTTP 500) en TODAS las rutas, incluso `/api/health` (que no toca la BD). Revisar los logs de runtime en Vercel (Deployments → Logs).
- Nota: TypeScript (`moduleResolution: "bundler"`) acepta `.js` → `.ts`, así que `npm run typecheck` sigue pasando con las extensiones.

#### 3. NO usar el bloque `functions` con `runtime` en `vercel.json`
- **Síntoma:** el build falla con `Function Runtimes must have a valid version, for example now-php@1.0.0`.
- **Regla:** fijar la versión de Node con `"engines": { "node": ">=22" }` en el `package.json` raíz, nunca con `functions.runtime` en `vercel.json`.

#### 4. FullCalendar: nunca llamar `setState` incondicional en `datesSet`
- **Síntoma:** el panel admin se muestra y ~1 s después se queda en blanco. Consola: `Minified React error #185` (Maximum update depth exceeded).
- **Causa:** crear un objeto nuevo en cada `datesSet` fuerza un re-render → FullCalendar dispara `datesSet` otra vez → bucle infinito.
- **Regla:** usar el actualizador funcional devolviendo la referencia anterior si el rango no cambió:
  ```ts
  setRange((prev) => (prev.from === from && prev.to === to ? prev : { from, to }))
  ```

#### 5. Mensaje genérico "Algo salió mal. Inténtalo de nuevo." del frontend
- Aparece cuando la respuesta del API NO es JSON con un campo `error: string` (p. ej. la página 500 en texto plano de Vercel por un crash de la función).
- Diagnosticar con `curl https://<dominio>.vercel.app/api/health` (debe responder `{"ok":true,...}`) y revisar los logs de la función en Vercel.

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
- El catálogo de vehículos está duplicado a propósito: `lib/vehicles.ts` (backend) y `frontend/src/types.ts` (frontend). **Son el contrato con la API** (label, capacidad, precio). Cambiarlos a la vez.
- **La web pública está en INGLÉS**; el panel admin y la página de confirmación siguen en español. La copia (textos, servicios, flota, choferes, testimonios) y las **URLs de las imágenes viven en `frontend/src/content/index.ts`** — se editan ahí sin tocar componentes. Las imágenes son de Unsplash (remotas): si una deja de responder, se reemplaza en ese archivo.
- **Los datos de marketing de la flota (FLEET) son frontend-only** y extienden el catálogo reservable: cada item apunta a un `vehicle: VehicleKey` real. Los 4 vehículos reservables (`sedan/suv/van/bus`) pre-seleccionan el vehículo en `/reserve?vehicle=…`; los de "on request" sugieren el reservable más cercano.
- **`/reserve` (wizard multi-paso)** se pre-carga con query params: `?service=…&date=…&time=…&passengers=…&vehicle=…` (los usan el Quick Booking de la Home y las tarjetas de Fleet).
- **El backend no tiene campo de servicio**: el tipo de servicio, ida y vuelta, silla de niño, etc. se anexan como texto en `notes`. No añadir campos extra al payload (zod los descarta silenciosamente); si algún día se persiste el servicio, hay que tocar `db/schema.ts` + `lib/validators.ts` + migración.
- **lucide-react ya no exporta iconos de marcas** (Facebook, Instagram, X…). Para redes sociales se usan SVGs inline (ver `Footer.tsx`); el resto de iconos vienen de lucide.
- La página `/admin` se carga con `React.lazy` (FullCalendar va en un chunk aparte). No importar FullCalendar en el bundle principal.
- Los mensajes de error deben estar en el idioma del contexto: **inglés en la web pública** (wizard de reservas, etc.) y **español en el panel admin / confirmación**; siempre accionables.
- No añadir comentarios innecesarios al código; el estilo es TypeScript moderno, componentes funcionales con hooks, Tailwind para estilos.
- El estado del calendario (rango visible) se recarga vía `datesSet`. **Nunca llamar `setState` incondicional en `datesSet`** (bucle infinito → React error #185, pantalla en blanco); usar el guard del error típico nº 4. Las actualizaciones de estado del modal reutilizan la fila existente sin re-fetch.
- La rama por defecto es **`master`** (no `main`). El entorno de desarrollo no tiene credenciales de GitHub: dejar el commit local y el usuario ejecuta `git push origin master`.
- Tras tocar `vercel.json` o `package.json`, verificar con `curl https://<dominio>.vercel.app/api/health` (debe responder `{"ok":true,...}`).
- Seed del admin: idempotente (`onConflictDoNothing`). Si se pierde la contraseña, volver a ejecutar `npm run db:seed` con una nueva `ADMIN_PASSWORD`.
