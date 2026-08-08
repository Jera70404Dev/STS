import BookingForm from '../components/BookingForm'

const FEATURES = [
  { title: 'Aeropuertos', text: 'Traslados a todos los aeropuertos principales de EE. UU.' },
  { title: 'Precios fijos', text: 'Cotización clara por tipo de vehículo, sin sorpresas.' },
  { title: 'Conductores profesionales', text: 'Equipo verificado, puntual y bilingüe.' },
  { title: '24/7', text: 'Reservas y asistencia en cualquier momento.' },
]

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Transporte privado en todo Estados Unidos
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              Reserva tu viaje en línea en menos de un minuto. Te confirmamos por correo y llegamos
              puntuales.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                  <div className="font-semibold">{f.title}</div>
                  <div className="mt-1 text-sm text-brand-100">{f.text}</div>
                </div>
              ))}
            </div>
          </div>
          <BookingForm />
        </div>
      </section>
    </div>
  )
}
