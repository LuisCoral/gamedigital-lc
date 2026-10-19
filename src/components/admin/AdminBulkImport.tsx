import { useMemo, useState } from 'react'
import { X, Upload, Loader2, CheckCircle2, AlertCircle, MinusCircle } from 'lucide-react'
import type { Platform, Product } from '../../lib/types'
import type { ProductInput } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { PLATFORM_META, PLATFORMS } from '../../lib/platforms'
import { slugify } from '../../utils/slugify'
import { uploadProductImage } from '../../lib/storage'
import { hintForFile } from '../../data/bulkHints'

interface Props {
  products: Product[]
  nextPosition: number
  onCreate: (input: ProductInput) => Promise<{ error: string | null }>
  onClose: () => void
}

type Status = 'pendiente' | 'subiendo' | 'ok' | 'omitido' | 'error'

interface Row {
  file: File
  name: string
  categories: string[]
  status: Status
  message?: string
}

export default function AdminBulkImport({ products, nextPosition, onCreate, onClose }: Props) {
  const { categories, addCategory } = useCategories()
  const [platform, setPlatform] = useState<Platform>('Nintendo')
  const [price, setPrice] = useState('80000')
  const [priceSecondary, setPriceSecondary] = useState('60000')
  const [rows, setRows] = useState<Row[]>([])
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)

  const summary = useMemo(() => {
    const count = (s: Status) => rows.filter((r) => r.status === s).length
    return { ok: count('ok'), omitidos: count('omitido'), errores: count('error') }
  }, [rows])

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
      .filter((f) => f.type.startsWith('image/'))
      .sort((a, b) => a.name.localeCompare(b.name))
    setRows(
      files.map((file) => {
        const hint = hintForFile(file.name)
        return { file, name: hint.name, categories: hint.categories, status: 'pendiente' as Status }
      }),
    )
    setFinished(false)
  }

  function patch(i: number, change: Partial<Row>) {
    setRows((current) => current.map((r, idx) => (idx === i ? { ...r, ...change } : r)))
  }

  async function start() {
    if (!price || running || rows.length === 0) return
    setRunning(true)

    // Crea las categorías que todavía no existan.
    const existing = new Set(categories.map((c) => c.name))
    const needed = [...new Set(rows.flatMap((r) => r.categories))].filter((c) => !existing.has(c))
    for (const name of needed) await addCategory(name)

    const takenSlugs = new Set(products.map((p) => p.slug))
    let position = nextPosition

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (row.status === 'ok') continue
      const slug = slugify(`${row.name} ${platform}`)

      if (takenSlugs.has(slug)) {
        patch(i, { status: 'omitido', message: 'Ya existe en esta plataforma' })
        continue
      }

      patch(i, { status: 'subiendo', message: undefined })
      const { url, error: uploadError } = await uploadProductImage(row.file, slug)
      if (uploadError || !url) {
        patch(i, { status: 'error', message: uploadError ?? 'No se pudo subir la imagen' })
        continue
      }

      const { error } = await onCreate({
        name: row.name,
        slug,
        platform,
        categories: row.categories,
        description: '',
        imageUrl: url,
        price: Number(price),
        priceSecondary: priceSecondary ? Number(priceSecondary) : undefined,
        position: position++,
        featured: false,
        available: true,
      })
      if (error) {
        patch(i, { status: 'error', message: error })
      } else {
        takenSlugs.add(slug)
        patch(i, { status: 'ok' })
      }
    }

    setRunning(false)
    setFinished(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-surface border border-white/10 rounded-xl">
        <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h2 className="font-display font-bold text-lg">Carga masiva de juegos</h2>
          <button
            onClick={onClose}
            disabled={running}
            className="text-text-secondary hover:text-text-primary disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Plataforma</label>
              <select
                value={platform}
                disabled={running}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_META[p].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Precio cuenta principal</label>
              <input
                type="number"
                min="0"
                value={price}
                disabled={running}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Precio cuenta secundaria</label>
              <input
                type="number"
                min="0"
                value={priceSecondary}
                disabled={running}
                onChange={(e) => setPriceSecondary(e.target.value)}
                className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center justify-center gap-2 text-sm border border-dashed border-white/20 rounded-lg px-3 py-5 cursor-pointer hover:border-neon-cyan/50 transition-colors">
            <Upload className="w-4 h-4" />
            {rows.length > 0 ? `${rows.length} imágenes seleccionadas — cambiar` : 'Seleccionar imágenes (puedes elegir todas a la vez)'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={running}
              onChange={handleFiles}
            />
          </label>

          {rows.length > 0 && (
            <ul className="flex flex-col divide-y divide-white/5 border border-white/10 rounded-lg">
              {rows.map((r, i) => (
                <li key={i} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <div className="w-5 shrink-0">
                    {r.status === 'subiendo' && <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />}
                    {r.status === 'ok' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    {r.status === 'omitido' && <MinusCircle className="w-4 h-4 text-text-secondary" />}
                    {r.status === 'error' && <AlertCircle className="w-4 h-4 text-neon-magenta" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{r.name}</p>
                    <p className="text-[11px] text-text-secondary truncate">
                      {r.categories.length > 0 ? r.categories.join(' · ') : 'Sin categorías'}
                      {r.message && ` — ${r.message}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {finished && (
            <p className="text-sm">
              Listo: {summary.ok} creados, {summary.omitidos} omitidos, {summary.errores} con error.
            </p>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-t border-white/10">
          <button
            onClick={start}
            disabled={running || rows.length === 0 || !price}
            className="bg-neon-cyan text-bg font-semibold rounded-lg px-5 py-2.5 text-sm hover:brightness-110 disabled:opacity-50 transition"
          >
            {running ? 'Subiendo...' : finished && summary.errores > 0 ? 'Reintentar los que fallaron' : `Subir ${rows.length || ''} juegos`}
          </button>
          <button
            onClick={onClose}
            disabled={running}
            className="text-sm text-text-secondary hover:text-text-primary disabled:opacity-40"
          >
            {finished ? 'Cerrar' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  )
}
