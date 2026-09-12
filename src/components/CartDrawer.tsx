import { X, Plus, Minus, Trash2, MessageCircle, ShoppingCart } from 'lucide-react'
import type { AccountType } from '../lib/types'
import { type CartItem, getUnitPrice } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import { buildCartWhatsAppMessage, buildWhatsAppLink } from '../utils/whatsapp'

interface CartDrawerProps {
  open: boolean
  items: CartItem[]
  total: number
  onClose: () => void
  onUpdateQuantity: (productId: string, accountType: AccountType, quantity: number) => void
  onRemove: (productId: string, accountType: AccountType) => void
}

const ACCOUNT_LABEL: Record<AccountType, string> = {
  principal: 'Cuenta principal',
  secundaria: 'Cuenta secundaria',
}

export default function CartDrawer({
  open,
  items,
  total,
  onClose,
  onUpdateQuantity,
  onRemove,
}: CartDrawerProps) {
  if (!open) return null

  const whatsappLink =
    items.length > 0 ? buildWhatsAppLink(buildCartWhatsAppMessage(items, total)) : null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Cerrar carrito"
        onClick={onClose}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm bg-surface border-l border-white/10 h-full flex flex-col">
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neon-cyan" />
            Tu carrito
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-text-secondary text-sm px-6 text-center">
            <ShoppingCart className="w-10 h-10 opacity-30" />
            Tu carrito está vacío.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.accountType}`} className="flex gap-3">
                <div className="w-14 h-14 rounded-lg bg-bg border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingCart className="w-5 h-5 text-text-secondary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-text-secondary">
                    {item.product.platform} · {ACCOUNT_LABEL[item.accountType]}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-bg border border-white/10 rounded-full px-1">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.accountType, item.quantity - 1)
                        }
                        className="p-1 hover:text-neon-cyan transition-colors"
                        aria-label="Restar"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.accountType, item.quantity + 1)
                        }
                        className="p-1 hover:text-neon-cyan transition-colors"
                        aria-label="Sumar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(getUnitPrice(item) * item.quantity)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemove(item.product.id, item.accountType)}
                  className="text-text-secondary hover:text-neon-magenta transition-colors shrink-0"
                  aria-label="Eliminar del carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-white/10 p-5 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary text-sm">Total aproximado</span>
              <span className="text-lg font-display font-bold">{formatPrice(total)}</span>
            </div>
            <a
              href={whatsappLink ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-neon-green text-bg font-semibold rounded-full py-3 text-sm hover:brightness-110 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Finalizar por WhatsApp
            </a>
            <p className="text-[11px] text-text-secondary text-center mt-3">
              Se abrirá WhatsApp con tu pedido. El pago y la entrega se coordinan directamente con la tienda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
