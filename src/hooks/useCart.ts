import { useCallback, useEffect, useState } from 'react'
import type { AccountType, Product } from '../lib/types'

export interface CartItem {
  product: Product
  accountType: AccountType
  quantity: number
}

const STORAGE_KEY = 'gamedigital_lc_cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    // Compatibilidad con carritos guardados antes de tener tipo de cuenta
    return parsed.map((item) => ({ ...item, accountType: item.accountType ?? 'principal' }))
  } catch {
    return []
  }
}

export function getUnitPrice(item: CartItem): number {
  if (item.accountType === 'secundaria' && item.product.priceSecondary) {
    return item.product.priceSecondary
  }
  return item.product.price
}

function sameLine(a: CartItem, productId: string, accountType: AccountType) {
  return a.product.id === productId && a.accountType === accountType
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback(
    (product: Product, accountType: AccountType = 'principal', quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => sameLine(item, product.id, accountType))
        if (existing) {
          return current.map((item) =>
            sameLine(item, product.id, accountType)
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        }
        return [...current, { product, accountType, quantity }]
      })
    },
    [],
  )

  const removeItem = useCallback((productId: string, accountType: AccountType) => {
    setItems((current) => current.filter((item) => !sameLine(item, productId, accountType)))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, accountType: AccountType, quantity: number) => {
      if (quantity <= 0) {
        setItems((current) => current.filter((item) => !sameLine(item, productId, accountType)))
        return
      }
      setItems((current) =>
        current.map((item) =>
          sameLine(item, productId, accountType) ? { ...item, quantity } : item,
        ),
      )
    },
    [],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + getUnitPrice(item) * item.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, clearCart, count, total }
}
