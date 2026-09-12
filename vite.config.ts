import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio ahora se publica en un dominio propio (gamedigital.store),
// por lo que vive en la raíz del dominio y ya no necesita el prefijo
// "/gamedigital-lc/" que usábamos con la URL por defecto de GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
