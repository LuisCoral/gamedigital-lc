import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, ShoppingCart, Minus, Plus, Star } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import CartDrawer from '../components/CartDrawer'
import { useProduct } from '../hooks/useProduct'
import { useCart } from '../hooks/useCart'
import { PLATFORM_META } from '../lib/platforms'
import type { AccountType } from '../lib/types'
import { formatPrice } from '../utils/formatPrice'
import { buildProductWhatsAppMessage, buildWhatsAppLink } from '../utils/whatsapp'

export default function ProductDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(slug)
  const cart = useCart()

  const [accountType, setAccountType] = useState<AccountType>('principal')
  const [quantity, setQuantity] = useState(1)
  const [cartOpen, setCartOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />
        <p className="max-w-4xl mx-auto px-5 py-20 text-text-secondary text-sm">
          Cargando juego...
        </p>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />
        <div className="max-w-4xl mx-auto px-5 py-20 text-center">
          <p className="text-text-secondary text-sm mb-4">
            No encontramos este juego. Puede que ya no esté disponible.
          </p>
          <Link to="/" className="text-neon-cyan text-sm hover:underline">
            Volver al catálogo
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const meta = PLATFORM_META[product.platform]
  const accent = meta.accent
  const Icon = meta.icon
  const hasSecondary = !!product.priceSecondary
  const unitPrice =
    accountType === 'secundaria' && product.priceSecondary ? product.priceSecondary : product.price

  function handleAddToCart() {
    if (!product) return
    cart.addItem(product, accountType, quantity)
    setCartOpen(true)
  }

  const directWhatsAppLink = buildWhatsAppLink(
    buildProductWhatsAppMessage(product, accountType, quantity),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-5 py-8 w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-neon-cyan transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="relative h-72 sm:h-96 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${accent}22 0%, #0D0D0D 70%)` }}
          >
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} loading="eager" decoding="async" className="w-full h-full object-contain" />
            ) : (
              <Icon className="w-24 h-24 opacity-30" style={{ color: accent }} strokeWidth={1.25} />
            )}
            {product.featured && (
              <span className="absolute top-3 left-3 flex items-center gap-1 bg-bg/80 backdrop-blur px-2.5 py-1 rounded-full text-xs text-neon-cyan">
                <Star className="w-3.5 h-3.5 fill-neon-cyan" />
                Destacado
              </span>
            )}
            {!product.available && (
              <div className="absolute inset-0 bg-bg/70 flex items-center justify-center">
                <span className="text-sm text-text-secondary border border-white/20 rounded-full px-4 py-1.5">
                  Agotado
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: accent }}>
              <Icon className="w-4 h-4" />
              {meta.label}
              {product.categories.length > 0 && ` · ${product.categories.join(' · ')}`}
            </span>
            <h1 className="font-display font-bold text-3xl mt-1 mb-4">{product.name}</h1>

            <p className="text-text-secondary text-sm leading-relaxed mb-6 whitespace-pre-line">
              {product.description || 'Sin descripción disponible para este juego.'}
            </p>

            <div className="flex flex-col gap-2 mb-6">
              <span className="text-xs text-text-secondary">Tipo de cuenta</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setAccountType('principal')}
                  className={`flex-1 text-left border rounded-xl px-4 py-3 transition-colors ${
                    accountType === 'principal'
                      ? 'border-neon-cyan bg-neon-cyan/5'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <p className="text-sm font-medium">Cuenta principal</p>
                  <p className="text-base font-semibold mt-2">{formatPrice(product.price)}</p>
                </button>

                {hasSecondary && (
                  <button
                    onClick={() => setAccountType('secundaria')}
                    className={`flex-1 text-left border rounded-xl px-4 py-3 transition-colors ${
                      accountType === 'secundaria'
                        ? 'border-neon-cyan bg-neon-cyan/5'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <p className="text-sm font-medium">Cuenta secundaria</p>
                    <p className="text-base font-semibold mt-2">
                      {formatPrice(product.priceSecondary!)}
                    </p>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs text-text-secondary">Cantidad</span>
              <div className="flex items-center gap-3 bg-surface border border-white/10 rounded-full px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 hover:text-neon-cyan transition-colors"
                  aria-label="Restar"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-5 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 hover:text-neon-cyan transition-colors"
                  aria-label="Sumar"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 pt-4 border-t border-white/10">
              <span className="text-text-secondary text-sm">Total</span>
              <span className="font-display font-bold text-2xl">
                {formatPrice(unitPrice * quantity)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.available}
                className="flex-1 flex items-center justify-center gap-2 bg-neon-cyan text-bg font-semibold rounded-full px-6 py-3 hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Agregar al carrito
              </button>
              <a
                href={directWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-white/15 rounded-full px-6 py-3 hover:border-neon-green/60 hover:text-neon-green transition"
              >
                <MessageCircle className="w-4 h-4" />
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      <CartDrawer
        open={cartOpen}
        items={cart.items}
        total={cart.total}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
      />
    </div>
  )
}
