import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, LayoutDashboard, Gamepad } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { LOGO_URL } from '../../lib/assets'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut, session } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="GAMEDIGITAL_LC" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-display font-bold">
              GAMEDIGITAL<span className="text-neon-cyan">_LC</span>
            </span>
            <span className="text-xs text-text-secondary border border-white/10 rounded-full px-2 py-0.5 ml-1">
              admin
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs text-text-secondary hidden sm:inline">
              {session?.user.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-neon-magenta transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl w-full mx-auto flex flex-1">
        <nav className="w-48 shrink-0 border-r border-white/5 px-4 py-6 hidden sm:flex flex-col gap-1">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/admin/productos"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
          >
            <Gamepad className="w-4 h-4" />
            Juegos
          </Link>
        </nav>

        <main className="flex-1 px-5 py-8">{children}</main>
      </div>
    </div>
  )
}
