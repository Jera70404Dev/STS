import { BadgeCheck, Languages, ShieldCheck, Timer } from 'lucide-react'
import { CHAUFFEURS, CHAUFFEUR_VALUES, IMAGES } from '../content'
import { Avatar, PageHero, RatingStars, Reveal, SectionHeading } from '../components/ui'

export default function Chauffeurs() {
  return (
    <div>
      <PageHero
        eyebrow="Our Team"
        title="Our professional drivers — trained, licensed & courteous"
        subtitle="Every chauffeur is background-checked, licensed, uniformed and trained in defensive driving and hospitality. The face of your best experience."
        image={IMAGES.corporate}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {CHAUFFEURS.map((c, i) => (
            <Reveal key={c.name} delay={(i % 2) * 80}>
              <div className="flex h-full flex-col gap-5 rounded-2xl border border-white/10 bg-ink-900 p-6 sm:flex-row">
                <Avatar src={c.photo} alt={c.name} className="h-24 w-24 shrink-0" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-white">{c.name}</h3>
                    <RatingStars rating={c.rating} />
                  </div>
                  <p className="mt-0.5 text-sm text-gold-400">{c.specialty}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-ink-400">
                      <Timer className="h-3 w-3 text-gold-400" /> {c.years} yrs experience
                    </span>
                    <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-ink-400">
                      <Languages className="h-3 w-3 text-gold-400" /> {c.languages.join(' · ')}
                    </span>
                    {c.licenses.map((l) => (
                      <span
                        key={l}
                        className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-ink-400"
                      >
                        <BadgeCheck className="h-3 w-3 text-gold-400" /> {l}
                      </span>
                    ))}
                  </div>

                  <blockquote className="mt-4 border-l-2 border-gold-400 pl-3 text-sm italic leading-relaxed text-ink-400">
                    “{c.quote}”
                  </blockquote>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-ink-900/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Our standard"
              title="The caliber behind every ride"
              subtitle="Each chauffeur passes rigorous vetting before they ever pick up a key."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CHAUFFEUR_VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-900 p-6 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <Reveal>
          <div className="flex items-start gap-4 rounded-2xl border border-gold-400/25 bg-ink-900 p-6">
            <ShieldCheck className="h-8 w-8 shrink-0 text-gold-400" />
            <div>
              <h3 className="font-display text-xl font-semibold text-white">
                How your chauffeur is assigned
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                When you book, our dispatcher assigns the best-fit chauffeur for your trip — matched
                by vehicle type, language and experience. You’ll receive your chauffeur’s name and
                photo in the confirmation email, and can reach our 24/7 line at any point of the
                journey.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
