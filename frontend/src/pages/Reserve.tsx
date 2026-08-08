import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { api, ApiError } from '../api'
import { VEHICLES, type CreateBookingPayload, type VehicleKey } from '../types'
import { SERVICES, SERVICE_SUGGESTION } from '../content'
import { Button, ErrorBox, Spinner, inputClass, labelClass } from '../components/ui'

const STEPS = ['Trip Details', 'Vehicle & Extras', 'Your Details', 'Review & Submit']

const EXTRAS = [
  { key: 'childSeat', label: 'Child seat', price: 10 },
  { key: 'accessibility', label: 'Accessible vehicle', price: 15 },
  { key: 'petFriendly', label: 'Traveling with a pet', price: 10 },
] as const

type ExtraKey = (typeof EXTRAS)[number]['key']

type WizardState = {
  service: string
  tripDate: string
  tripTime: string
  returnTime: string
  pickup: string
  dropoff: string
  flightNumber: string
  vehicle: VehicleKey
  passengers: number
  luggage: number
  extraStops: string
  childSeat: boolean
  accessibility: boolean
  petFriendly: boolean
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

export default function Reserve() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const initialVehicle = useMemo<VehicleKey>(() => {
    const fromParam = params.get('vehicle') as VehicleKey | null
    if (fromParam && Object.keys(VEHICLES).includes(fromParam)) return fromParam
    const service = params.get('service') ?? ''
    return SERVICE_SUGGESTION[service] ?? 'sedan'
  }, [params])

  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<WizardState>({
    service: params.get('service') ?? 'airport',
    tripDate: params.get('date') ?? '',
    tripTime: params.get('time') ?? '',
    returnTime: '',
    pickup: '',
    dropoff: '',
    flightNumber: '',
    vehicle: initialVehicle,
    passengers: Number(params.get('passengers')) || 2,
    luggage: 0,
    extraStops: '',
    childSeat: false,
    accessibility: false,
    petFriendly: false,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  })

  function set<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleExtra(key: ExtraKey) {
    setForm((f) => ({ ...f, [key]: !f[key] }))
  }

  const today = new Date().toISOString().slice(0, 10)
  const serviceTitle = SERVICES.find((s) => s.id === form.service)?.title ?? ''
  const vehicle = VEHICLES[form.vehicle]

  const estimate = useMemo(() => {
    let total = vehicle.price
    if (form.returnTime) total *= 2
    for (const ex of EXTRAS) if (form[ex.key]) total += ex.price
    return total
  }, [form, vehicle.price])

  function validate(stepToValidate: number): string | null {
    if (stepToValidate === 0) {
      if (!form.tripDate) return 'Select a pickup date.'
      if (form.tripDate < today) return 'The trip date cannot be in the past.'
      if (!form.tripTime) return 'Select a pickup time.'
      if (form.pickup.trim().length < 2) return 'Enter your pickup address.'
      if (form.dropoff.trim().length < 2) return 'Enter your destination.'
    }
    if (stepToValidate === 1) {
      if (form.passengers < 1) return 'At least one passenger is required.'
    }
    if (stepToValidate === 2) {
      if (form.customerName.trim().length < 2) return 'Enter your full name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
        return 'Enter a valid email address.'
      if (form.customerPhone.trim().length < 7) return 'Enter a valid phone number.'
    }
    return null
  }

  function next() {
    const err = validate(step)
    setError(err)
    if (!err) {
      setStep((s) => Math.min(s + 1, 3))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function back() {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const err = validate(2)
    if (err) {
      setError(err)
      setStep(2)
      return
    }

    const extras: string[] = [serviceTitle && `Service: ${serviceTitle}`]
    if (form.returnTime) extras.push(`Return pickup: ${form.returnTime}`)
    if (form.childSeat) extras.push('Child seat required')
    if (form.accessibility) extras.push('Wheelchair-accessible vehicle required')
    if (form.petFriendly) extras.push('Traveling with a pet')
    if (form.extraStops.trim()) extras.push(`Extra stops: ${form.extraStops.trim()}`)
    if (form.notes.trim()) extras.push(form.notes.trim())

    const payload: CreateBookingPayload = {
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      pickup: form.pickup.trim(),
      dropoff: form.dropoff.trim(),
      tripDate: form.tripDate,
      tripTime: form.tripTime,
      passengers: form.passengers,
      luggage: form.luggage,
      vehicle: form.vehicle,
      flightNumber: form.flightNumber.trim() || null,
      notes: extras.filter(Boolean).join('\n') || null,
    }

    setSubmitting(true)
    try {
      const { booking } = await api.createBooking(payload)
      navigate(`/confirmacion?id=${booking.id}`)
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('We could not submit your request. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
          Reservations
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">Book your ride</h1>
        <p className="mt-3 text-ink-400">
          No payment required — send your request and we confirm availability by email.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ol className="mb-8 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
                    i < step
                      ? 'border-gold-400 bg-gold-400 text-ink-950'
                      : i === step
                        ? 'border-gold-400 text-gold-400'
                        : 'border-ink-600 text-ink-500'
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    i === step ? 'text-gold-300' : 'text-ink-500'
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ink-700" />}
              </li>
            ))}
          </ol>

          <form
            onSubmit={step === 3 ? onSubmit : (e) => e.preventDefault()}
            className="rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-card sm:p-8"
            noValidate
          >
            {step === 0 && <TripStep form={form} set={set} services={SERVICES} />}
            {step === 1 && <VehicleStep form={form} set={set} toggleExtra={toggleExtra} />}
            {step === 2 && <DetailsStep form={form} set={set} />}
            {step === 3 && (
              <ReviewStep form={form} serviceTitle={serviceTitle} vehicle={vehicle} />
            )}

            <ErrorBox message={error} />

            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={back}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <Button type="button" onClick={next}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting && <Spinner />}
                  {submitting ? 'Submitting…' : 'Request Reservation'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        <aside className="lg:col-span-1">
          <SummaryCard
            form={form}
            serviceTitle={serviceTitle}
            vehicle={vehicle}
            estimate={estimate}
          />
        </aside>
      </div>
    </div>
  )
}

function TripStep({
  form,
  set,
  services,
}: {
  form: WizardState
  set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void
  services: typeof SERVICES
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="r-service">
          Service type *
        </label>
        <select
          id="r-service"
          className={inputClass}
          value={form.service}
          onChange={(e) => set('service', e.target.value)}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="r-date">
            Pickup date *
          </label>
          <input
            id="r-date"
            type="date"
            className={inputClass}
            min={new Date().toISOString().slice(0, 10)}
            value={form.tripDate}
            onChange={(e) => set('tripDate', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="r-time">
            Pickup time *
          </label>
          <input
            id="r-time"
            type="time"
            className={inputClass}
            value={form.tripTime}
            onChange={(e) => set('tripTime', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="r-return">
            Return time (round trip)
          </label>
          <input
            id="r-return"
            type="time"
            className={inputClass}
            value={form.returnTime}
            onChange={(e) => set('returnTime', e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="r-pickup">
            Pickup address *
          </label>
          <input
            id="r-pickup"
            className={inputClass}
            placeholder="123 Ocean Dr, Miami Beach, FL"
            value={form.pickup}
            onChange={(e) => set('pickup', e.target.value)}
            autoComplete="street-address"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="r-dropoff">
            Destination *
          </label>
          <input
            id="r-dropoff"
            className={inputClass}
            placeholder="Miami International Airport (MIA)"
            value={form.dropoff}
            onChange={(e) => set('dropoff', e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="r-flight">
          Flight number (optional)
        </label>
        <input
          id="r-flight"
          className={inputClass}
          placeholder="AA 123 — helps us track your arrival"
          value={form.flightNumber}
          onChange={(e) => set('flightNumber', e.target.value)}
        />
      </div>
    </div>
  )
}

function VehicleStep({
  form,
  set,
  toggleExtra,
}: {
  form: WizardState
  set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void
  toggleExtra: (k: ExtraKey) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
          Choose your vehicle
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(VEHICLES) as VehicleKey[]).map((key) => {
            const v = VEHICLES[key]
            const active = form.vehicle === key
            return (
              <button
                type="button"
                key={key}
                onClick={() => set('vehicle', key)}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-gold-400 bg-gold-400/10 ring-2 ring-gold-400/30'
                    : 'border-white/10 bg-ink-950/60 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{v.label}</span>
                  <span className="text-sm font-bold text-gold-400">${v.price}</span>
                </div>
                <p className="mt-1 text-xs text-ink-400">
                  {v.capacity} passengers · {v.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="r-pax">
            Passengers *
          </label>
          <input
            id="r-pax"
            type="number"
            min={1}
            max={50}
            className={inputClass}
            value={form.passengers}
            onChange={(e) => set('passengers', Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="r-luggage">
            Suitcases
          </label>
          <input
            id="r-luggage"
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
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
          Special requirements
        </h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {EXTRAS.map((ex) => {
            const active = form[ex.key]
            return (
              <button
                type="button"
                key={ex.key}
                onClick={() => toggleExtra(ex.key)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-gold-400 bg-gold-400 text-ink-950'
                    : 'border-white/15 text-ink-400 hover:border-gold-400/60 hover:text-gold-300'
                }`}
              >
                {ex.label} {active && `(+$${ex.price})`}
              </button>
            )
          })}
        </div>
        <div className="mt-4">
          <label className={labelClass} htmlFor="r-stops">
            Extra stops (optional)
          </label>
          <input
            id="r-stops"
            className={inputClass}
            placeholder="e.g. 2 stops on the way to the airport"
            value={form.extraStops}
            onChange={(e) => set('extraStops', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function DetailsStep({
  form,
  set,
}: {
  form: WizardState
  set: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-400">
        We use these details to confirm your reservation by email and reach you on the day.
      </p>
      <div>
        <label className={labelClass} htmlFor="r-name">
          Full name *
        </label>
        <input
          id="r-name"
          className={inputClass}
          value={form.customerName}
          onChange={(e) => set('customerName', e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="r-email">
            Email *
          </label>
          <input
            id="r-email"
            type="email"
            className={inputClass}
            value={form.customerEmail}
            onChange={(e) => set('customerEmail', e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="r-phone">
            Phone *
          </label>
          <input
            id="r-phone"
            type="tel"
            className={inputClass}
            placeholder="+1 (305) 555-0123"
            value={form.customerPhone}
            onChange={(e) => set('customerPhone', e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="r-notes">
          Anything else we should know?
        </label>
        <textarea
          id="r-notes"
          rows={3}
          className={inputClass}
          placeholder="Meeting point details, preferences, etc."
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </div>
    </div>
  )
}

function ReviewStep({
  form,
  serviceTitle,
  vehicle,
}: {
  form: WizardState
  serviceTitle: string
  vehicle: (typeof VEHICLES)[VehicleKey]
}) {
  const rows: Array<[string, string]> = [
    ['Service', serviceTitle],
    ['Route', `${form.pickup} → ${form.dropoff}`],
    ['Date & time', `${form.tripDate} at ${form.tripTime}`],
    ['Return', form.returnTime ? `Return at ${form.returnTime}` : '—'],
    ['Vehicle', vehicle.label],
    ['Passengers', String(form.passengers)],
    ['Luggage', String(form.luggage)],
    ['Contact', `${form.customerName} · ${form.customerEmail}`],
    ['Flight', form.flightNumber || '—'],
  ]
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
        Review your request
      </h3>
      <dl className="mt-4 divide-y divide-white/5 rounded-xl border border-white/10 bg-ink-950/60">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
            <dt className="text-ink-500">{k}</dt>
            <dd className="text-right font-medium text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        Estimated total shown for reference. Final pricing will be confirmed by email before any
        charge.
      </p>
    </div>
  )
}

function SummaryCard({
  form,
  serviceTitle,
  vehicle,
  estimate,
}: {
  form: WizardState
  serviceTitle: string
  vehicle: (typeof VEHICLES)[VehicleKey]
  estimate: number
}) {
  return (
    <div className="sticky top-28 rounded-2xl border border-gold-400/25 bg-ink-900 p-6 shadow-glow">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Your trip</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        <li className="flex justify-between gap-3">
          <span className="text-ink-500">Service</span>
          <span className="font-medium text-white">{serviceTitle || '—'}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span className="text-ink-500">Date</span>
          <span className="font-medium text-white">{form.tripDate || '—'}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span className="text-ink-500">Time</span>
          <span className="font-medium text-white">{form.tripTime || '—'}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span className="text-ink-500">Vehicle</span>
          <span className="font-medium text-white">{vehicle.label}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span className="text-ink-500">Passengers</span>
          <span className="font-medium text-white">{form.passengers}</span>
        </li>
      </ul>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs text-ink-500">Estimated total</p>
        <p className="mt-1 font-display text-3xl font-semibold text-gold-400">
          ${estimate}
          <span className="text-sm font-normal text-ink-500"> / trip</span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          Final price confirmed by email. No charge today.
        </p>
      </div>
    </div>
  )
}
