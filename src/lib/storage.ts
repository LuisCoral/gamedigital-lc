import { supabase } from './supabase'

const BUCKET = 'products'
const MAX_DIMENSION = 1200 // lado más largo, en píxeles
const QUALITY = 0.85 // 0-1, suficiente para verse nítido sin pesar de más

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    img.src = URL.createObjectURL(file)
  })
}

// Redimensiona y comprime la imagen en el navegador antes de subirla:
// mismo nivel visual para el catálogo, pero un archivo mucho más liviano
// (WebP, máximo 1200px de lado), así el catálogo carga más rápido.
async function optimizeImage(file: File): Promise<Blob> {
  const img = await loadImageElement(file)
  let { width, height } = img

  if (width > height && width > MAX_DIMENSION) {
    height = Math.round((height * MAX_DIMENSION) / width)
    width = MAX_DIMENSION
  } else if (height > MAX_DIMENSION) {
    width = Math.round((width * MAX_DIMENSION) / height)
    height = MAX_DIMENSION
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Este navegador no puede procesar la imagen.')
  ctx.drawImage(img, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo comprimir la imagen.'))),
      'image/webp',
      QUALITY,
    )
  })
}

export async function uploadProductImage(
  file: File,
  slug: string,
): Promise<{ url: string | null; error: string | null }> {
  let blob: Blob
  try {
    blob = await optimizeImage(file)
  } catch {
    blob = file // si algo falla al procesarla, sube la original en vez de bloquear al admin
  }

  const path = `${slug}-${Date.now()}.webp`

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: '31536000', // 1 año: el nombre incluye la fecha, así que es seguro cachearla mucho tiempo
    upsert: true,
    contentType: 'image/webp',
  })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
