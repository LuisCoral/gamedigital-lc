import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'

interface ProductRow {
  id: string
  name: string
  slug: string
  platform: Product['platform']
  categories: string[]
  description: string
  image_url: string | null
  price: number
  old_price: number | null
  discount: number | null
  price_secondary: number | null
  position: number
  featured: boolean
  available: boolean
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    platform: row.platform,
    categories: row.categories ?? [],
    description: row.description,
    imageUrl: row.image_url ?? '',
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    discount: row.discount ? Number(row.discount) : undefined,
    priceSecondary: row.price_secondary ? Number(row.price_secondary) : undefined,
    position: row.position,
    featured: row.featured,
    available: row.available,
  }
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let active = true
    setLoading(true)
    setError(null)

    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setError(error.message)
        } else {
          setProduct(data ? mapRow(data as ProductRow) : null)
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  return { product, loading, error }
}
