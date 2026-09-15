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

  function friendlyError(message: string, code?: string): string {
    if (code === '23505' || message.includes('products_slug_key')) {
      return 'Ya existe un juego con esa URL (slug). Cámbiala por otra, por ejemplo agregando la plataforma al final, y guarda de nuevo.'
    }
    return message
  }

  async function createProduct(input: ProductInput) {
    const { error } = await supabase.from('products').insert(mapInputToRow(input))
    if (!error) await fetchProducts()
    return { error: error ? friendlyError(error.message, error.code) : null }
  }

  async function updateProduct(id: string, input: ProductInput) {
    const { error } = await supabase.from('products').update(mapInputToRow(input)).eq('id', id)
    if (!error) await fetchProducts()
    return { error: error ? friendlyError(error.message, error.code) : null }
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

  // Recibe una lista de productos ya en el nuevo orden (puede ser el
  // catálogo completo o solo los de una plataforma) y guarda el nuevo
  // orden en Supabase. Reutiliza los mismos valores de "position" que
  // ya tenían esos productos entre sí, solo que reacomodados — así, si
  // solo estás reordenando una plataforma, no se altera el orden de
  // las demás que no aparecen en esta lista.
  async function reorderProducts(orderedProducts: Product[]) {
    const positions = orderedProducts.map((p) => p.position).sort((a, b) => a - b)
    const reordered = orderedProducts.map((p, index) => ({ ...p, position: positions[index] }))

    // Actualización optimista: se ve el nuevo orden de inmediato en pantalla
    // mientras se guarda en la base de datos.
    setProducts((current) =>
      current
        .map((p) => reordered.find((r) => r.id === p.id) ?? p)
        .sort((a, b) => a.position - b.position),
    )

    const updates = reordered.map((product) =>
      supabase.from('products').update({ position: product.position }).eq('id', product.id),
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
