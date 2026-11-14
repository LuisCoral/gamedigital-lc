import { useEffect, useRef } from 'react'

// Nieve navideña ligera: un solo canvas fijo, sin capturar toques ni clics.
// Usa pocos copos (menos en celular), se pausa cuando la pestaña no se ve
// y no se muestra si el usuario pidió "reducir movimiento".
interface Flake {
  x: number
  y: number
  r: number
  speed: number
  drift: number
  phase: number
  alpha: number
}

export default function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let flakes: Flake[] = []
    let raf = 0
    let last = 0

    const makeFlake = (randomY: boolean): Flake => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -10,
      r: 1 + Math.random() * 2.6,
      speed: 25 + Math.random() * 45, // px por segundo
      drift: 8 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.45 + Math.random() * 0.45,
    })

    // En celular, al hacer scroll la barra del navegador se oculta y cambia
    // el alto de la ventana. Antes eso reiniciaba la nieve. Ahora solo se
    // reinician los copos si cambia el ANCHO (girar el teléfono, redimensionar);
    // el alto solo crece, nunca se encoge, y los copos siguen cayendo igual.
    function setup(resetFlakes: boolean) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const newWidth = window.innerWidth
      const newHeight = Math.max(window.innerHeight, height)
      const sizeChanged = newWidth !== width || newHeight !== height
      width = newWidth
      height = newHeight
      if (sizeChanged) {
        canvas!.width = Math.round(width * dpr)
        canvas!.height = Math.round(height * dpr)
        canvas!.style.width = `${width}px`
        canvas!.style.height = `${height}px`
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      if (resetFlakes) {
        const count = width < 640 ? 35 : 80
        flakes = Array.from({ length: count }, () => makeFlake(true))
      }
    }

    function resize() {
      if (window.innerWidth !== width) {
        height = 0 // cambió el ancho de verdad: se recalcula todo
        setup(true)
      } else if (window.innerHeight > height) {
        setup(false) // solo creció el alto: se amplía el lienzo, sin reiniciar
      }
    }

    function frame(time: number) {
      const dt = Math.min((time - last) / 1000 || 0, 0.05)
      last = time
      ctx!.clearRect(0, 0, width, height)
      for (const f of flakes) {
        f.y += f.speed * dt
        f.phase += dt
        const x = f.x + Math.sin(f.phase) * f.drift
        if (f.y > height + 10) Object.assign(f, makeFlake(false))
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(255,255,255,${f.alpha})`
        ctx!.arc(x, f.y, f.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    function onVisibility() {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    setup(true)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45]"
      style={{ transform: 'translateZ(0)' }}
    />
  )
}
