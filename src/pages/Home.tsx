import { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/Header'
import CategoryCard from '../components/CategoryCard'
import ProductGrid from '../components/ProductGrid'
import Pagination from '../components/Pagination'
import FeaturedCarousel from '../components/FeaturedCarousel'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import CartDrawer from '../components/CartDrawer'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { PLATFORMS } from '../lib/platforms'
import type { Platform, Product } from '../lib/types'

export default function Home() {
  const { products, loading, error } = useProducts()
  const cart = useCart()

  const [search, setSearch] = useState('')
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [page, setPage] = useState(() => {
    // Al volver de ver un juego, retoma la misma página del catálogo en
    // la que ibas, en vez de reiniciar siempre en la página 1.
    const saved = sessionStorage.getItem('gd_home_page')
    return saved ? Number(saved) : 1
  })
  const PAGE_SIZE = 20
  const isFirstRender = useRef(true)

  const featured = useMemo(
    () => products.filter((p) => p.featured).sort((a, b) => a.position - b.position),
    [products],
  )

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchesPlatform = activePlatform ? p.platform === activePlatform : true
        return matchesSearch && matchesPlatform
      })
      .sort((a, b) => a.position - b.position)
  }, [products, search, activePlatform])

  // Si cambia la búsqueda o el filtro de plataforma, volvemos a la
  // página 1 — pero no la primera vez que se monta la página (ahí es
  // cuando estamos restaurando la página guardada de la visita anterior).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setPage(1)
  }, [search, activePlatform])

  // Guarda en qué página del catálogo vas, cada vez que cambia.
  useEffect(() => {
    sessionStorage.setItem('gd_home_page', String(page))
  }, [page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Por si el catálogo cambió de tamaño desde tu última visita y la
  // página guardada ya no existe (ej. antes había 3 páginas y ahora solo hay 1).
  useEffect(() => {
    if (!loading && page > totalPages) {
      setPage(totalPages)
    }
  }, [loading, page, totalPages])

  function handlePageChange(newPage: number) {
    setPage(newPage)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const countByPlatform = (platform: Platform) =>
    products.filter((p) => p.platform === platform).length

  function handleAddToCart(product: Product) {
    cart.addItem(product)
    setCartOpen(true)
  }

  // Guarda continuamente en qué parte del catálogo vas, mientras haces
  // scroll. Así, sin importar cómo salgas de la página (un juego, el
  // carrito, etc.), siempre queda guardada tu posición más reciente.
  useEffect(() => {
    function saveScroll() {
      sessionStorage.setItem('gd_home_scroll', String(window.scrollY))
    }
    window.addEventListener('scroll', saveScroll, { passive: true })
    return () => window.removeEventListener('scroll', saveScroll)
  }, [])

  // Una vez que el catálogo terminó de cargar, restaura esa posición.
  // Reintenta varias veces durante el primer segundo: las fuentes de
  // Google (Rajdhani/Inter) cargan de forma asíncrona y, al aparecer,
  // pueden reacomodar el alto de la página y "empujar" el scroll de
  // vuelta arriba — reintentar evita que eso deshaga la restauración.
  useEffect(() => {
    if (loading) return
    const saved = sessionStorage.getItem('gd_home_scroll')
    if (!saved) return
    const target = Number(saved)

    const timeouts = [0, 50, 150, 300, 600, 1000].map((delay) =>
      setTimeout(() => window.scrollTo(0, target), delay),
    )
    return () => timeouts.forEach(clearTimeout)
  }, [loading])

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearch} cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">
        {error && (
          <div className="max-w-6xl mx-auto px-5 mt-8">
            <div className="border border-neon-magenta/40 bg-neon-magenta/5 text-sm text-neon-magenta rounded-lg px-4 py-3">
              No se pudo conectar con Supabase: {error}. Revisa tu archivo{' '}
              <code>.env</code> y que hayas ejecutado <code>supabase/schema.sql</code>.
            </div>
          </div>
        )}

        {featured.length > 0 && !activePlatform && !search && (
          <section className="max-w-6xl mx-auto px-5 pt-12 pb-4">
            <h2 className="font-display font-bold text-2xl mb-2">Destacados</h2>
            <p className="text-text-secondary text-sm mb-2">
              Los juegos que más recomendamos esta semana.
            </p>
            <FeaturedCarousel products={featured} onAddToCart={handleAddToCart} />
          </section>
        )}

        <section className="max-w-6xl mx-auto px-5 py-14">
          <h2 className="font-display font-bold text-2xl mb-6">Elige tu plataforma</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORMS.map((platform) => (
              <CategoryCard
                key={platform}
                platform={platform}
                count={countByPlatform(platform)}
                onClick={() =>
                  setActivePlatform((current) => (current === platform ? null : platform))
                }
              />
            ))}
          </div>
        </section>

        {loading ? (
          <p className="max-w-6xl mx-auto px-5 text-text-secondary text-sm pb-14">
            Cargando catálogo...
          </p>
        ) : (
          <>
            <section id="catalogo" className="max-w-6xl mx-auto px-5 pb-20">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-bold text-2xl">
                  {activePlatform ? `Catálogo ${activePlatform}` : 'Catálogo completo'}
                </h2>
                {activePlatform && (
                  <button
                    onClick={() => setActivePlatform(null)}
                    className="text-sm text-text-secondary hover:text-neon-cyan transition-colors"
                  >
                    Quitar filtro
                  </button>
                )}
              </div>
              {filtered.length > 0 && (
                <p className="text-text-secondary text-sm mb-6">
                  Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de{' '}
                  {filtered.length} juegos
                </p>
              )}
              <ProductGrid
                products={paginated}
                onAddToCart={handleAddToCart}
                emptyMessage="No hay juegos que coincidan con tu búsqueda."
              />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </section>
          </>
        )}
      </main>
      <Footer />
      <WhatsAppButton />

      <CartDrawer
        open={cartOpen}
        items={cart.items}
        total={cart.total}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
      />
    </div>
  )
}
