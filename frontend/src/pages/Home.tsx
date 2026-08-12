import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import {
  BRAND,
  CHAUFFEURS,
  FEATURED_SERVICES,
  FLEET,
  HERO,
  IMAGES,
  QUICK_BOOK,
  SERVICES,
  TESTIMONIALS,
  TRUST_BADGES,
  USPS,
} from '../content'
import { Button, Reveal, RatingStars, Avatar, SectionHeading, inputClass, labelClass } from '../components/ui'
import CardFanCarousel from '../components/card-fan-carousel'
import { usePrefersReducedMotion } from '../hooks'

export default function Home() {
  return (
    <div>
      <Hero />
      <QuickBooking />
      <FeaturedServices />
      <WhyUs />
      <FleetPreview />
      <ChauffeurTeaser />
      <Testimonials />
    </div>
  )
}

function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/10 to-ink-950/80" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-24 lg:max-w-[1500px]">
        <div className="grid flex-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl xl:text-6xl">
                {HERO.title}
              </h1>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                Miami · Fort Lauderdale · Palm Beach
              </p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-400">{HERO.subtitle}</p>
            </Reveal>
          </div>

          <div className="hidden justify-center lg:flex lg:-translate-y-5">
            <Reveal delay={120}>
              <motion.div
                animate={reducedMotion ? undefined : { y: [0, -16, 0], rotate: [0, 1.5, 0] }}
                transition={
                  reducedMotion
                    ? undefined
                    : { duration: 7, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }
                }
              >
                <div className="flex h-[min(800px,calc(100vh_-_240px))] w-full max-w-[850px] flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
                  <div className="relative flex-1 overflow-hidden rounded-2xl">
                    <img
                      src={IMAGES.heroCar}
                      alt="Executive vehicle"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-semibold text-white">
                        Signature Executive Ride
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">Available 24/7 · Miami · FL</p>
                    </div>
                    <Button to="/reserve" variant="outline" className="px-4 py-2 text-xs">
                      Book
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pb-8 pt-8">
          <Button to="/reserve" className="px-8 py-4 text-base">
            Reserve Now <ArrowRight className="h-4 w-4" />
          </Button>
          <Button to="/fleet" variant="outline" className="px-8 py-4 text-base">
            Our Fleet
          </Button>
        </div>
      </div>
    </section>
  )
}

function QuickBooking() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    service: 'airport',
    date: today,
    time: '',
    passengers: 2,
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const qs = new URLSearchParams()
    qs.set('service', form.service)
    if (form.date) qs.set('date', form.date)
    if (form.time) qs.set('time', form.time)
    qs.set('passengers', String(form.passengers))
    navigate(`/reserve?${qs.toString()}`)
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 lg:max-w-[1500px] lg:py-20">
      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <form
            onSubmit={onSubmit}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink-900/95 p-6 shadow-card backdrop-blur-md sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-white">{QUICK_BOOK.title}</h2>
              <span className="hidden rounded-full border border-gold-400/40 px-3 py-1 text-xs text-gold-300 sm:block">
                {BRAND.googleRating} ★ on Google
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="qb-service">
                Service
              </label>
              <select
                id="qb-service"
                className={inputClass}
                value={form.service}
                onChange={(e) => set('service', e.target.value)}
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-date">
                Pickup date
              </label>
              <input
                id="qb-date"
                type="date"
                className={inputClass}
                value={form.date}
                min={today}
                onChange={(e) => set('date', e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-time">
                Pickup time
              </label>
              <input
                id="qb-time"
                type="time"
                className={inputClass}
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="qb-pax">
                Passengers
              </label>
              <input
                id="qb-pax"
                type="number"
                min={1}
                max={50}
                className={inputClass}
                value={form.passengers}
                onChange={(e) => set('passengers', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Button type="submit" className="w-full px-8 sm:w-auto">
              {QUICK_BOOK.button} <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-ink-500">{QUICK_BOOK.note}</p>
          </div>
          </form>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-center gap-6 rounded-2xl border border-white/10 bg-ink-900/50 p-6 shadow-card backdrop-blur-md sm:p-8">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                  <badge.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{badge.title}</p>
                  <p className="mt-0.5 text-sm text-ink-400">{badge.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FeaturedServices() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal>
        <SectionHeading
          eyebrow="What we offer"
          title="Transportation for every occasion"
          subtitle="From single airport transfers to full event logistics — one trusted team, one flawless standard."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <Link
              to="/services"
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-ink-900 p-6 transition hover:border-gold-400/50 hover:shadow-glow"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400">{s.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400">
                Learn more
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-ink-900/50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                Why choose us
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
                You arrive calm. You arrive on time. Every time.
              </h2>
              <p className="mt-4 leading-relaxed text-ink-400">
                Fifteen years of service built on one promise — treat every rider’s time as sacred.
                Here is what that means on the ground.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {USPS.map((usp, i) => (
                  <Reveal key={usp.title} delay={i * 60}>
                    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-ink-900 p-4">
                      <usp.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                      <div>
                        <p className="text-sm font-semibold text-white">{usp.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-400">{usp.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative">
            <img
              src={IMAGES.heroCar}
              alt="Executive vehicle"
              loading="lazy"
              className="h-[520px] w-full rounded-2xl object-cover"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-gold-400/30 bg-ink-950 p-5 shadow-glow sm:block">
              <p className="font-display text-4xl font-semibold text-gold-400">{BRAND.googleRating}★</p>
              <p className="mt-1 text-xs text-ink-400">Google rating from 1,200+ rides</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function FleetPreview() {
  const fanCards = useMemo(
    () =>
      FLEET.map((v) => ({
        imgUrl: v.image,
        alt: v.name,
        linkUrl: `/fleet?v=${v.id}`,
        title: v.name,
        subtitle: v.category,
      })),
    []
  )

  return (
    <section className="mx-auto max-w-6xl overflow-x-clip px-4 py-20">
      <Reveal>
        <SectionHeading
          center={false}
          eyebrow="Our fleet"
          title="A fleet built for the moment"
          subtitle="Spotless, modern and meticulously maintained — pick the ride that fits your party."
        />
      </Reveal>

      <CardFanCarousel cards={fanCards} />

      <div className="mt-10 text-center">
        <Button to="/fleet" variant="dark">
          Explore the Full Fleet <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

function ChauffeurTeaser() {
  const featured = CHAUFFEURS.slice(0, 3)
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-ink-900/50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading
            eyebrow="Meet the team"
            title="Professional chauffeurs you can trust"
            subtitle="Your safety and comfort, our priority."
          />
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {featured.map((c, i) => (
            <Reveal key={c.name} delay={i * 90} className="text-center">
              <Avatar src={c.photo} alt={c.name} className="mx-auto h-28 w-28" />
              <h3 className="mt-4 font-display text-xl font-semibold text-white">{c.name}</h3>
              <p className="mt-1 text-sm text-gold-400">{c.specialty}</p>
              <RatingStars rating={c.rating} className="mt-2 justify-center" />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button to="/chauffeurs" variant="dark">
            Meet the Team <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const columns = useMemo(
    () => [0, 1, 2].map((col) => TESTIMONIALS.filter((_, i) => i % 3 === col)),
    []
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Testimonials"
          title="What riders say about us"
          subtitle="Real reviews from business travelers, wedding parties and locals across South Florida."
        />
      </Reveal>
      <Reveal delay={80}>
        <div className="testimonials-marquee">
          {columns.map((items, col) => (
            <div key={col} className="testimonials-column">
              <div className="testimonials-column-inner">
                {[...items, ...items].map((t, i) => (
                  <TestimonialCard key={`${t.name}-${i}`} t={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <article className="w-full max-w-[320px] rounded-2xl border border-white/10 bg-ink-900 p-10 shadow-card">
      <RatingStars rating={t.rating} className="mb-5" />
      <p className="text-[0.95rem] leading-[1.7] text-white">“{t.text}”</p>
      <div className="mt-5 flex items-center gap-3">
        <Avatar src={t.photo} alt={t.name} className="h-10 w-10" />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-white">{t.name}</p>
          <p className="mt-0.5 text-xs leading-snug text-ink-500">{t.location}</p>
        </div>
      </div>
    </article>
  )
}
