import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ApiError, clearToken, getToken } from '../api'
import { VEHICLES, STATUS_LABELS, type Booking, type BookingStatus } from '../types'
import { StatusBadge } from '../components/ui'
import AdminCalendar, { toISODate } from '../components/AdminCalendar'

const ALL_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

function todayISO(): string {
  return toISODate(new Date())
}

function currentWeekRange(): { from: string; to: string } {
  const now = new Date()
  const monday = new Date(now)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return {
    from: toISODate(monday),
    to: toISODate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)),
  }
}

export default function Admin() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [range, setRange] = useState<{ from: string; to: string }>(currentWeekRange)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(
    async (from: string, to: string) => {
      setLoading(true)
      setError(null)
      try {
        const { bookings: rows } = await api.getBookings(from, to)
        setBookings(rows)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken()
          navigate('/admin/login', { replace: true })
          return
        }
        setError(err instanceof Error ? err.message : 'Error cargando reservas.')
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin/login', { replace: true })
      return
    }
    load(range.from, range.to)
  }, [load, navigate, range])

  const handleRangeChange = useCallback((from: string, to: string) => {
    setRange((prev) => (prev.from === from && prev.to === to ? prev : { from, to }))
  }, [])

  const stats = useMemo(() => {
    const today = todayISO()
    return {
      today: bookings.filter((b) => b.tripDate === today && b.status !== 'cancelled').length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      total: bookings.length,
    }
  }, [bookings])

  async function changeStatus(booking: Booking, status: BookingStatus) {
    if (booking.status === status) return
    setSaving(true)
    setError(null)
    try {
      await api.updateStatus(booking.id, status)
      setBookings((rows) => rows.map((b) => (b.id === booking.id ? { ...b, status } : b)))
      setSelected((s) => (s && s.id === booking.id ? { ...s, status } : s))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar.')
    } finally {
      setSaving(false)
    }
  }

  async function removeBooking(booking: Booking) {
    if (!window.confirm(`¿Eliminar la reserva de ${booking.customerName}? Esta acción no se puede deshacer.`)) {
      return
    }
    setSaving(true)
    try {
      await api.deleteBooking(booking.id)
      setBookings((rows) => rows.filter((b) => b.id !== booking.id))
      setSelected(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar.')
    } finally {
      setSaving(false)
    }
  }

  function logout() {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  if (!getToken()) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pt-28">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Panel de reservas</h1>
          <p className="text-sm text-ink-500">Calendario de viajes del {range.from} al {range.to}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-white/15 bg-ink-800 px-4 py-2 text-sm font-medium text-ink-400 shadow-sm transition hover:border-gold-400/60 hover:text-gold-300"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Viajes de hoy" value={stats.today} color="text-gold-400" />
        <StatCard label="Pendientes" value={stats.pending} color="text-amber-400" />
        <StatCard label="Confirmados" value={stats.confirmed} color="text-blue-400" />
        <StatCard label="En este rango" value={stats.total} color="text-ink-400" />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-800/60 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <AdminCalendar
        bookings={bookings}
        loading={loading}
        onRangeChange={handleRangeChange}
        onSelectBooking={setSelected}
        onRefresh={() => load(range.from, range.to)}
      />

      {selected && (
        <BookingModal
          booking={selected}
          saving={saving}
          onClose={() => setSelected(null)}
          onChangeStatus={(s) => changeStatus(selected, s)}
          onDelete={() => removeBooking(selected)}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900 p-4 shadow-card">
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="mt-1 text-sm text-ink-500">{label}</div>
    </div>
  )
}

function BookingModal({
  booking,
  saving,
  onClose,
  onChangeStatus,
  onDelete,
}: {
  booking: Booking
  saving: boolean
  onClose: () => void
  onChangeStatus: (s: BookingStatus) => void
  onDelete: () => void
}) {
  const vehicle = VEHICLES[booking.vehicle]
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              {booking.customerName}
              <span className="ml-2 align-middle">
                <StatusBadge status={booking.status} />
              </span>
            </h2>
            <p className="text-xs text-ink-500">Nº {booking.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-ink-500 transition hover:bg-ink-800 hover:text-white"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Ruta" value={`${booking.pickup} → ${booking.dropoff}`} />
          <Row label="Fecha y hora" value={`${booking.tripDate} · ${booking.tripTime}`} />
          <Row
            label="Vehículo"
            value={`${vehicle.label} · ${booking.passengers} pasajeros · ${booking.luggage} equipajes`}
          />
          <Row label="Contacto" value={`${booking.customerPhone} · ${booking.customerEmail}`} />
          {booking.flightNumber && <Row label="Vuelo" value={booking.flightNumber} />}
          {booking.notes && <Row label="Notas" value={booking.notes} />}
          <Row label="Recibida" value={new Date(booking.createdAt).toLocaleString('es-US')} />
        </dl>

        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Cambiar estado
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                disabled={saving}
                onClick={() => onChangeStatus(s)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
                  booking.status === s
                    ? 'border-gold-400 bg-gold-400 text-ink-950'
                    : 'border-ink-600 bg-ink-800 text-ink-400 hover:border-gold-400/60 hover:text-gold-300'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
          <button
            onClick={onDelete}
            disabled={saving}
            className="rounded-lg border border-red-800/60 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/50 disabled:opacity-50"
          >
            Eliminar reserva
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </dt>
      <dd className="text-ink-400">{value}</dd>
    </div>
  )
}
