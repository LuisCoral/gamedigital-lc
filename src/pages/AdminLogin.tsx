import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { LOGO_URL } from '../lib/assets'

export default function AdminLogin() {
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string })?.from ?? '/admin'

  if (isAuthenticated) {
    navigate(from, { replace: true })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error } = await signIn(email, password)

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setSubmitting(false)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src={LOGO_URL} alt="GAMEDIGITAL_LC" className="w-14 h-14 rounded-full object-cover" />
          <h1 className="font-display font-bold text-xl">
            GAMEDIGITAL<span className="text-neon-cyan">_LC</span>
          </h1>
          <p className="text-text-secondary text-sm">Panel administrativo</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-white/10 rounded-xl p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs text-text-secondary">
              Correo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                placeholder="admin@gamedigital.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs text-text-secondary">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-xs text-neon-magenta">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-neon-cyan text-bg font-semibold rounded-lg py-2.5 text-sm hover:brightness-110 disabled:opacity-50 transition"
          >
            {submitting ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-6">
          Acceso exclusivo para el administrador de la tienda.
        </p>
      </div>
    </div>
  )
}
