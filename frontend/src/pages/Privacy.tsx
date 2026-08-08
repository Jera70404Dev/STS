import { BRAND, LEGAL_UPDATED } from '../content'
import { PageHero } from '../components/ui'

const SECTIONS = [
  {
    title: 'Introduction',
    body: [
      `${BRAND.name} ("we", "us") operates this website and the reservation service described on it. This Privacy Policy explains what personal data we collect, how we use it and the choices you have. By using our website or making a reservation, you agree to the practices described here.`,
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      'When you make a reservation we collect the details you provide: your name, email address, phone number, pickup and destination addresses, trip date and time, number of passengers, vehicle selection and any special requirements.',
      'We may also collect basic technical data such as your browser type and pages visited to keep the website secure and improve the experience.',
    ],
  },
  {
    title: 'How We Use Your Information',
    body: [
      'Your information is used to process and confirm your reservation, contact you about your trip, notify our chauffeur and dispatch team, and respond to your questions.',
      'We do not sell, rent or trade your personal information to third parties.',
    ],
  },
  {
    title: 'Cookies & Analytics',
    body: [
      'This website may use cookies and similar technologies for functionality and to understand how visitors use the site. You can disable cookies in your browser settings; the core reservation flow will continue to work.',
    ],
  },
  {
    title: 'Data Sharing',
    body: [
      'We share your trip details only with the people required to deliver it — your assigned chauffeur and our dispatch team — and with service providers that help us operate (for example, email delivery). All providers are bound to protect your data.',
    ],
  },
  {
    title: 'Your Rights',
    body: [
      'You may request access to, correction of, or deletion of your personal data at any time by contacting us at the address below. We will respond within 30 days.',
    ],
  },
  {
    title: 'Security',
    body: [
      'We use reasonable administrative and technical safeguards to protect your information. Payment details are handled exclusively by our confirmed-invoice process; we do not store credit card numbers on our servers.',
    ],
  },
  {
    title: 'Contact',
    body: [
      `For any privacy question or request, email ${BRAND.email} or write to ${BRAND.address}.`,
    ],
  },
]

export default function Privacy() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How Secure Transportation handles the personal information you share with us."
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
