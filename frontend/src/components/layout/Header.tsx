import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../../content'
import { Button } from '../ui'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-ink-950/90 backdrop-blur-md'
            : 'bg-gradient-to-b from-ink-950/80 to-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
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

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? 'text-gold-400' : 'text-white/80 hover:text-gold-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button to="/reserve" className="px-5 py-2.5">
              Reserve Now
            </Button>
          </nav>

          <button
            className="rounded-lg p-2 text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-white/10 bg-ink-950/95 px-4 pb-6 pt-3 backdrop-blur-md lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-ink-800 text-gold-400' : 'text-white/80 hover:bg-ink-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Button to="/reserve" className="mt-3" onClick={() => setOpen(false)}>
                Reserve Now
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
