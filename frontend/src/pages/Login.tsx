import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ApiError, getToken, setToken } from '../api'
import { ErrorBox, Spinner, inputClass, labelClass } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { token } = await api.login(username, password)
      setToken(token)
      navigate('/admin', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('No se pudo iniciar sesión.')
      setLoading(false)
    }
  }

  if (getToken()) {
    navigate('/admin', { replace: true })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
        <p className="mt-1 text-sm text-slate-500">Acceso exclusivo para el personal.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelClass} htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <ErrorBox message={error} />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white shadow hover:bg-brand-800 disabled:opacity-60"
          >
            {loading && <Spinner />}
            {loading ? 'Verificando…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
