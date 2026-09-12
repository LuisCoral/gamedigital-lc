import { useEffect, useState, type FormEvent } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import type { Product, Platform } from '../../lib/types'
import type { ProductInput } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { PLATFORM_META, PLATFORMS } from '../../lib/platforms'
import { slugify } from '../../utils/slugify'
import { uploadProductImage } from '../../lib/storage'



interface AdminProductFormProps {
  product: Product | null // null = crear nuevo
  nextPosition: number
  onSave: (input: ProductInput) => Promise<{ error: string | null }>
  onClose: () => void
}

export default function AdminProductForm({
  product,
  nextPosition,
  onSave,
  onClose,
}: AdminProductFormProps) {
  const isEditing = !!product
  const { categories } = useCategories()

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [platform, setPlatform] = useState<Platform>(product?.platform ?? 'PS5')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(product?.categories ?? [])
  const [description, setDescription] = useState(product?.description ?? '')
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() ?? '')
  const [discount, setDiscount] = useState(product?.discount?.toString() ?? '')
  const [priceSecondary, setPriceSecondary] = useState(product?.priceSecondary?.toString() ?? '')
  const [position, setPosition] = useState(product?.position ?? nextPosition)
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [available, setAvailable] = useState(product?.available ?? true)

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name))
  }, [name, slugTouched])

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !slug) return
    setUploading(true)
    const { url, error } = await uploadProductImage(file, slug)
    setUploading(false)
    if (error) {
      setError(`Error subiendo imagen: ${error}`)
      return
    }
    setImageUrl(url ?? '')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name || !slug || !price) {
      setError('Nombre, slug y precio son obligatorios.')
      return
    }

    setSaving(true)
    const { error } = await onSave({
      name,
      slug,
      platform,
      categories: selectedCategories,
      description,
      imageUrl,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      discount: discount ? Number(discount) : undefined,
      priceSecondary: priceSecondary ? Number(priceSecondary) : undefined,
      position: Number(position),
      featured,
      available,
    })
    setSaving(false)

    if (error) {
      setError(error)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-surface border border-white/10 rounded-xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-display font-bold text-lg">
            {isEditing ? 'Editar juego' : 'Nuevo juego'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
              placeholder="Ej: God of War Ragnarök"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Slug (URL amigable)</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(slugify(e.target.value))
              }}
              required
              className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Plataforma</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_META[p].label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">
              Categorías {selectedCategories.length > 0 && `(${selectedCategories.length} seleccionadas)`}
            </label>
            <div className="flex flex-wrap gap-2 bg-bg border border-white/10 rounded-lg px-3 py-3">
              {categories.length === 0 && (
                <p className="text-xs text-text-secondary">
                  Todavía no hay categorías creadas.
                </p>
              )}
              {categories.map((c) => {
                const isSelected = selectedCategories.includes(c.name)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategories((current) =>
                        isSelected
                          ? current.filter((name) => name !== c.name)
                          : [...current, c.name],
                      )
                    }
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan'
                        : 'border-white/15 text-text-secondary hover:border-white/30'
                    }`}
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-text-secondary">
              Toca las que apliquen (puedes elegir varias). ¿Falta una? Agrégala en "Categorías", arriba de la lista de juegos.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Imagen</label>
            <div className="flex items-center gap-3">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Vista previa"
                  className="w-14 h-14 rounded-lg object-cover border border-white/10"
                />
              )}
              <label className="flex items-center gap-2 text-sm border border-white/10 rounded-lg px-3 py-2 cursor-pointer hover:border-neon-cyan/50 transition-colors">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading ? 'Subiendo...' : 'Subir imagen'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={!slug || uploading}
                />
              </label>
            </div>
            {!slug && (
              <p className="text-[11px] text-text-secondary">
                Escribe primero el nombre para poder subir la imagen.
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Precio</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Precio anterior</label>
              <input
                type="number"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Descuento %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Posición en el catálogo</label>
            <input
              type="number"
              min="0"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50 w-32"
            />
          </div>

          <div className="flex flex-col gap-1.5 border-t border-white/10 pt-4">
            <label className="text-xs text-text-secondary">
              Precio cuenta secundaria (opcional)
            </label>
            <input
              type="number"
              min="0"
              value={priceSecondary}
              onChange={(e) => setPriceSecondary(e.target.value)}
              placeholder="Déjalo vacío si solo vendes cuenta principal"
              className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50"
            />
            <p className="text-[11px] text-text-secondary">
              Si lo llenas, el cliente podrá elegir entre cuenta principal y cuenta secundaria en la página del juego.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-neon-cyan"
              />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="accent-neon-cyan"
              />
              Disponible
            </label>
          </div>

          {error && <p className="text-xs text-neon-magenta">{error}</p>}

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-neon-cyan text-bg font-semibold rounded-lg px-5 py-2.5 text-sm hover:brightness-110 disabled:opacity-50 transition"
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear juego'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
