const BASE = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function getToken(): string | null {
  return localStorage.getItem('ta_token')
}

export function setToken(token: string): void {
  localStorage.setItem('ta_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('ta_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      (data && typeof data.error === 'string' && data.error) || 'Algo salió mal. Inténtalo de nuevo.'
    throw new ApiError(message, res.status, data?.details)
  }
  return data as T
}

export const api = {
  createBooking: (payload: unknown) =>
    request<{ booking: import('./types').Booking }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getBooking: (id: string) =>
    request<{ booking: import('./types').Booking }>(`/api/bookings/${id}`),

  login: (username: string, password: string) =>
    request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getBookings: (from: string, to: string) =>
    request<{ bookings: import('./types').Booking[] }>(
      `/api/admin/bookings?from=${from}&to=${to}`,
    ),

  updateStatus: (id: string, status: import('./types').BookingStatus) =>
    request<{ booking: import('./types').Booking }>(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteBooking: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/bookings/${id}`, { method: 'DELETE' }),
}
