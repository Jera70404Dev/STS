import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { BRAND, FLEET, type FleetItem } from '../content'
import { Button, PageHero, Reveal } from '../components/ui'

const CATEGORIES = ['All', ...Array.from(new Set(FLEET.map((v) => v.category)))]

export default function Fleet() {
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(params.get('v'))

  const filtered = useMemo(
    () => (category === 'All' ? FLEET : FLEET.filter((v) => v.category === category)),
    [category],
  )
  const selected = FLEET.find((v) => v.id === selectedId) ?? null

  useEffect(() => {
    if (selectedId) {
      const next = new URLSearchParams(params)
      next.set('v', selectedId)
      setParams(next, { replace: true })
    }
  }, [selectedId, params, setParams])

  function close() {
    setSelectedId(null)
    const next = new URLSearchParams(params)
    next.delete('v')
    setParams(next, { replace: true })
  }

  return (
    <div>
      <PageHero
        eyebrow="Our Fleet"
        title="Choose your ride"
        subtitle="Spotless, modern and meticulously maintained. Each vehicle is fully insured, equipped with amenities and driven only by professional chauffeurs."
        image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2000&q=80"
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                category === c
                  ? 'border-gold-400 bg-gold-400 text-ink-950'
                  : 'border-white/15 text-white/70 hover:border-gold-400/60 hover:text-gold-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 70}>
              <button
                onClick={() => setSelectedId(v.id)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900 text-left transition hover:border-gold-400/50 hover:shadow-glow"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-2.5 py-1 text-xs font-medium text-gold-300">
                    {v.category}
                  </span>
                  {v.price && (
                    <span className="absolute right-3 top-3 rounded-full bg-gold-400 px-2.5 py-1 text-xs font-bold text-ink-950">
                      from ${v.price}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-white">{v.name}</h3>
                  <p className="mt-1.5 text-xs text-ink-400">
                    {v.passengers} passengers · {v.luggage} suitcases
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {v.amenities.slice(0, 3).map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-ink-400"
                      >
                        {a}
                      </span>
                    ))}
                    {v.amenities.length > 3 && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-ink-500">
                        +{v.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400">
                    View details
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-gold-400/25 bg-ink-900 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Not sure which vehicle you need?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-400">
            Tell us your group size and luggage and we will suggest the perfect fit within minutes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Button to="/reserve">
              Reserve Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to={`mailto:${BRAND.email}`} variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {selected && <FleetModal item={selected} onClose={close} />}
    </div>
  )
}

function FleetModal({ item, onClose }: { item: FleetItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-ink-900 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-ink-950/80 p-2 text-white transition hover:text-gold-300"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="rounded-full bg-gold-400/90 px-2.5 py-1 text-xs font-bold text-ink-950">
              {item.category}
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">{item.name}</h2>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-sm leading-relaxed text-ink-400">{item.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {item.specs.map((s) => (
                <div key={s.label} className="rounded-lg border border-white/10 bg-ink-950/60 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-ink-500">{s.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            {item.quote && (
              <figure className="mt-5 rounded-xl border border-gold-400/25 bg-ink-950/60 p-4">
                <blockquote className="text-sm italic leading-relaxed text-ink-400">
                  “{item.quote.text}”
                </blockquote>
                <figcaption className="mt-2 text-xs font-semibold text-gold-300">
                  {item.quote.author}
                </figcaption>
              </figure>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Amenities
            </h3>
            <ul className="mt-3 space-y-2">
              {item.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-ink-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> {a}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-ink-950/60 p-4">
              <p className="text-sm text-ink-400">
                {item.passengers} passengers · {item.luggage} suitcases
              </p>
              {item.price ? (
                <p className="mt-1 font-display text-3xl font-semibold text-gold-400">
                  ${item.price}
                  <span className="text-sm font-normal text-ink-500"> / trip from</span>
                </p>
              ) : (
                <p className="mt-1 text-sm font-semibold text-gold-300">Pricing on request</p>
              )}
            </div>

            <Button
              to={`/reserve?vehicle=${item.vehicle}`}
              className="mt-5 w-full"
            >
              {item.bookable ? 'Reserve this vehicle' : 'Reserve a similar vehicle'}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-3 text-center text-xs text-ink-500">
              Fully insured · {BRAND.license}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
