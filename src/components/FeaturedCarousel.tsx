import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Plus } from 'lucide-react'
import type { Product } from '../lib/types'
import { PLATFORM_META } from '../lib/platforms'
import { formatPrice } from '../utils/formatPrice'

interface FeaturedCarouselProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  autoAdvanceMs?: number
}

export default function FeaturedCarousel({
  products,
  onAddToCart,
  autoAdvanceMs = 4000,
}: FeaturedCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const navigate = useNavigate()
  const count = products.length
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (paused || count <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, autoAdvanceMs)
    return () => clearInterval(id)
  }, [paused, count, autoAdvanceMs])

  function goTo(i: number) {
    setIndex(((i % count) + count) % count)
  }

  // Deslizar con el dedo en celular: avanza o retrocede el carrusel, sin
  // que la página se desplace verticalmente mientras lo haces. Se usa un
  // listener nativo (no el de React) porque necesitamos poder bloquear
  // el scroll de la página con preventDefault() en cuanto detectamos que
  // el gesto es horizontal, y React marca sus eventos táctiles como
  // "passive" por defecto, lo que no permite hacer eso.
  useEffect(() => {
    const el = containerRef.current
    if (!el || count <= 1) return

    let startX = 0
    let startY = 0
    let isHorizontal: boolean | null = null // null = todavía no lo sabemos

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      isHorizontal = null
      setPaused(true)
    }

    function onTouchMove(e: TouchEvent) {
      const deltaX = e.touches[0].clientX - startX
      const deltaY = e.touches[0].clientY - startY

      if (isHorizontal === null && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
        isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)
      }

      // Ya sabemos que es un swipe horizontal: bloqueamos el scroll
      // vertical de la página mientras dura este gesto.
      if (isHorizontal) {
        e.preventDefault()
      }
    }

    function onTouchEnd(e: TouchEvent) {
      const deltaX = e.changedTouches[0].clientX - startX
      const SWIPE_THRESHOLD = 40

      if (isHorizontal) {
        if (deltaX > SWIPE_THRESHOLD) {
          goTo(index - 1)
        } else if (deltaX < -SWIPE_THRESHOLD) {
          goTo(index + 1)
        }
      }

      isHorizontal = null
      setPaused(false)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [index, count])

  if (count === 0) return null

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative h-[320px] sm:h-[400px] flex items-center justify-center select-none"
        style={{ perspective: '1400px', touchAction: 'pan-y' }}
      >
        {products.map((product, i) => {
          let offset = i - index
          if (offset > count / 2) offset -= count
          if (offset < -count / 2) offset += count

          const abs = Math.abs(offset)
          if (abs > 2) return null // como mucho 5 tarjetas visibles a la vez

          const meta = PLATFORM_META[product.platform]
          const Icon = meta.icon
          const isCenter = offset === 0

          const translateX = offset * 155
          const scale = isCenter ? 1 : abs === 1 ? 0.75 : 0.55
          const rotateY = isCenter ? 0 : offset > 0 ? -32 : 32
          const zIndex = 10 - abs
          const opacity = isCenter ? 1 : abs === 1 ? 0.65 : 0.3

          return (
            <div
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => (isCenter ? navigate(`/juego/${product.slug}`) : goTo(i))}
              className="absolute w-[190px] sm:w-[230px] cursor-pointer transition-all duration-500 ease-out"
              style={{
                transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
              }}
            >
              <div
                className="rounded-xl overflow-hidden border border-white/10 bg-surface"
                style={{
                  boxShadow: isCenter ? `0 25px 60px -15px ${meta.accent}66` : undefined,
                }}
              >
                <div
                  className="h-44 sm:h-52 flex items-center justify-center relative"
                  style={{ background: `linear-gradient(160deg, ${meta.accent}22 0%, #0D0D0D 70%)` }}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading={isCenter ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Icon className="w-12 h-12 opacity-30" style={{ color: meta.accent }} strokeWidth={1.25} />
                  )}
                  {isCenter && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-bg/80 backdrop-blur px-2 py-1 rounded-full text-[11px] text-neon-cyan">
                      <Star className="w-3 h-3 fill-neon-cyan" />
                      Destacado
                    </span>
                  )}
                  {isCenter && onAddToCart && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart(product)
                      }}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-bg/90 border border-white/10 hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                      aria-label="Agregar al carrito"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isCenter && (
                  <div className="p-3.5 text-left">
                    <span className="text-[11px]" style={{ color: meta.accent }}>
                      {meta.shortLabel}
                    </span>
                    <h3 className="text-sm font-medium leading-snug line-clamp-1">{product.name}</h3>
                    <p className="text-base font-semibold mt-1">{formatPrice(product.price)}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {count > 1 && (
        <>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => goTo(index - 1)}
              className="p-2 rounded-full bg-surface border border-white/10 hover:border-neon-cyan/50 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-neon-cyan' : 'w-1.5 bg-white/20'
                  }`}
                  aria-label={`Ir al destacado ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(index + 1)}
              className="p-2 rounded-full bg-surface border border-white/10 hover:border-neon-cyan/50 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
