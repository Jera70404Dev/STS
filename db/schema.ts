import { pgTable, pgEnum, uuid, text, date, time, integer, timestamp } from 'drizzle-orm/pg-core'

export const bookingStatus = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
])

export const vehicleType = pgEnum('vehicle_type', ['sedan', 'suv', 'van', 'bus'])

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  pickup: text('pickup').notNull(),
  dropoff: text('dropoff').notNull(),
  tripDate: date('trip_date').notNull(),
  tripTime: time('trip_time').notNull(),
  passengers: integer('passengers').notNull().default(1),
  luggage: integer('luggage').notNull().default(0),
  vehicle: vehicleType('vehicle').notNull().default('sedan'),
  flightNumber: text('flight_number'),
  notes: text('notes'),
  status: bookingStatus('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type Admin = typeof admins.$inferSelect
