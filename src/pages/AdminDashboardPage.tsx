import { Link } from 'react-router-dom'
import { Gamepad2, Star, PackageX, Layers } from 'lucide-react'
import AdminLayout from '../components/admin/AdminLayout'
import { useProducts } from '../hooks/useProducts'

export default function AdminDashboardPage() {
  const { products, loading } = useProducts()

  const stats = [
    {
      label: 'Total de juegos',
      value: products.length,
      icon: Gamepad2,
      color: '#00F5FF',
    },
    {
      label: 'Destacados',
      value: products.filter((p) => p.featured).length,
      icon: Star,
      color: '#39FF88',
    },
    {
      label: 'Agotados',
      value: products.filter((p) => !p.available).length,
      icon: PackageX,
      color: '#FF00D4',
    },
    {
      label: 'Plataformas',
      value: new Set(products.map((p) => p.platform)).size,
      icon: Layers,
      color: '#A1A1AA',
    },
  ]

  return (
    <AdminLayout>
      <h1 className="font-display font-bold text-2xl mb-1">Dashboard</h1>
      <p className="text-text-secondary text-sm mb-8">
        Resumen general del catálogo de GAMEDIGITAL_LC.
      </p>

      {loading ? (
        <p className="text-text-secondary text-sm">Cargando estadísticas...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-white/10 rounded-xl p-5 flex flex-col gap-3"
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              <span className="text-2xl font-display font-bold">{stat.value}</span>
              <span className="text-xs text-text-secondary">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 bg-surface border border-white/10 rounded-xl p-6">
        <h2 className="font-medium mb-2">Gestión de juegos</h2>
        <p className="text-text-secondary text-sm mb-4">
          Crea, edita, elimina juegos, cambia precios, imágenes y disponibilidad.
        </p>
        <Link
          to="/admin/productos"
          className="inline-flex items-center bg-neon-cyan text-bg font-semibold rounded-lg px-4 py-2 text-sm hover:brightness-110 transition"
        >
          Ir a Juegos
        </Link>
      </div>
    </AdminLayout>
  )
}
