import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ApiError } from '../api'
import { VEHICLES, type CreateBookingPayload, type VehicleKey } from '../types'
import { ErrorBox, Spinner, inputClass, labelClass } from './ui'

type FormState = {
  customerName: string
  customerEmail: string
  customerPhone: string
  pickup: string
  dropoff: string
  tripDate: string
  tripTime: string
  passengers: number
  luggage: number
  vehicle: VehicleKey
  flightNumber: string
  notes: string
}

const initial: FormState = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  pickup: '',
  dropoff: '',
  tripDate: '',
  tripTime: '',
  passengers: 1,
  luggage: 0,
  vehicle: 'sedan',
  flightNumber: '',
  notes: '',
}

export default function BookingForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.tripDate || !form.tripTime) {
      setError('Selecciona fecha y hora del viaje.')
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    if (form.tripDate < today) {
      setError('La fecha del viaje no puede ser anterior a hoy.')
      return
    }

    const payload: CreateBookingPayload = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      pickup: form.pickup,
      dropoff: form.dropoff,
      tripDate: form.tripDate,
      tripTime: form.tripTime,
      passengers: form.passengers,
      luggage: form.luggage,
      vehicle: form.vehicle,
      flightNumber: form.flightNumber.trim() || null,
      notes: form.notes.trim() || null,
    }

    setSubmitting(true)
    try {
      const { booking } = await api.createBooking(payload)
      navigate(`/confirmacion?id=${booking.id}`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('No se pudo enviar la reserva. Inténtalo de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <h2 className="mb-4 text-xl font-bold text-slate-900">Reserva tu viaje</h2>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="customerName">
              Nombre completo *
            </label>
            <input
              id="customerName"
              className={inputClass}
              value={form.customerName}
              onChange={(e) => set('customerName', e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="customerEmail">
              Correo electrónico *
            </label>
            <input
              id="customerEmail"
              type="email"
              className={inputClass}
              value={form.customerEmail}
              onChange={(e) => set('customerEmail', e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="customerPhone">
            Teléfono (WhatsApp) *
          </label>
          <input
            id="customerPhone"
            type="tel"
            className={inputClass}
            value={form.customerPhone}
            onChange={(e) => set('customerPhone', e.target.value)}
            required
            autoComplete="tel"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="pickup">
              Dirección de recogida (origen) *
            </label>
            <input
              id="pickup"
              className={inputClass}
              value={form.pickup}
              onChange={(e) => set('pickup', e.target.value)}
              required
              placeholder="Ej. 123 Main St, Miami, FL"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="dropoff">
              Destino *
            </label>
            <input
              id="dropoff"
              className={inputClass}
              value={form.dropoff}
              onChange={(e) => set('dropoff', e.target.value)}
              required
              placeholder="Ej. Aeropuerto Internacional de Miami (MIA)"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="tripDate">
              Fecha del viaje *
            </label>
            <input
              id="tripDate"
              type="date"
              className={inputClass}
              value={form.tripDate}
              onChange={(e) => set('tripDate', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="tripTime">
              Hora de recogida *
            </label>
            <input
              id="tripTime"
              type="time"
              className={inputClass}
              value={form.tripTime}
              onChange={(e) => set('tripTime', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="flightNumber">
              Nº de vuelo (opcional)
            </label>
            <input
              id="flightNumber"
              className={inputClass}
              value={form.flightNumber}
              onChange={(e) => set('flightNumber', e.target.value)}
              placeholder="Ej. AA 123"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="passengers">
              Pasajeros *
            </label>
            <input
              id="passengers"
              type="number"
              min={1}
              max={50}
              className={inputClass}
              value={form.passengers}
              onChange={(e) => set('passengers', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="luggage">
              Equipaje (nº de maletas)
            </label>
            <input
              id="luggage"
              type="number"
              min={0}
              max={50}
              className={inputClass}
              value={form.luggage}
              onChange={(e) => set('luggage', Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tipo de vehículo *</label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(VEHICLES) as VehicleKey[]).map((key) => {
              const v = VEHICLES[key]
              const active = form.vehicle === key
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => set('vehicle', key)}
                  className={`rounded-xl border p-3 text-left transition ${
                    active
                      ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{v.label}</span>
                    <span className="text-sm font-medium text-brand-700">${v.price}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{v.capacity} pasajeros</div>
                  <p className="mt-1 text-xs text-slate-500">{v.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="notes">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            rows={3}
            className={inputClass}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Detalles del viaje, punto de encuentro, etc."
          />
        </div>

        <ErrorBox message={error} />

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white shadow transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Spinner />}
          {submitting ? 'Enviando reserva…' : 'Reservar ahora'}
        </button>
        <p className="text-center text-xs text-slate-400">
          Al reservar recibirás una confirmación por correo. Sin cargos por anticipado.
        </p>
      </div>
    </form>
  )
}
