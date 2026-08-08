import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
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

export default function Home() {
  return (
    <div>
      <Hero />
      <QuickBooking />
      <TrustBar />
      <FeaturedServices />
      <WhyUs />
      <FleetPreview />
      <ChauffeurTeaser />
      <Testimonials />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/10 to-ink-950/80" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-32">
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                Miami · Fort Lauderdale · Palm Beach
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
                {HERO.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-400">{HERO.subtitle}</p>
            </Reveal>
          </div>

          <div className="hidden justify-center lg:flex">
            <Reveal delay={120}>
              <motion.div
                animate={{ y: [0, -16, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 7, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-[420px] rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={IMAGES.heroCar}
                      alt="Executive vehicle"
                      className="h-64 w-full object-cover"
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

        <div className="flex flex-wrap items-center gap-4 pb-10 pt-10">
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
    <section className="relative z-10 mx-auto max-w-6xl px-4">
      <Reveal>
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-ink-900/95 p-6 shadow-card backdrop-blur-md sm:p-8"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-white">{QUICK_BOOK.title}</h2>
            <span className="hidden rounded-full border border-gold-400/40 px-3 py-1 text-xs text-gold-300 sm:block">
              {BRAND.googleRating} ★ on Google
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </section>
  )
}

function TrustBar() {
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-3 lg:grid-cols-5">
        {TRUST_BADGES.map((badge, i) => (
          <Reveal key={badge.title} delay={i * 60} className="flex items-start gap-3">
            <badge.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
            <div>
              <p className="text-sm font-semibold text-white">{badge.title}</p>
              <p className="mt-0.5 text-xs text-ink-500">{badge.text}</p>
            </div>
          </Reveal>
        ))}
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
  const trackRef = useRef<HTMLDivElement>(null)

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <SectionHeading
            center={false}
            eyebrow="Our fleet"
            title="A fleet built for the moment"
            subtitle="Spotless, modern and meticulously maintained — pick the ride that fits your party."
          />
        </Reveal>
        <Reveal>
          <div className="flex gap-3">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous vehicles"
              className="rounded-full border border-white/15 p-2.5 text-white transition hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next vehicles"
              className="rounded-full border border-white/15 p-2.5 text-white transition hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 scrollbar-none"
      >
        {FLEET.map((v) => (
          <Link
            key={v.id}
            to={`/fleet?v=${v.id}`}
            className="group w-72 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-ink-900 transition hover:border-gold-400/50 hover:shadow-glow"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={v.image}
                alt={v.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-2.5 py-1 text-xs font-medium text-gold-300">
                {v.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-white">{v.name}</h3>
              <p className="mt-1.5 text-xs text-ink-400">
                {v.passengers} passengers · {v.luggage} suitcases
                {v.price ? ` · from $${v.price}` : ' · on request'}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400">
                View details
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

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
  const [index, setIndex] = useState(0)
  const count = TESTIMONIALS.length

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(t)
  }, [count])

  const t = TESTIMONIALS[index]

  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Testimonials"
          title="What riders say about us"
        />
      </Reveal>
      <Reveal delay={80}>
        <div className="mt-12 rounded-2xl border border-white/10 bg-ink-900 p-8 text-center shadow-card sm:p-12">
          <Quote className="mx-auto h-8 w-8 text-gold-400" />
          <p className="mt-6 font-display text-xl font-medium leading-relaxed text-white sm:text-2xl">
            “{t.text}”
          </p>
          <div className="mt-6 flex flex-col items-center gap-1.5">
            <RatingStars rating={t.rating} />
            <p className="mt-2 font-semibold text-white">{t.name}</p>
            <p className="text-sm text-ink-500">{t.location}</p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setIndex((index - 1 + count) % count)}
              aria-label="Previous testimonial"
              className="rounded-full border border-white/15 p-2 text-white transition hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition ${
                    i === index ? 'bg-gold-400' : 'bg-ink-600 hover:bg-ink-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex((index + 1) % count)}
              aria-label="Next testimonial"
              className="rounded-full border border-white/15 p-2 text-white transition hover:border-gold-400/60 hover:text-gold-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
