import { useState } from 'react'
import type { Platform } from '../lib/types'
import { PLATFORM_META } from '../lib/platforms'

interface CategoryCardProps {
  platform: Platform
  count: number
  active?: boolean // la plataforma que se está viendo en el catálogo
  onClick?: () => void
}

export default function CategoryCard({ platform, count, active = false, onClick }: CategoryCardProps) {
  const meta = PLATFORM_META[platform]
  const Icon = meta.icon
  // Hover solo con mouse. En celular el logo depende de la plataforma
  // seleccionada (active), así que hacer scroll no lo activa por accidente
  // y al elegir otra plataforma el anterior se cierra solo.
  const [hovered, setHovered] = useState(false)
  const revealed = active || hovered

  return (
    <button
      onClick={onClick}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative text-left bg-surface border border-white/10 hover:border-white/20 transition-colors p-6 flex flex-col gap-3 min-h-[140px] overflow-hidden"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
    >
      <div
        className="absolute top-0 left-0 h-[3px] w-10 group-hover:w-full transition-all duration-300"
        style={{ backgroundColor: meta.accent }}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{meta.label}</span>
        <Icon className="w-5 h-5" style={{ color: meta.accent }} strokeWidth={1.75} />
      </div>
      <span className="font-display font-bold text-3xl" style={{ color: meta.accent }}>
        {meta.shortLabel}
      </span>
      <span className="text-sm text-text-secondary mt-auto">{count} juegos disponibles</span>

      {/* Reveal: aparece al pasar el mouse (o al tocar en celular).
          El fondo toma el color del propio logo, así la imagen se funde
          con la tarjeta sin bordes ni recortes. */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          revealed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: meta.logoBg }}
      >
        <img
          src={meta.logo}
          alt={meta.label}
          loading="lazy"
          draggable={false}
          className={`h-full w-auto max-w-full object-contain select-none transition-transform duration-500 ease-out ${
            revealed ? 'scale-100' : 'scale-90'
          }`}
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)',
          }}
        />
      </div>
    </button>
  )
}

