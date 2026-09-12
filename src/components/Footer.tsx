import { Instagram, Facebook, Music2 } from 'lucide-react'
import { STORE_CONFIG } from '../config/store'
import { LOGO_URL } from '../lib/assets'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt={STORE_CONFIG.name} className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="font-display font-bold leading-none">
              GAMEDIGITAL<span className="text-neon-cyan">_LC</span>
            </p>
            <p className="text-xs text-text-secondary mt-1">{STORE_CONFIG.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={STORE_CONFIG.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-neon-magenta transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href={STORE_CONFIG.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-neon-cyan transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href={STORE_CONFIG.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-neon-green transition-colors"
            aria-label="TikTok"
          >
            <Music2 className="w-5 h-5" />
          </a>
        </div>

        <p className="text-xs text-text-secondary">
          © {new Date().getFullYear()} {STORE_CONFIG.name}. Todos los derechos reservados.
        </p>
      </div>

      <div className="border-t border-white/5 py-4">
        <p className="text-center text-[11px] text-text-secondary">
          Developed by Electronics and Telecommunications Engineer Luis Coral
        </p>
      </div>
    </footer>
  )
}
