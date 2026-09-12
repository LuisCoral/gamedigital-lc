import { useState, type FormEvent } from 'react'
import { Plus, Trash2, Tag } from 'lucide-react'
import { useCategories } from '../../hooks/useCategories'

export default function AdminCategories() {
  const { categories, loading, error, addCategory, deleteCategory } = useCategories()
  const [name, setName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const { error } = await addCategory(name)
    setSaving(false)
    if (error) {
      setFormError(error)
      return
    }
    setName('')
  }

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Tag className="w-4 h-4 text-neon-cyan" />
        <h2 className="font-medium">Categorías</h2>
      </div>
      <p className="text-text-secondary text-sm mb-4">
        Estas categorías aparecen al crear o editar un juego. Agrega las que
        necesites para tu catálogo.
      </p>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Terror, Cartas, Educativo..."
          className="flex-1 bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 bg-neon-cyan text-bg font-semibold rounded-lg px-4 py-2 text-sm hover:brightness-110 disabled:opacity-50 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </form>

      {formError && <p className="text-xs text-neon-magenta mb-4">{formError}</p>}
      {error && <p className="text-xs text-neon-magenta mb-4">{error}</p>}

      {loading ? (
        <p className="text-text-secondary text-sm">Cargando categorías...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.id}
              className="flex items-center gap-2 bg-bg border border-white/10 rounded-full pl-3 pr-2 py-1.5 text-sm"
            >
              {category.name}
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-text-secondary hover:text-neon-magenta transition-colors"
                aria-label={`Eliminar ${category.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
