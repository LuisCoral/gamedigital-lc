import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Evita que el navegador intente restaurar el scroll por su cuenta;
// nosotros lo manejamos manualmente en Home.tsx para que al volver del
// detalle de un juego, el catálogo quede en la misma posición donde ibas.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
