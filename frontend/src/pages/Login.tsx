import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-8 shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-center font-display text-2xl font-semibold text-white">
          Panel de administración
        </h1>
        <p className="mt-1 text-center text-sm text-ink-500">Acceso exclusivo para el personal.</p>
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-3 font-semibold text-ink-950 shadow-glow transition hover:bg-gold-300 disabled:opacity-60"
          >
            {loading && <Spinner />}
            {loading ? 'Verificando…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
