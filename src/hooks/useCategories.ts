import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface Category {
  id: string
  name: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setCategories(data ?? [])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  async function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return { error: 'Escribe un nombre para la categoría.' }

    const { error } = await supabase.from('categories').insert({ name: trimmed })
    if (error) {
      // El nombre ya existe (violación de la restricción unique)
      if (error.code === '23505') {
        return { error: 'Esa categoría ya existe.' }
      }
      return { error: error.message }
    }
    await fetchCategories()
    return { error: null }
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) await fetchCategories()
    return { error: error?.message ?? null }
  }

  return { categories, loading, error, addCategory, deleteCategory, refetch: fetchCategories }
}
