export const VEHICLES = {
  sedan: {
    label: 'Sedán',
    capacity: 4,
    price: 50,
    description: 'Ideal para 1-4 pasajeros, aeropuerto y ciudad.',
  },
  suv: {
    label: 'SUV',
    capacity: 6,
    price: 75,
    description: 'Espacio extra y comodidad para 1-6 pasajeros.',
  },
  van: {
    label: 'Van',
    capacity: 12,
    price: 110,
    description: 'Perfecta para grupos y equipaje grande.',
  },
  bus: {
    label: 'Bus',
    capacity: 30,
    price: 220,
    description: 'Para grupos grandes, eventos y excursiones.',
  },
} as const

export type VehicleKey = keyof typeof VEHICLES
export const VEHICLE_KEYS = Object.keys(VEHICLES) as VehicleKey[]
