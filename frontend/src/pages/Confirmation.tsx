import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { VEHICLES, type Booking } from '../types'
import { Spinner } from '../components/ui'

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
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Reserva no encontrada</h1>
        <p className="mt-2 text-slate-600">{error}</p>
        <Link to="/" className="mt-6 inline-block font-semibold text-brand-600 underline">
          Hacer una nueva reserva
        </Link>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex justify-center py-24 text-brand-700">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const vehicle = VEHICLES[booking.vehicle]

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-5xl">✓</div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">¡Reserva recibida!</h1>
        <p className="mt-1 text-slate-600">
          Te enviamos un correo de confirmación a <strong>{booking.customerEmail}</strong>. Nuestro
          equipo te contactará para confirmar el viaje.
        </p>
        <div className="mt-3 text-sm font-medium text-slate-500">Nº de reserva: {booking.id}</div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Detalle de tu viaje</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ruta</dt>
            <dd className="mt-0.5 text-sm">
              {booking.pickup} <span className="text-slate-400">→</span> {booking.dropoff}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Fecha y hora
            </dt>
            <dd className="mt-0.5 text-sm">
              {booking.tripDate} a las {booking.tripTime}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Vehículo
            </dt>
            <dd className="mt-0.5 text-sm">
              {vehicle.label} · {booking.passengers} pasajeros · {booking.luggage} equipajes
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cliente</dt>
            <dd className="mt-0.5 text-sm">
              {booking.customerName} · {booking.customerPhone}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 text-center">
        <Link to="/" className="font-semibold text-brand-600 underline">
          Hacer otra reserva
        </Link>
      </div>
    </div>
  )
}
