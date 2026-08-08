import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { STATUS_LABELS, type BookingStatus } from '../types'

export const inputClass =
  'w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2.5 text-sm text-white placeholder:text-ink-500 shadow-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20'

export const labelClass = 'mb-1 block text-sm font-medium text-ink-400'

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  )
}

export function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="rounded-lg border border-red-800/60 bg-red-950/50 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  )
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-slate-200 text-slate-600 border-slate-300',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

const BUTTON_VARIANTS: Record<string, string> = {
  primary: 'bg-gold-400 text-ink-950 shadow-glow hover:bg-gold-300',
  outline: 'border border-white/25 text-white hover:border-gold-400 hover:text-gold-300',
  dark: 'border border-white/10 bg-ink-800 text-white hover:border-gold-400/60 hover:text-gold-300',
  ghost: 'text-white/80 hover:text-gold-300',
}

type ButtonProps = {
  variant?: keyof typeof BUTTON_VARIANTS
  to?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  to,
  type,
  disabled,
  onClick,
  className = '',
  children,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${BUTTON_VARIANTS[variant]} ${className}`
  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ink-400">{subtitle}</p>}
    </div>
  )
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function RatingStars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= Math.round(rating) ? 'fill-gold-400 text-gold-400' : 'text-ink-600'}`}
        />
      ))}
    </div>
  )
}

export function Avatar({
  src,
  alt,
  className = 'h-24 w-24',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`rounded-full object-cover ring-2 ring-gold-400/50 ${className}`}
    />
  )
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  image?: string
}) {
  return (
    <section className="relative overflow-hidden">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/75 to-ink-950" />
        </>
      )}
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-40 sm:pb-20 sm:pt-48">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-400">{subtitle}</p>}
      </div>
    </section>
  )
}
