export type Platform = 'PS4' | 'PS5' | 'Nintendo' | 'Switch2'
export type AccountType = 'principal' | 'secundaria'

export interface Product {
  id: string
  name: string
  slug: string
  platform: Platform
  categories: string[]
  description: string
  imageUrl: string
  price: number
  oldPrice?: number
  discount?: number
  priceSecondary?: number
  position: number
  featured: boolean
  available: boolean
}
