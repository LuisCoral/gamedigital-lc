import { ArrowDownRight, MessageCircle } from 'lucide-react'
import { STORE_CONFIG } from '../config/store'
import { buildWhatsAppLink } from '../utils/whatsapp'

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00F5FF 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF00D4 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
        <p className="text-neon-cyan text-sm font-medium mb-4">PS4 · PS5 · Nintendo</p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] max-w-2xl">
          Los juegos que buscas, al precio que esperas.
        </h1>
        <p className="text-text-secondary text-base md:text-lg mt-6 max-w-lg">
          Catálogo actualizado, precios claros y compra directa por WhatsApp.
          Sin filas, sin complicaciones.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-9">
          <a
            href="#catalogo"
            className="inline-flex items-center justify-center gap-2 bg-neon-cyan text-bg font-semibold rounded-full px-6 py-3 hover:brightness-110 transition"
          >
            Ver catálogo
            <ArrowDownRight className="w-4 h-4" />
          </a>
          <a
            href={buildWhatsAppLink(STORE_CONFIG.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-white/15 rounded-full px-6 py-3 hover:border-neon-green/60 hover:text-neon-green transition"
          >
            <MessageCircle className="w-4 h-4" />
            Escríbenos
          </a>
        </div>
      </div>
    </section>
  )
}
