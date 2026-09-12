import { useNavigate } from 'react-router-dom'
import { Star, Plus } from 'lucide-react'
import type { Product } from '../lib/types'
import { PLATFORM_META } from '../lib/platforms'
import { formatPrice } from '../utils/formatPrice'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const meta = PLATFORM_META[product.platform]
  const accent = meta.accent
  const Icon = meta.icon
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/juego/${product.slug}`)}
      className="group bg-surface border border-white/10 hover:border-white/20 rounded-lg overflow-hidden flex flex-col transition-colors cursor-pointer"
    >
      <div
        className="relative h-52 sm:h-56 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${accent}22 0%, #0D0D0D 70%)`,
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain"
          />
        ) : (
          <Icon
            className="w-14 h-14 opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all"
            style={{ color: accent }}
            strokeWidth={1.25}
          />
        )}

        {product.featured && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-bg/80 backdrop-blur px-2 py-1 rounded-full text-[11px] text-neon-cyan">
            <Star className="w-3 h-3 fill-neon-cyan" />
            Destacado
          </span>
        )}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-neon-magenta text-bg text-[11px] font-semibold px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-bg/70 flex items-center justify-center">
            <span className="text-xs text-text-secondary border border-white/20 rounded-full px-3 py-1">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <span className="text-[11px]" style={{ color: accent }}>
          {meta.shortLabel}
        </span>
        <h3 className="text-sm font-medium leading-snug line-clamp-2">{product.name}</h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-text-secondary line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart?.(product)
            }}
            disabled={!product.available}
            className="p-2 rounded-full bg-bg border border-white/10 hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Agregar al carrito"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
