import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'

const FALLBACK_IMAGE = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="560"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2a1d23"/><stop offset="100%" stop-color="#3d2b33"/></linearGradient></defs><rect width="1200" height="560" fill="url(#g)"/><text x="600" y="280" font-family="Arial, sans-serif" font-size="24" fill="#fffafc" text-anchor="middle">Pieza en el probador</text></svg>')

const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/3622613/pexels-photo-3622613.jpeg?auto=compress&cs=tinysrgb&w=1600',
    tag: 'Colección 2026',
    rack: 'Rack 01 · Nuevo ingreso',
    title: 'Moda que se siente',
    body: 'Piezas exclusivas de fashion, beauty y lifestyle para quienes buscan elegancia sin esfuerzo.',
  },
  {
    image: 'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=1600',
    tag: 'Línea Premium',
    rack: 'Rack 02 · Curaduría',
    title: 'Prendas seleccionadas a mano',
    body: 'Curaduría cuidadosa, calidad verificada y asesoría personal en cada compra.',
  },
  {
    image: 'https://images.pexels.com/photos/4992214/pexels-photo-4992214.jpeg?auto=compress&cs=tinysrgb&w=1600',
    tag: 'Envíos a todo Panamá',
    rack: 'Rack 03 · Salida',
    title: 'Su estilo, entregado',
    body: 'Compre en línea, cuente con nosotros: garantía y acompañamiento de principio a fin.',
  },
]

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 60 : -60, opacity: 0 }),
  }

  const slide = heroSlides[currentIndex]

  return (
    <div className="relative flex min-h-[560px] w-full overflow-hidden border border-line bg-ink lg:min-h-[600px]">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ opacity: { duration: 0.6 } }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt="Colección"
            decoding="async"
            className="h-full w-full object-cover opacity-55"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        </motion.div>
      </AnimatePresence>

      {/* stockroom floor line */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-paper" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-2 h-1 hazard" aria-hidden="true" />

      <div className="relative z-20 flex flex-col justify-center px-6 py-14 lg:px-14 lg:py-16">
        <div key={`r-${currentIndex}`} className="flex items-center gap-2">
          <span className="h-1 w-6 bg-market" aria-hidden="true" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-paper-elevated/70">
            {slide.rack}
          </p>
        </div>
        <motion.h1
          key={`h-${currentIndex}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="q mt-5 max-w-3xl font-display text-6xl font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-paper-elevated lg:text-8xl"
        >
          {slide.title}
        </motion.h1>
        <motion.p
          key={`b-${currentIndex}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 max-w-lg font-mono text-sm leading-relaxed text-paper-elevated/80"
        >
          {slide.body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#catalogo"
            className="plate bg-market text-paper-elevated hover:bg-market-deep"
            style={{ borderColor: 'transparent' }}
          >
            <Tag size={16} />
            Quiero esta pieza
          </a>
          <a
            href="#categorias"
            className="border-2 border-paper-elevated/60 px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.08em] text-paper-elevated transition hover:border-paper-elevated hover:bg-paper-elevated/10"
          >
            Ver colección
          </a>
        </motion.div>
      </div>

      {/* hanging swing tag, swinging once on slide change */}
      <div className="absolute right-6 top-8 z-30 hidden lg:block" aria-hidden="true">
        <div className="mx-auto h-3 w-3 rounded-full border border-paper-elevated/40" />
        <div className="h-10 w-px bg-paper-elevated/40" />
        <motion.div
          key={`tag-${currentIndex}`}
          initial={{ rotate: -6 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="swing swing-tag w-40 px-3 py-4 text-center shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        >
          <span className="text-[10px] opacity-90">{slide.tag}</span>
          <span className="mt-1 block text-[13px] leading-tight">Yenyleths</span>
          <span className="mt-1 block font-sans text-[15px] font-black text-ink">$ Ver pieza</span>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-6 z-30 flex gap-2 lg:left-14">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            aria-label={`Ir al slide ${index + 1}`}
            className={`h-1 transition-all ${
              index === currentIndex ? 'w-10 bg-market' : 'w-4 bg-paper-elevated/40 hover:bg-paper-elevated/70'
            }`}
          />
        ))}
      </div>

      <div className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2">
        <button
          onClick={handlePrev}
          className="border border-paper-elevated/30 p-2 text-paper-elevated transition-colors hover:bg-paper-elevated/10"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="border border-paper-elevated/30 p-2 text-paper-elevated transition-colors hover:bg-paper-elevated/10"
          aria-label="Siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
