import type { AccountType, Product } from '../lib/types'

// Precio más económico del juego (estrategia: mostrar primero lo más barato).
// Si el juego tiene cuenta secundaria, esa es la opción que se muestra primero.
export function lowestPrice(product: Product): {
  price: number
  accountType: AccountType
  isSecondary: boolean
} {
  if (product.priceSecondary && product.priceSecondary < product.price) {
    return { price: product.priceSecondary, accountType: 'secundaria', isSecondary: true }
  }
  return { price: product.price, accountType: 'principal', isSecondary: false }
}
