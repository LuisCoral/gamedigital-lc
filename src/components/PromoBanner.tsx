import { Gift } from 'lucide-react'

// Mensaje de promoción. Para cambiarlo, edita solo estas dos líneas.
const PROMO_BADGE = '4x1'
const PROMO_TEXT = '¡PROMO en todos los juegos de Nintendo Switch! Aprovecha el 4x1'

function TickerGroup() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span>{PROMO_TEXT}</span>
          <span className="text-white/60">✦</span>
        </span>
      ))}
    </div>
  )
}

export default function PromoBanner() {
  return (
    <div className="max-w-6xl mx-auto px-5 pt-5">
      <div
        role="note"
        aria-label={`${PROMO_BADGE}: ${PROMO_TEXT}`}
        className="promo-glow relative overflow-hidden rounded-xl border border-white/15 bg-gradient-to-r from-[#B3000C] via-[#E4000F] to-[#B3000C] shadow-lg"
      >
        {/* Brillo que cruza el banner */}
        <div className="promo-shine pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative flex items-center gap-3 sm:gap-4 py-2.5 pl-3 sm:pl-4">
          <span className="promo-pulse shrink-0 flex items-center gap-1.5 rounded-lg bg-white text-[#E4000F] font-display font-bold text-lg sm:text-xl leading-none px-2.5 py-1.5 shadow">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            {PROMO_BADGE}
          </span>

          {/* Texto que se desplaza; con "reducir movimiento" queda quieto */}
          <div className="promo-mask min-w-0 flex-1 overflow-hidden text-sm sm:text-base font-semibold text-white">
            <div className="promo-marquee flex w-max">
              <TickerGroup />
              <TickerGroup />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
