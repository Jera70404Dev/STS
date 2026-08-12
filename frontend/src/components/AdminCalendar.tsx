import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3x3,
  List,
  RotateCw,
  Search,
} from 'lucide-react'
import { STATUS_LABELS, type Booking, type BookingStatus } from '../types'
import { Spinner, StatusBadge, inputClass } from './ui'

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

type View = 'week' | 'month' | 'day' | 'list'

const VIEWS: Array<{ id: View; label: string; icon: ReactNode }> = [
  { id: 'month', label: 'Mes', icon: <Calendar className="h-4 w-4" /> },
  { id: 'week', label: 'Semana', icon: <Grid3x3 className="h-4 w-4" /> },
  { id: 'day', label: 'Día', icon: <Clock className="h-4 w-4" /> },
  { id: 'list', label: 'Lista', icon: <List className="h-4 w-4" /> },
]

const STATUS_CHIP: Record<BookingStatus, string> = {
  pending: 'bg-amber-500 text-amber-50',
  confirmed: 'bg-blue-600 text-blue-50',
  completed: 'bg-green-600 text-green-50',
  cancelled: 'bg-ink-600 text-ink-300',
}

const STATUS_DOT: Record<BookingStatus, string> = {
  pending: 'bg-amber-400',
  confirmed: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-ink-500',
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6) // 06:00 – 23:00

function startOfWeek(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7))
  return copy
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

function monthGrid(cursor: Date): Date[] {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

function hourOf(booking: Booking): number {
  return Number(booking.tripTime.split(':')[0]) || 0
}

export interface AdminCalendarProps {
  bookings: Booking[]
  loading: boolean
  onRangeChange: (from: string, to: string) => void
  onSelectBooking: (booking: Booking) => void
  onRefresh: () => void
}

export default function AdminCalendar({
  bookings,
  loading,
  onRangeChange,
  onSelectBooking,
  onRefresh,
}: AdminCalendarProps) {
  const [view, setView] = useState<View>('week')
  const [cursor, setCursor] = useState(() => new Date())
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all')
  const [search, setSearch] = useState('')

  const today = toISODate(new Date())

  const range = useMemo(() => {
    if (view === 'list') return null
    if (view === 'month') {
      return {
        from: toISODate(new Date(cursor.getFullYear(), cursor.getMonth(), 1)),
        to: toISODate(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)),
      }
    }
    if (view === 'week') {
      const monday = startOfWeek(cursor)
      return { from: toISODate(monday), to: toISODate(addDays(monday, 6)) }
    }
    return { from: toISODate(cursor), to: toISODate(cursor) }
  }, [view, cursor])

  const lastRangeRef = useRef<string | null>(null)
  useEffect(() => {
    if (!range) return
    const key = `${range.from}|${range.to}`
    if (lastRangeRef.current === key) return
    lastRangeRef.current = key
    onRangeChange(range.from, range.to)
  }, [range, onRangeChange])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      if (q) {
        const hay = `${b.customerName} ${b.pickup} ${b.dropoff}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [bookings, statusFilter, search])

  const byDay = (date: Date) => visible.filter((b) => b.tripDate === toISODate(date))

  const title = (() => {
    if (view === 'month') {
      return capitalize(cursor.toLocaleDateString('es', { month: 'long', year: 'numeric' }))
    }
    if (view === 'week') {
      return `Semana del ${startOfWeek(cursor).toLocaleDateString('es', { day: 'numeric', month: 'short' })}`
    }
    if (view === 'day') {
      return capitalize(
        cursor.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      )
    }
    return 'Todas las reservas'
  })()

  function navigate(dir: 1 | -1) {
    setCursor((prev) => {
      const d = new Date(prev)
      if (view === 'month') d.setMonth(d.getMonth() + dir)
      else if (view === 'week') d.setDate(d.getDate() + 7 * dir)
      else d.setDate(d.getDate() + dir)
      return d
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-white sm:text-xl">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            disabled={view === 'list'}
            aria-label="Anterior"
            className="rounded-lg border border-white/15 p-2 text-white transition hover:border-gold-400/60 hover:text-gold-300 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            disabled={view === 'list'}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white transition hover:border-gold-400/60 hover:text-gold-300 disabled:opacity-40"
          >
            Hoy
          </button>
          <button
            onClick={() => navigate(1)}
            disabled={view === 'list'}
            aria-label="Siguiente"
            className="rounded-lg border border-white/15 p-2 text-white transition hover:border-gold-400/60 hover:text-gold-300 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-ink-900 p-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                view === v.id ? 'bg-gold-400 text-ink-950' : 'text-ink-400 hover:text-white'
              }`}
            >
              {v.icon}
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente o ruta…"
              className={`${inputClass} w-56 pl-9`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BookingStatus)}
            className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-white shadow-sm outline-none transition focus:border-gold-400"
          >
            <option value="all">Todos los estados</option>
            {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            onClick={onRefresh}
            aria-label="Refrescar"
            className="rounded-lg border border-white/15 p-2 text-white transition hover:border-gold-400/60 hover:text-gold-300"
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="relative">
        {view === 'month' && (
          <MonthView days={monthGrid(cursor)} cursor={cursor} today={today} byDay={byDay} onSelectBooking={onSelectBooking} />
        )}
        {view === 'week' && (
          <WeekView days={weekDays(cursor)} today={today} byDay={byDay} onSelectBooking={onSelectBooking} />
        )}
        {view === 'day' && <DayView cursor={cursor} byDay={byDay} onSelectBooking={onSelectBooking} />}
        {view === 'list' && <ListView bookings={visible} onSelectBooking={onSelectBooking} />}

        {visible.length === 0 && !loading && (
          <p className="py-10 text-center text-sm text-ink-500">No hay reservas en este rango.</p>
        )}

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-ink-950/60 backdrop-blur-[1px]">
            <Spinner className="h-7 w-7 text-gold-400" />
          </div>
        )}
      </div>
    </div>
  )
}

function weekDays(cursor: Date): Date[] {
  const monday = startOfWeek(cursor)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function EventChip({ booking, onSelect }: { booking: Booking; onSelect: (b: Booking) => void }) {
  return (
    <button
      onClick={() => onSelect(booking)}
      title={`${booking.customerName} · ${booking.pickup} → ${booking.dropoff}`}
      className={`block w-full truncate rounded px-1.5 py-1 text-left text-[11px] font-medium shadow-sm transition hover:brightness-110 ${STATUS_CHIP[booking.status]}`}
    >
      {booking.tripTime} · {booking.customerName}
    </button>
  )
}

function MonthView({
  days,
  cursor,
  today,
  byDay,
  onSelectBooking,
}: {
  days: Date[]
  cursor: Date
  today: string
  byDay: (date: Date) => Booking[]
  onSelectBooking: (b: Booking) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="grid grid-cols-7 gap-px border-b border-white/10 bg-white/5">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="bg-ink-900 py-2 text-center text-xs font-semibold uppercase tracking-wide text-ink-500"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-white/5">
        {days.map((day, i) => {
          const inMonth = day.getMonth() === cursor.getMonth()
          const isToday = toISODate(day) === today
          const items = byDay(day)
          return (
            <div
              key={i}
              className={`min-h-24 p-1.5 ${
                inMonth ? 'bg-ink-900' : 'bg-ink-950/70'
              } ${isToday ? 'ring-1 ring-inset ring-gold-400/40' : ''}`}
            >
              <div
                className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday ? 'bg-gold-400 font-bold text-ink-950' : inMonth ? 'text-white' : 'text-ink-600'
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {items.slice(0, 3).map((b) => (
                  <EventChip key={b.id} booking={b} onSelect={onSelectBooking} />
                ))}
                {items.length > 3 && <p className="text-[10px] text-ink-500">+{items.length - 3} más</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({
  days,
  today,
  byDay,
  onSelectBooking,
}: {
  days: Date[]
  today: string
  byDay: (date: Date) => Booking[]
  onSelectBooking: (b: Booking) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="grid grid-cols-7 gap-px border-b border-white/10 bg-white/5">
        {days.map((day) => (
          <div key={toISODate(day)} className="bg-ink-900 py-2 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              {day.toLocaleDateString('es', { weekday: 'short' })}
            </div>
            <div
              className={`mx-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                toISODate(day) === today ? 'bg-gold-400 font-bold text-ink-950' : 'text-white'
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-white/5">
        {days.map((day) => {
          const items = byDay(day)
          return (
            <div key={toISODate(day)} className="min-h-40 space-y-1 bg-ink-900 p-1.5">
              {items.length === 0 ? (
                <p className="px-1 pt-1 text-[10px] text-ink-600">Sin reservas</p>
              ) : (
                items.map((b) => <EventChip key={b.id} booking={b} onSelect={onSelectBooking} />)
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayView({
  cursor,
  byDay,
  onSelectBooking,
}: {
  cursor: Date
  byDay: (date: Date) => Booking[]
  onSelectBooking: (b: Booking) => void
}) {
  const items = byDay(cursor)
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
      {HOURS.map((h) => {
        const hourItems = items.filter((b) => hourOf(b) === h)
        return (
          <div key={h} className="flex border-b border-white/5 last:border-b-0">
            <div className="w-16 shrink-0 border-r border-white/5 py-2 pr-3 text-right text-[11px] text-ink-500">
              {String(h).padStart(2, '0')}:00
            </div>
            <div className="flex min-h-12 flex-1 flex-wrap items-start gap-1.5 p-1.5">
              {hourItems.map((b) => (
                <EventChip key={b.id} booking={b} onSelect={onSelectBooking} />
              ))}
              {hourItems.length === 0 && <span className="py-1 text-[10px] text-ink-600">—</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ListView({
  bookings,
  onSelectBooking,
}: {
  bookings: Booking[]
  onSelectBooking: (b: Booking) => void
}) {
  const sorted = [...bookings].sort((a, b) => `${a.tripDate} ${a.tripTime}`.localeCompare(`${b.tripDate} ${b.tripTime}`))
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900">
      {sorted.map((b) => (
        <button
          key={b.id}
          onClick={() => onSelectBooking(b)}
          className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition hover:bg-ink-800 last:border-b-0"
        >
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[b.status]}`} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{b.customerName}</p>
            <p className="truncate text-xs text-ink-400">
              {b.pickup} → {b.dropoff}
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-gold-300">{b.tripDate}</p>
            <p className="text-[11px] text-ink-500">{b.tripTime}</p>
          </div>
          <StatusBadge status={b.status} />
        </button>
      ))}
    </div>
  )
}
