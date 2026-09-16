import { useMemo, useState } from 'react'
import { Plus, Star } from 'lucide-react'
import AdminLayout from '../components/admin/AdminLayout'
import AdminProducts from '../components/admin/AdminProducts'
import AdminProductForm from '../components/admin/AdminProductForm'
import AdminCategories from '../components/admin/AdminCategories'
import { useProducts } from '../hooks/useProducts'
import { PLATFORM_META, PLATFORMS } from '../lib/platforms'
import type { Platform, Product } from '../lib/types'

type ViewFilter = Platform | 'todos' | 'destacados'

export default function AdminProductsPage() {
  const { products, loading, createProduct, updateProduct, deleteProduct, toggleAvailable, reorderProducts } =
    useProducts()

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [viewFilter, setViewFilter] = useState<ViewFilter>('todos')

  const nextPosition = products.length > 0 ? Math.max(...products.map((p) => p.position)) + 1 : 1

  const visibleProducts = useMemo(() => {
    if (viewFilter === 'todos') return products
    if (viewFilter === 'destacados') return products.filter((p) => p.featured)
    return products.filter((p) => p.platform === viewFilter)
  }, [products, viewFilter])

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
          onClick={() => setViewFilter('todos')}
          className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
            viewFilter === 'todos'
              ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan'
              : 'border-white/15 text-text-secondary hover:border-white/30'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setViewFilter('destacados')}
          className={`flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
            viewFilter === 'destacados'
              ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan'
              : 'border-white/15 text-text-secondary hover:border-white/30'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${viewFilter === 'destacados' ? 'fill-neon-cyan' : ''}`} />
          Destacados
        </button>
        {PLATFORMS.map((platform) => {
          const meta = PLATFORM_META[platform]
          const isActive = viewFilter === platform
          return (
            <button
              key={platform}
              onClick={() => setViewFilter(platform)}
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
        {viewFilter === 'todos' &&
          'Arrastrando aquí reordenas el catálogo completo, mezclando todas las plataformas.'}
        {viewFilter === 'destacados' &&
          'Mostrando solo los juegos marcados como Destacado. Arrastra para cambiar el orden en que aparecen en el carrusel de la página principal.'}
        {viewFilter !== 'todos' &&
          viewFilter !== 'destacados' &&
          `Mostrando solo ${PLATFORM_META[viewFilter].label}. Arrastra para reordenar solo esta plataforma, sin afectar el orden de las demás.`}
      </p>

      {viewFilter === 'destacados' && visibleProducts.length === 0 && (
        <p className="text-text-secondary text-sm mb-4">
          Todavía no tienes juegos marcados como Destacado. Edita un juego y activa la casilla
          "Destacado" para que aparezca aquí y en el carrusel.
        </p>
      )}

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
