import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminProducts from '../components/admin/AdminProducts'
import AdminProductForm from '../components/admin/AdminProductForm'
import AdminCategories from '../components/admin/AdminCategories'
import { useProducts } from '../hooks/useProducts'
import { PLATFORM_META, PLATFORMS } from '../lib/platforms'
import type { Platform, Product } from '../lib/types'

export default function AdminProductsPage() {
  const { products, loading, createProduct, updateProduct, deleteProduct, toggleAvailable, reorderProducts } =
    useProducts()

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [platformFilter, setPlatformFilter] = useState<Platform | 'todos'>('todos')

  const nextPosition = products.length > 0 ? Math.max(...products.map((p) => p.position)) + 1 : 1

  const visibleProducts = useMemo(
    () => (platformFilter === 'todos' ? products : products.filter((p) => p.platform === platformFilter)),
    [products, platformFilter],
  )

  function openCreateForm() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function openEditForm(product: Product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  async function handleSave(input: Parameters<typeof createProduct>[0]) {
    if (editingProduct) {
      return updateProduct(editingProduct.id, input)
    }
    return createProduct(input)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const { error } = await deleteProduct(pendingDelete.id)
    if (error) setActionError(error)
    setPendingDelete(null)
  }

  async function handleToggleAvailable(product: Product) {
    const { error } = await toggleAvailable(product.id, !product.available)
    if (error) setActionError(error)
  }

  async function handleReorder(orderedProducts: Product[]) {
    const { error } = await reorderProducts(orderedProducts)
    if (error) setActionError(error)
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-bold text-2xl">Juegos</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-1.5 bg-neon-cyan text-bg font-semibold rounded-lg px-4 py-2 text-sm hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo juego
        </button>
      </div>
      <p className="text-text-secondary text-sm mb-6">
        {products.length} juego{products.length !== 1 ? 's' : ''} en el catálogo.
      </p>

      {actionError && (
        <div className="border border-neon-magenta/40 bg-neon-magenta/5 text-sm text-neon-magenta rounded-lg px-4 py-3 mb-4">
          {actionError}
        </div>
      )}

      <div className="mb-6">
        <AdminCategories />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setPlatformFilter('todos')}
          className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
            platformFilter === 'todos'
              ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan'
              : 'border-white/15 text-text-secondary hover:border-white/30'
          }`}
        >
          Todos
        </button>
        {PLATFORMS.map((platform) => {
          const meta = PLATFORM_META[platform]
          const isActive = platformFilter === platform
          return (
            <button
              key={platform}
              onClick={() => setPlatformFilter(platform)}
              className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                isActive ? '' : 'border-white/15 text-text-secondary hover:border-white/30'
              }`}
              style={
                isActive
                  ? { borderColor: meta.accent, color: meta.accent, backgroundColor: `${meta.accent}22` }
                  : undefined
              }
            >
              {meta.shortLabel}
            </button>
          )
        })}
      </div>
      <p className="text-text-secondary text-xs mb-4">
        {platformFilter === 'todos'
          ? 'Arrastrando aquí reordenas el catálogo completo, mezclando todas las plataformas.'
          : `Mostrando solo ${PLATFORM_META[platformFilter].label}. Arrastra para reordenar solo esta plataforma, sin afectar el orden de las demás.`}
      </p>

      {loading ? (
        <p className="text-text-secondary text-sm">Cargando juegos...</p>
      ) : (
        <AdminProducts
          products={visibleProducts}
          onEdit={openEditForm}
          onDelete={setPendingDelete}
          onToggleAvailable={handleToggleAvailable}
          onReorder={handleReorder}
        />
      )}

      {formOpen && (
        <AdminProductForm
          product={editingProduct}
          nextPosition={nextPosition}
          onSave={handleSave}
          onClose={() => setFormOpen(false)}
        />
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface border border-white/10 rounded-xl p-6">
            <h2 className="font-medium mb-2">¿Eliminar "{pendingDelete.name}"?</h2>
            <p className="text-text-secondary text-sm mb-6">
              Esta acción no se puede deshacer. El juego se quitará del catálogo público.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmDelete}
                className="bg-neon-magenta text-bg font-semibold rounded-lg px-4 py-2 text-sm hover:brightness-110 transition"
              >
                Eliminar
              </button>
              <button
                onClick={() => setPendingDelete(null)}
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
