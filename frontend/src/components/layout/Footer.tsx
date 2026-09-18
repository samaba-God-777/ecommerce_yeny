import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, CheckCircle, Loader2 } from 'lucide-react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'
import { motion } from 'framer-motion'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail('')

    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <footer className="bg-ink text-paper-elevated">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mb-12 border-2 border-paper-elevated/20 px-6 py-8"
        >
          <div className="hazard-reverse absolute inset-x-0 top-0 h-1.5 opacity-70" aria-hidden="true" />
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div>
              <p className="plate bg-paper text-ink" style={{ borderColor: 'transparent' }}>Correspondencia</p>
              <h3 className="q mt-5 font-display text-3xl font-extrabold uppercase tracking-tight">Únase a la lista</h3>
              <p className="mt-2 font-mono text-sm text-paper-elevated/70">
                Acceso anticipado a colecciones y ofertas exclusivas.
              </p>
            </div>

            {isSubscribed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 border-2 border-market bg-paper px-6 py-3"
              >
                <CheckCircle size={20} className="text-market" />
                <span className="q font-display text-sm font-bold uppercase text-ink">¡Suscrito!</span>
              </motion.div>
            ) : (
              <form className="flex w-full max-w-md gap-2" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Tu correo electrónico"
                  className="w-full border-b-2 border-paper-elevated/40 bg-transparent px-1 py-3 font-mono text-sm text-paper-elevated placeholder:text-paper-elevated/40 outline-none transition-colors focus:border-market"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shrink-0 border-2 border-paper-elevated px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.06em] text-paper-elevated transition hover:bg-market hover:border-market disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Anotarme'
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <h4 className="q mb-4 font-display text-2xl font-extrabold uppercase tracking-tight">Yenyleths</h4>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper-elevated/50">Boutique · Fashion, Beauty & Lifestyle</p>
            <p className="mt-3 font-mono text-sm text-paper-elevated/70">+507 6377-6327</p>
          </div>
          <div>
            <h5 className="q mb-4 block font-display text-base font-bold uppercase tracking-[0.08em] text-paper-elevated/80">Ayuda</h5>
            <ul className="space-y-2 text-sm text-paper-elevated/70">
              <li><Link to="/faq" className="transition-colors hover:text-market">FAQ</Link></li>
              <li><Link to="/shipping" className="transition-colors hover:text-market">Envíos</Link></li>
              <li><Link to="/returns" className="transition-colors hover:text-market">Devoluciones</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-market">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="q mb-4 block font-display text-base font-bold uppercase tracking-[0.08em] text-paper-elevated/80">Empresa</h5>
            <ul className="space-y-2 text-sm text-paper-elevated/70">
              <li><Link to="/about" className="transition-colors hover:text-market">Sobre nosotros</Link></li>
              <li><Link to="/politica-de-privacidad" className="transition-colors hover:text-market">Política de Privacidad</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-market">Términos</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="q mb-4 block font-display text-base font-bold uppercase tracking-[0.08em] text-paper-elevated/80">Síguenos</h5>
            <div className="flex gap-3">
              <a href="https://wa.me/50763776327" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="border-2 border-paper-elevated/25 p-2 transition-colors hover:border-market hover:text-market">
                <MessageCircle size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="border-2 border-paper-elevated/25 p-2 transition-colors hover:border-market hover:text-market">
                <FaInstagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="border-2 border-paper-elevated/25 p-2 transition-colors hover:border-market hover:text-market">
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t-2 border-paper-elevated/15 pt-6 text-xs text-paper-elevated/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Yenyleths Boutique. Todos los derechos reservados.</p>
          <p className="font-mono uppercase tracking-[0.18em]">Rack al día · Contado y crédito</p>
        </div>
      </div>
    </footer>
  )
}