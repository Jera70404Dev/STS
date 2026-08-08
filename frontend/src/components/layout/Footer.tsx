import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { BRAND, NAV_LINKS, SERVICES } from '../../content'

const SOCIALS = [
  {
    label: 'Facebook',
    path: 'M13.5 9H15V6h-2c-2 0-3.5 1.5-3.5 3.5V11H8v3h1.5v6h3v-6H15l.5-3h-3V9.5c0-.3.2-.5.5-.5Z',
  },
  {
    label: 'Instagram',
    path: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM12 16.2a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4ZM16.2 8.1a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8ZM12 5.8c-1.8 0-2 0-2.7.1-.7 0-1.2.1-1.6.3-.4.2-.8.4-1.1.8-.4.3-.6.7-.8 1.1-.2.4-.3.9-.3 1.6 0 .7-.1.9-.1 2.7s0 2 .1 2.7c0 .7.1 1.2.3 1.6.2.4.4.8.8 1.1.3.4.7.6 1.1.8.4.2.9.3 1.6.3.7 0 .9.1 2.7.1s2 0 2.7-.1c.7 0 1.2-.1 1.6-.3.4-.2.8-.4 1.1-.8.4-.3.6-.7.8-1.1.2-.4.3-.9.3-1.6 0-.7.1-.9.1-2.7s0-2-.1-2.7c0-.7-.1-1.2-.3-1.6a3 3 0 0 0-.8-1.1 3 3 0 0 0-1.1-.8c-.4-.2-.9-.3-1.6-.3-.7 0-.9-.1-2.7-.1Zm0-1.5c1.9 0 2.1 0 2.9.1.8.1 1.3.2 1.8.4.5.2 1 .5 1.4 1 .5.5.7 1 .1 1.4.2.5.3 1 .4 1.8.1.8.1 1 .1 2.9s0 2.1-.1 2.9c-.1.8-.2 1.3-.4 1.8-.2.5-.5 1-1 1.4-.5.5-1 .7-1.4 1-.5.2-1 .3-1.8.4-.8.1-1 .1-2.9.1s-2.1 0-2.9-.1c-.8-.1-1.3-.2-1.8-.4a3.7 3.7 0 0 1-1.4-1c-.5-.5-.7-1-1-1.4-.2-.5-.3-1-.4-1.8-.1-.8-.1-1-.1-2.9s0-2.1.1-2.9c.1-.8.2-1.3.4-1.8.2-.5.5-1 1-1.4.5-.5 1-.7 1.4-1 .5-.2 1-.3 1.8-.4.8-.1 1-.1 2.9-.1Z',
  },
  {
    label: 'X',
    path: 'M17.7 3h2.7l-6 6.8L21.5 21h-5.5l-4.3-5.6L6.6 21H3.9l6.4-7.3L3 3h5.6l3.9 5.1L17.7 3Zm-1 16.1h1.5L7.9 4.7H6.3l10.4 14.4Z',
  },
  {
    label: 'LinkedIn',
    path: 'M6.5 8.6H4v11h2.5v-11ZM5.2 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM14 8.6c-1.2 0-2.1.7-2.6 1.4V8.6H9v11h2.4v-5.8c0-1 .2-2 1.5-2 1.3 0 1.6 1 1.6 2v5.8H17v-6.6c0-2.4-.5-4.2-3-4.2Z',
  },
]

const SERVICE_LINKS = SERVICES.map((s) => ({
  label: s.title,
  to: '/services',
}))

const COMPANY_LINKS = [
  ...NAV_LINKS.filter((l) => l.to !== '/'),
  { label: 'Reservations', to: '/reserve' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-400/60 bg-ink-950 font-display text-xl font-bold text-gold-400">
                S
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-semibold text-white">
                  Secure Transportation
                </span>
                <span className="block text-[11px] uppercase tracking-[0.25em] text-gold-400">
                  Miami · FL
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">
              Luxury and reliable chauffeured transportation across {BRAND.city}. Your journey,
              your space — every single ride.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="rounded-full border border-white/10 p-2 text-ink-400 transition hover:border-gold-400/60 hover:text-gold-300"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ink-400 transition hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ink-400 transition hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                {BRAND.address}
              </li>
              <li>
                <a href={BRAND.phoneHref} className="flex items-center gap-2.5 hover:text-gold-300">
                  <Phone className="h-4 w-4 shrink-0 text-gold-400" /> {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2.5 hover:text-gold-300">
                  <Mail className="h-4 w-4 shrink-0 text-gold-400" /> {BRAND.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-lg border border-white/10 bg-ink-900 p-3">
              <p className="text-xs text-ink-500">
                {BRAND.usdot} · {BRAND.license} · {BRAND.insurance}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="transition hover:text-gold-300">
                {l.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-ink-600 transition hover:border-gold-400/40 hover:text-gold-300"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
