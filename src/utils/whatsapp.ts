import { STORE_CONFIG } from '../config/store'
import type { AccountType, Product } from '../lib/types'
import type { CartItem } from '../hooks/useCart'
import { getUnitPrice } from '../hooks/useCart'
import { formatPrice } from './formatPrice'

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encoded}`
}

const ACCOUNT_LABEL: Record<AccountType, string> = {
  principal: 'Cuenta principal',
  secundaria: 'Cuenta secundaria',
}

export function buildProductWhatsAppMessage(
  product: Product,
  accountType: AccountType = 'principal',
  quantity = 1,
): string {
  const price = accountType === 'secundaria' && product.priceSecondary
    ? product.priceSecondary
    : product.price

  return `Hola, estoy interesado en *${product.name}* (${product.platform} · ${ACCOUNT_LABEL[accountType]}) x${quantity} — ${formatPrice(
    price * quantity,
  )}. ¿Está disponible?`
}

export function buildCartWhatsAppMessage(items: CartItem[], total: number): string {
  const lines = items.map((item) => {
    const unitPrice = getUnitPrice(item)
    return `- ${item.product.name} (${item.product.platform} · ${ACCOUNT_LABEL[item.accountType]}) x${item.quantity} — ${formatPrice(
      unitPrice * item.quantity,
    )}`
  })
  return `Hola, quiero comprar:\n${lines.join('\n')}\n\nTotal aproximado: ${formatPrice(total)}`
}
