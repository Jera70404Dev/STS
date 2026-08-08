import { BRAND, LEGAL_UPDATED } from '../content'
import { PageHero } from '../components/ui'

const SECTIONS = [
  {
    title: '1. Agreement to Terms',
    body: [
      `These Terms of Service govern your use of the ${BRAND.name} website and the booking of chauffeured transportation services. By reserving a ride you agree to these terms.`,
    ],
  },
  {
    title: '2. Our Services',
    body: [
      'We provide chauffeured ground transportation across the Miami metro area and, on request, longer interstate routes. All vehicles are licensed, insured and operated by professional, vetted chauffeurs.',
    ],
  },
  {
    title: '3. Reservations & Pricing',
    body: [
      'Reservations are requests and are subject to availability. Prices shown are estimates; your final quote is confirmed by email before any charge is made. The confirmed rate includes all applicable taxes and gratuity for the chauffeur.',
    ],
  },
  {
    title: '4. Cancellations & Changes',
    body: [
      'You may cancel or modify a reservation by contacting us at least 12 hours before the scheduled pickup without penalty. Cancellations within 12 hours may incur a fee equal to one hour of service.',
    ],
  },
  {
    title: '5. Your Responsibilities',
    body: [
      'You agree to provide accurate pickup information and to be ready at the scheduled time. The vehicle wait time for airport pickups is included per the airport transfer terms; additional waiting time is billed at the hourly rate.',
    ],
  },
  {
    title: '6. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, our liability is limited to the amount paid for the affected trip. We are not liable for delays caused by traffic, weather or circumstances beyond our reasonable control.',
    ],
  },
  {
    title: '7. Governing Law',
    body: [
      'These terms are governed by the laws of the State of Florida, without regard to conflict of law provisions.',
    ],
  },
  {
    title: '8. Changes to These Terms',
    body: [
      'We may update these terms from time to time. The latest version will always be published on this page with its effective date.',
    ],
  },
  {
    title: '9. Contact',
    body: [
      `Questions about these terms? Email ${BRAND.email} or call ${BRAND.phone}.`,
    ],
  },
]

export default function Terms() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The rules of the road for using our website and reserving our transportation services."
      />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-ink-500">{LEGAL_UPDATED}</p>
        <div className="mt-8 space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-2xl font-semibold text-white">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 leading-relaxed text-ink-400">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
