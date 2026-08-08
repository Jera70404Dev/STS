import {
  BRAND,
  CERTIFICATIONS,
  IMAGES,
  LEADERSHIP,
  MISSION,
  TIMELINE,
  VALUES,
  VISION,
} from '../content'
import { Button, PageHero, Reveal, SectionHeading } from '../components/ui'

export default function About() {
  return (
    <div>
      <PageHero
        eyebrow="About Us"
        title="The story behind the ride"
        subtitle={`Founded in Miami with one sedan and a promise of punctuality. Today, ${BRAND.shortName} is a fleet of 50+ vehicles trusted by travelers and businesses across Florida.`}
        image={IMAGES.aboutTeam}
      />
      <Story />
      <MissionValues />
      <Leadership />
      <Certifications />
    </div>
  )
}

function Story() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Our history"
          title="Fifteen years of arriving on time"
        />
      </Reveal>
      <div className="relative mt-14 ml-4 border-l border-gold-400/30 pl-8">
        {TIMELINE.map((m, i) => (
          <Reveal key={m.year} delay={i * 80} className="relative pb-12 last:pb-0">
            <span className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gold-400/50 bg-ink-950">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
            </span>
            <p className="font-display text-2xl font-semibold text-gold-400">{m.year}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{m.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-400">{m.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function MissionValues() {
  return (
    <section className="border-y border-white/5 bg-ink-900/50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-ink-900 p-8">
              <h3 className="font-display text-2xl font-semibold text-white">Our Mission</h3>
              <p className="mt-3 leading-relaxed text-ink-400">{MISSION}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border border-white/10 bg-ink-900 p-8">
              <h3 className="font-display text-2xl font-semibold text-white">Our Vision</h3>
              <p className="mt-3 leading-relaxed text-ink-400">{VISION}</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <Reveal>
            <SectionHeading eyebrow="Values" title="What we stand for" />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-900 p-6 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm text-ink-400">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Leadership() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <img
            src={IMAGES.aboutBuilding}
            alt="Secure Transportation office"
            loading="lazy"
            className="h-[420px] w-full rounded-2xl object-cover"
          />
          <div className="absolute -bottom-5 -right-5 hidden max-w-xs rounded-2xl border border-gold-400/30 bg-ink-950 p-6 shadow-glow sm:block">
            <p className="font-display text-2xl font-semibold text-gold-400">50+</p>
            <p className="mt-1 text-xs text-ink-400">vehicles ready across South Florida</p>
          </div>
        </Reveal>
        <Reveal delay={100} className="order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
            Leadership
          </p>
          <blockquote className="mt-4 font-display text-2xl font-medium leading-snug text-white">
            “{LEADERSHIP.quote}”
          </blockquote>
          <p className="mt-6 font-semibold text-white">{LEADERSHIP.name}</p>
          <p className="text-sm text-ink-400">{LEADERSHIP.role}</p>
          <Button to="/chauffeurs" variant="dark" className="mt-8">
            Meet the drivers
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

function Certifications() {
  return (
    <section className="border-t border-white/5 bg-ink-900/50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading
            eyebrow="Trust & compliance"
            title="Certified, licensed, insured"
            subtitle="Every mile is covered — by regulation, by insurance and by a team that reports to you, not the clock."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATIONS.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-white/10 bg-ink-900 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-400">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
