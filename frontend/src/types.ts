export type VehicleKey = 'sedan' | 'suv' | 'van' | 'bus'

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Vehicle {
  label: string
  capacity: number
  price: number
  description: string
}

export const VEHICLES: Record<VehicleKey, Vehicle> = {
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
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickup: string
  dropoff: string
  tripDate: string
  tripTime: string
  passengers: number
  luggage: number
  vehicle: VehicleKey
  flightNumber: string | null
  notes: string | null
  status: BookingStatus
  createdAt: string
}

export interface CreateBookingPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  pickup: string
  dropoff: string
  tripDate: string
  tripTime: string
  passengers: number
  luggage: number
  vehicle: VehicleKey
  flightNumber?: string | null
  notes?: string | null
}
