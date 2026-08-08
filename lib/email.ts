import { Resend } from 'resend'
import { VEHICLES } from './vehicles.js'
import type { Booking } from '../db/schema.js'

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

const DEFAULT_FROM = 'Transport Agency <onboarding@resend.dev>'

function from(): string {
  return process.env.RESEND_FROM || DEFAULT_FROM
}

function escapeHtml(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function bookingSummary(b: Booking) {
  const vehicle = VEHICLES[b.vehicle as keyof typeof VEHICLES]?.label ?? b.vehicle
  return {
    id: b.id,
    name: b.customerName,
    email: b.customerEmail,
    phone: b.customerPhone,
    pickup: b.pickup,
    dropoff: b.dropoff,
    date: b.tripDate,
    time: b.tripTime,
    passengers: b.passengers,
    luggage: b.luggage,
    vehicle,
    flightNumber: b.flightNumber,
    notes: b.notes,
  }
}

function bookingHtml(b: Booking): string {
  const v = bookingSummary(b)
  const rows: Array<[string, string]> = [
    ['Cliente', `${escapeHtml(v.name)}<br/>${escapeHtml(v.email)}<br/>${escapeHtml(v.phone)}`],
    ['Origen', escapeHtml(v.pickup)],
    ['Destino', escapeHtml(v.dropoff)],
    ['Fecha y hora', `${v.date} a las ${v.time}`],
    ['Vehículo', `${escapeHtml(v.vehicle)} (${v.passengers} pasajeros, ${v.luggage} equipajes)`],
    ['Vuelo', v.flightNumber ? escapeHtml(v.flightNumber) : '—'],
    ['Notas', v.notes ? escapeHtml(v.notes) : '—'],
  ]
  const table = rows
    .map(
      ([k, val]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;white-space:nowrap;border-bottom:1px solid #eee">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${val}</td></tr>`,
    )
    .join('')
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111827">
    <div style="background:#1d4ed8;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0">
      <strong>Transport Agency — Nueva reserva #${v.id.slice(0, 8)}</strong>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:0 0 8px 8px">
      ${table}
    </table>
    <p style="color:#6b7280;font-size:12px;margin-top:12px">Recibido por el sistema de reservas.</p>
  </div>`
}

function confirmationHtml(b: Booking): string {
  const v = bookingSummary(b)
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111827">
    <div style="background:#1d4ed8;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0">
      <strong>Transport Agency — Reserva recibida</strong>
    </div>
    <div style="border:1px solid #eee;border-radius:0 0 8px 8px;padding:24px">
      <p>Hola <strong>${escapeHtml(v.name)}</strong>,</p>
      <p>Recibimos tu solicitud de transporte. Nuestro equipo la confirmará pronto por este correo.</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:4px 0;font-weight:600">Ruta</td><td>${escapeHtml(v.pickup)} → ${escapeHtml(v.dropoff)}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Fecha</td><td>${v.date} a las ${v.time}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Vehículo</td><td>${escapeHtml(v.vehicle)} · ${v.passengers} pasajeros</td></tr>
        <tr><td style="padding:4px 0;font-weight:600">Nº de reserva</td><td>${v.id}</td></tr>
      </table>
      <p style="color:#6b7280;font-size:13px">Ante cualquier duda contáctanos respondiendo a este correo.</p>
    </div>
  </div>`
}

async function send(to: string, subject: string, html: string): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.warn('RESEND_API_KEY no configurada, email no enviado:', subject)
    return false
  }
  const { error } = await resend.emails.send({ from: from(), to, subject, html })
  if (error) {
    console.error('Resend error:', error)
    return false
  }
  return true
}

export async function sendBookingNotification(b: Booking): Promise<void> {
  const to = process.env.ADMIN_NOTIFY_EMAIL
  if (!to) {
    console.warn('ADMIN_NOTIFY_EMAIL no configurada, no se notificó al jefe.')
    return
  }
  await send(to, `🚐 Nueva reserva: ${b.customerName} — ${b.tripDate}`, bookingHtml(b))
}

export async function sendConfirmationToClient(b: Booking): Promise<void> {
  await send(b.customerEmail, 'Tu reserva ha sido recibida — Transport Agency', confirmationHtml(b))
}
