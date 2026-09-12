import { useState } from 'react'
import { Pencil, Trash2, Star, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import type { Product } from '../../lib/types'
import { PLATFORM_META } from '../../lib/platforms'
import { formatPrice } from '../../utils/formatPrice'

interface AdminProductsProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleAvailable: (product: Product) => void
  onReorder: (orderedProducts: Product[]) => void
}

export default function AdminProducts({
  products,
  onEdit,
  onDelete,
  onToggleAvailable,
  onReorder,
}: AdminProductsProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-white/15 rounded-xl py-14 text-center text-text-secondary text-sm">
        Todavía no hay juegos. Crea el primero con el botón "Nuevo juego".
      </div>
    )
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= products.length || from === to) return
    const reordered = [...products]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    onReorder(reordered)
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    move(dragIndex, dropIndex)
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <p className="hidden sm:block bg-surface/60 text-[11px] text-text-secondary px-4 py-2 border-b border-white/10">
        Arrastra el ícono <GripVertical className="w-3 h-3 inline -mt-0.5" /> para reordenar el catálogo público.
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface text-text-secondary text-left text-xs">
            <th className="px-2 py-3 font-medium w-8"></th>
            <th className="px-4 py-3 font-medium">Juego</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Plataforma</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Posición</th>
            <th className="px-4 py-3 font-medium">Disponible</th>
            <th className="px-4 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((product, index) => {
            const meta = PLATFORM_META[product.platform]
            const Icon = meta.icon
            return (
            <tr
              key={product.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => {
                e.preventDefault()
                setOverIndex(index)
              }}
              onDragEnd={() => {
                setDragIndex(null)
                setOverIndex(null)
              }}
              onDrop={() => handleDrop(index)}
              className={`hover:bg-surface/50 transition-colors ${
                dragIndex === index ? 'opacity-40' : ''
              } ${overIndex === index && dragIndex !== null && dragIndex !== index ? 'bg-neon-cyan/5' : ''}`}
            >
              <td className="px-2 py-3 cursor-grab active:cursor-grabbing text-text-secondary hidden sm:table-cell">
                <GripVertical className="w-4 h-4" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-bg border border-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4" style={{ color: meta.accent }} />
                    </div>
                  )}
                  <div>
                    <p className="flex items-center gap-1.5">
                      {product.name}
                      {product.featured && (
                        <Star className="w-3.5 h-3.5 text-neon-cyan fill-neon-cyan" />
                      )}
                    </p>
                    <p className="text-xs sm:hidden" style={{ color: meta.accent }}>
                      {meta.shortLabel}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell" style={{ color: meta.accent }}>
                {meta.shortLabel}
              </td>
              <td className="px-4 py-3">
                {formatPrice(product.price)}
                {product.discount && (
                  <span className="text-neon-magenta text-xs ml-1">-{product.discount}%</span>
                )}
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-text-secondary">
                {product.position}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onToggleAvailable(product)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    product.available
                      ? 'border-neon-green/40 text-neon-green'
                      : 'border-white/15 text-text-secondary'
                  }`}
                >
                  {product.available ? 'Sí' : 'No'}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-0.5">
                  <div className="flex flex-col mr-1 sm:hidden">
                    <button
                      onClick={() => move(index, index - 1)}
                      disabled={index === 0}
                      className="text-text-secondary hover:text-neon-cyan disabled:opacity-20 transition-colors"
                      aria-label="Subir"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => move(index, index + 1)}
                      disabled={index === products.length - 1}
                      className="text-text-secondary hover:text-neon-cyan disabled:opacity-20 transition-colors"
                      aria-label="Bajar"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 rounded-lg hover:bg-bg hover:text-neon-cyan transition-colors"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-2 rounded-lg hover:bg-bg hover:text-neon-magenta transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
