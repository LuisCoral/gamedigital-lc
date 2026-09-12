import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { PLATFORM_META, PLATFORMS } from '../lib/platforms'
import { LOGO_URL } from '../lib/assets'

interface HeaderProps {
  cartCount?: number
  onSearch?: (value: string) => void
  onOpenCart?: () => void
}

export default function Header({ cartCount = 0, onSearch, onOpenCart }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={LOGO_URL} alt="GAMEDIGITAL_LC" className="w-10 h-10 rounded-full object-cover" />
          <span className="font-display font-bold text-xl tracking-wide leading-none hidden sm:inline">
            GAMEDIGITAL<span className="text-neon-cyan">_LC</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-text-secondary absolute left-3" />
          <input
            type="text"
            placeholder="Buscar un juego..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm placeholder:text-text-secondary focus:outline-none focus:border-neon-cyan/50 transition-colors"
          />
        </div>

        <nav className="hidden md:flex items-center gap-5 ml-auto">
          {PLATFORMS.map((platform) => (
            <a
              key={platform}
              href={`#${platform.toLowerCase()}`}
              className="text-sm text-text-secondary hover:text-neon-cyan transition-colors"
            >
              {PLATFORM_META[platform].shortLabel}
            </a>
          ))}
        </nav>

        <button
          className="relative p-2 rounded-full hover:bg-surface transition-colors md:ml-2"
          aria-label="Carrito"
          onClick={onOpenCart}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-neon-magenta text-[10px] leading-4 text-center font-semibold">
              {cartCount}
            </span>
          )}
        </button>

        <button
          className="md:hidden p-2 rounded-full hover:bg-surface transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/5 px-5 py-4 flex flex-col gap-4">
          <div className="flex items-center relative">
            <Search className="w-4 h-4 text-text-secondary absolute left-3" />
            <input
              type="text"
              placeholder="Buscar un juego..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm placeholder:text-text-secondary focus:outline-none focus:border-neon-cyan/50"
            />
          </div>
          {PLATFORMS.map((platform) => (
            <a
              key={platform}
              href={`#${platform.toLowerCase()}`}
              className="text-sm text-text-secondary hover:text-neon-cyan"
              onClick={() => setMenuOpen(false)}
            >
              {PLATFORM_META[platform].shortLabel}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
