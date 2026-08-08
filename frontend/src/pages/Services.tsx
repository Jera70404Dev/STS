import { useState } from 'react'
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react'
import { BRAND, IMAGES, SERVICES } from '../content'
import { Button, PageHero, Reveal, SectionHeading } from '../components/ui'

export default function Services() {
  const [openId, setOpenId] = useState<string | null>(SERVICES[0]?.id ?? null)

  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Everything you expect from a ride — and more"
        subtitle="Six ways to travel with us, each designed around your schedule, your group and your standards."
        image={IMAGES.hourly}
      />

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-4">
          {SERVICES.map((s, i) => {
            const open = openId === s.id
            return (
              <Reveal key={s.id} delay={i * 50}>
                <div
                  className={`overflow-hidden rounded-2xl border transition ${
                    open
                      ? 'border-gold-400/50 bg-ink-900 shadow-glow'
                      : 'border-white/10 bg-ink-900/70 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(open ? null : s.id)}
                    className="flex w-full items-center gap-4 p-6 text-left"
                    aria-expanded={open}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                      <s.icon className="h-6 w-6" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-xl font-semibold text-white">
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-400">{s.tagline}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gold-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {open && (
                    <div className="border-t border-white/10">
                      <div className="grid gap-6 p-6 sm:grid-cols-2">
                        <div>
                          <p className="text-sm leading-relaxed text-ink-400">{s.description}</p>
                          <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-400">
                            How it works
                          </h4>
                          <ul className="mt-3 space-y-2.5">
                            {s.howItWorks.map((step) => (
                              <li key={step} className="flex items-start gap-2.5 text-sm text-ink-400">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                                {step}
                              </li>
                            ))}
                          </ul>
                          {s.coverage && (
                            <p className="mt-5 text-xs text-ink-500">Coverage: {s.coverage}</p>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <img
                            src={s.image}
                            alt={s.title}
                            loading="lazy"
                            className="h-44 w-full flex-1 rounded-xl object-cover"
                          />
                          <div className="mt-4 flex flex-wrap gap-3">
                            <Button to={`/reserve?service=${s.id}`} className="flex-1">
                              Book Now <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button to={`mailto:${BRAND.email}`} variant="outline" className="flex-1">
                              Request a Quote
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="border-t border-white/5 bg-ink-900/50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Still deciding?"
              title="Tell us what you need — we’ll handle the rest"
              subtitle="Send a request and our team will reply within one business hour with a fixed quote."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-10 text-center">
              <Button to="/reserve" className="px-10 py-4 text-base">
                Start Your Reservation <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
