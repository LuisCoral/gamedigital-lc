import { useState } from 'react'
import type { Platform } from '../lib/types'
import { PLATFORM_META } from '../lib/platforms'

interface CategoryCardProps {
  platform: Platform
  count: number
  onClick?: () => void
}

export default function CategoryCard({ platform, count, onClick }: CategoryCardProps) {
  const meta = PLATFORM_META[platform]
  const Icon = meta.icon
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onTouchStart={() => setRevealed((v) => !v)}
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

      {/* Reveal: aparece al pasar el mouse (o al tocar en celular) */}
      <div
        className={`absolute inset-0 flex items-center justify-center px-4 text-center transition-all duration-300 ${
          revealed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: `linear-gradient(160deg, ${meta.accent}ee 0%, #050505ee 100%)`,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
          <span className="font-display font-bold text-2xl text-white leading-tight">
            {meta.label}
          </span>
        </div>
      </div>
    </button>
  )
}

