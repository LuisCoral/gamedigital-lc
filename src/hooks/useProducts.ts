import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'

// Fila tal como viene de la tabla "products" en Supabase (snake_case)
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

// Datos que se pueden crear/editar desde el panel admin (camelCase, como el resto de la app)
export interface ProductInput {
  name: string
  slug: string
  platform: Product['platform']
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

function mapInputToRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    platform: input.platform,
    categories: input.categories,
    description: input.description,
    image_url: input.imageUrl || null,
    price: input.price,
    old_price: input.oldPrice ?? null,
    discount: input.discount ?? null,
    price_secondary: input.priceSecondary ?? null,
    position: input.position,
    featured: input.featured,
    available: input.available,
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      setError(error.message)
      setProducts([])
    } else {
      setProducts((data as ProductRow[]).map(mapRow))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function createProduct(input: ProductInput) {
    const { error } = await supabase.from('products').insert(mapInputToRow(input))
    if (!error) await fetchProducts()
    return { error: error?.message ?? null }
  }

  async function updateProduct(id: string, input: ProductInput) {
    const { error } = await supabase.from('products').update(mapInputToRow(input)).eq('id', id)
    if (!error) await fetchProducts()
    return { error: error?.message ?? null }
  }

  async function deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) await fetchProducts()
    return { error: error?.message ?? null }
  }

  async function toggleAvailable(id: string, available: boolean) {
    const { error } = await supabase.from('products').update({ available }).eq('id', id)
    if (!error) await fetchProducts()
    return { error: error?.message ?? null }
  }

  // Recibe la lista de productos ya en el nuevo orden y guarda la
  // posición (1, 2, 3...) de cada uno en Supabase.
  async function reorderProducts(orderedProducts: Product[]) {
    // Actualización optimista: se ve el nuevo orden de inmediato en pantalla
    // mientras se guarda en la base de datos.
    setProducts(orderedProducts.map((p, index) => ({ ...p, position: index + 1 })))

    const updates = orderedProducts.map((product, index) =>
      supabase.from('products').update({ position: index + 1 }).eq('id', product.id),
    )
    const results = await Promise.all(updates)
    const failed = results.find((r) => r.error)

    if (failed?.error) {
      await fetchProducts() // si algo falló, recupera el orden real desde la base de datos
      return { error: failed.error.message }
    }
    return { error: null }
  }

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleAvailable,
    reorderProducts,
  }
}
