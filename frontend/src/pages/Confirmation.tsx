import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { VEHICLES, type Booking } from '../types'
import { BRAND } from '../content'
import { Spinner, Button } from '../components/ui'

export default function Confirmation() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('No se encontró la reserva.')
      return
    }
    api
      .getBooking(id)
      .then(({ booking: b }) => setBooking(b))
      .catch((err) => setError(err instanceof Error ? err.message : 'No se encontró la reserva.'))
  }, [id])

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-white">Reserva no encontrada</h1>
        <p className="mt-2 text-ink-400">{error}</p>
        <div className="mt-6">
          <Button to="/">Hacer una nueva reserva</Button>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex justify-center py-24 text-gold-400">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const vehicle = VEHICLES[booking.vehicle]

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="rounded-2xl border border-green-500/40 bg-green-950/40 p-6 text-center">
        <div className="text-5xl">✓</div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white">¡Reserva recibida!</h1>
        <p className="mt-2 text-ink-400">
          Te enviamos un correo de confirmación a <strong className="text-white">{booking.customerEmail}</strong>.
          Nuestro equipo te contactará para confirmar el viaje.
        </p>
        <div className="mt-3 text-sm font-medium text-gold-300">Nº de reserva: {booking.id}</div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-card">
        <h2 className="mb-4 font-display text-xl font-semibold text-white">Detalle de tu viaje</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">Ruta</dt>
            <dd className="mt-0.5 text-sm text-ink-400">
              {booking.pickup} <span className="text-ink-600">→</span> {booking.dropoff}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Fecha y hora
            </dt>
            <dd className="mt-0.5 text-sm text-ink-400">
              {booking.tripDate} a las {booking.tripTime}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">Vehículo</dt>
            <dd className="mt-0.5 text-sm text-ink-400">
              {vehicle.label} · {booking.passengers} pasajeros · {booking.luggage} equipajes
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">Cliente</dt>
            <dd className="mt-0.5 text-sm text-ink-400">
              {booking.customerName} · {booking.customerPhone}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button to="/" variant="dark">
          Hacer otra reserva
        </Button>
        <a href={BRAND.phoneHref} className="text-sm text-ink-400 hover:text-gold-300">
          ¿Urgencia? Llámanos: {BRAND.phone}
        </a>
      </div>
    </div>
  )
}
