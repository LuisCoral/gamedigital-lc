// En desarrollo, BASE_URL es "/". En el build de producción para GitHub
// Pages, es "/gamedigital-lc/". Usar esta constante en vez de escribir
// "/logo.png" a mano evita que las imágenes o el favicon se rompan al
// publicar el sitio en una subcarpeta.
export const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`
