import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Clock,
  CalendarDays,
  Navigation,
  Copy,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const TIMELINE_STEPS = [
  { label: 'Pedido Confirmado', description: 'Tu pedido ha sido recibido y confirmado', time: '28 Jun, 2:14 PM', done: true, icon: CheckCircle2 },
  { label: 'Preparando', description: 'Estamos preparando tu pedido con cuidado', time: '28 Jun, 4:30 PM', done: true, icon: Package },
  { label: 'Empacado', description: 'Tu pedido ha sido empacado con esmero', time: '29 Jun, 10:00 AM', done: true, icon: Package },
  { label: 'Enviado', description: 'Tu paquete está en camino', time: '29 Jun, 3:45 PM', done: true, icon: Truck },
  { label: 'En Camino', description: 'Tu paquete se encuentra en tránsito', time: '30 Jun, 8:00 AM', done: false, icon: Navigation },
  { label: 'Entregado', description: 'Tu pedido ha sido entregado', time: '', done: false, icon: CheckCircle2 },
]

const ORDER_SUMMARY = {
  id: 'YNY-2026-001',
  date: '28 de Junio, 2026',
  total: '$4,340',
  items: [
    { name: 'Vestido Flor de Luna', image: 'https://picsum.photos/seed/vestido1/200/200', size: 'M', qty: 1 },
    { name: 'Bolso Perlé Clutch', image: 'https://picsum.photos/seed/bolso1/200/200', size: 'Único', qty: 1 },
  ],
}

export default function OrderTracking() {
  const activeStepIndex = TIMELINE_STEPS.findIndex((s) => !s.done)
  const progress = activeStepIndex === -1 ? 100 : (activeStepIndex / (TIMELINE_STEPS.length - 1)) * 100

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brown/50 transition-colors hover:text-brown"
        >
          <ArrowLeft size={16} /> Volver a mi cuenta
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl text-brown">Seguimiento de Pedido</h1>
        <p className="mt-1 text-sm text-brown/50">Pedido {ORDER_SUMMARY.id} &middot; {ORDER_SUMMARY.date}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left */}
        <div className="space-y-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-gold/10"
          >
            <div className="relative h-64 w-full sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-pink-50 to-cream">
                {/* Stylized map elements */}
                <svg viewBox="0 0 800 400" className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid lines */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 35} x2="800" y2={i * 35} stroke="#ec4899" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 35} y1="0" x2={i * 35} y2="400" stroke="#ec4899" strokeWidth="0.5" />
                  ))}
                  {/* Road lines */}
                  <path d="M0 200 Q200 180 400 220 Q600 260 800 240" fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
                  <path d="M100 0 Q120 150 160 250 Q200 350 180 400" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
                  <path d="M500 0 Q480 100 520 200 Q560 300 540 400" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0 100 Q300 80 600 120 Q750 140 800 100" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {/* Route highlight */}
                <svg viewBox="0 0 800 400" className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M150 300 Q250 250 350 200 Q450 150 550 170 Q650 190 700 120"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                  />
                  {/* Origin */}
                  <circle cx="150" cy="300" r="10" fill="#ec4899" />
                  <circle cx="150" cy="300" r="5" fill="white" />
                  {/* Current position */}
                  <circle cx="550" cy="170" r="12" fill="#ec4899" opacity="0.3" />
                  <circle cx="550" cy="170" r="6" fill="#ec4899" />
                  {/* Destination */}
                  <circle cx="700" cy="120" r="10" fill="#fbcfe8" stroke="#ec4899" strokeWidth="2" />
                </svg>
                {/* Labels */}
                <div className="absolute left-[17%] top-[70%] rounded-full bg-gold px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                  Origen
                </div>
                <div className="absolute left-[67%] top-[40%] rounded-full bg-gold px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-gold/30">
                  <Truck size={10} className="mr-1 inline" /> En tránsito
                </div>
                <div className="absolute left-[86%] top-[25%] rounded-full border-2 border-dashed border-gold bg-white/80 px-3 py-1 text-[10px] font-bold text-gold-dark">
                  Destino
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gold/10 bg-beige p-6"
          >
            <h2 className="mb-6 font-serif text-xl text-brown">Estado del Envío</h2>

            {/* Progress bar */}
            <div className="relative mb-8 h-1 rounded-full bg-brown/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
              />
            </div>

            {/* Steps */}
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, i) => {
                const isActive = i === activeStepIndex
                const isPast = i < activeStepIndex
                const StepIcon = step.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="relative flex gap-4"
                  >
                    {/* Vertical line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                          isPast
                            ? 'bg-gold text-white shadow-md shadow-gold/20'
                            : isActive
                              ? 'bg-gold text-white shadow-lg shadow-gold/30 ring-4 ring-gold/20'
                              : 'bg-brown/5 text-brown/20'
                        }`}
                      >
                        <StepIcon size={18} />
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[32px] ${isPast ? 'bg-gold' : 'bg-brown/10'}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-6 ${!step.done && !isActive ? 'opacity-40' : ''}`}>
                      <p className={`text-sm font-semibold ${isPast || isActive ? 'text-brown' : 'text-brown/40'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-brown/40">{step.description}</p>
                      {step.time && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-brown/30">
                          <Clock size={10} />
                          {step.time}
                        </div>
                      )}
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-2 inline-block rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold-dark"
                        >
                          Actual
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-gold/10 bg-beige p-6"
          >
            <h2 className="mb-4 font-serif text-xl text-brown">Resumen del Pedido</h2>
            <div className="space-y-3">
              {ORDER_SUMMARY.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-brown">{item.name}</p>
                    <p className="text-xs text-brown/40">Talla {item.size} &middot; Cant. {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gold/10 pt-4">
              <p className="text-sm text-brown/50">Total</p>
              <p className="text-lg font-bold text-brown">{ORDER_SUMMARY.total}</p>
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* ETA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-gold/10 bg-gradient-to-br from-gold to-gold-dark p-6 text-white"
          >
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays size={18} />
              <p className="text-sm font-semibold opacity-90">Llegada Estimada</p>
            </div>
            <p className="font-serif text-3xl font-bold">3 Julio, 2026</p>
            <p className="mt-1 text-xs opacity-70">Entre 10:00 AM y 6:00 PM</p>
          </motion.div>

          {/* Courier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-gold/10 bg-beige p-6"
          >
            <h3 className="mb-4 font-serif text-lg text-brown">Paquetería</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                  <Truck size={18} className="text-gold-dark" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brown">DHL Express</p>
                  <p className="text-xs text-brown/40">Servicio internacional</p>
                </div>
              </div>
              <div className="rounded-xl bg-cream p-3">
                <p className="text-xs text-brown/40">Número de rastreo</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-medium text-brown">TRK-987654321</p>
                  <button className="text-brown/30 transition-colors hover:text-gold" title="Copiar">
                    <Copy size={13} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brown/10 bg-white py-2.5 text-xs font-medium text-brown transition-colors hover:bg-gold/5">
                  <Phone size={13} /> Llamar
                </button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brown/10 bg-white py-2.5 text-xs font-medium text-brown transition-colors hover:bg-gold/5">
                  <ExternalLink size={13} /> Rastrear
                </button>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-gold/10 bg-beige p-6"
          >
            <h3 className="mb-4 font-serif text-lg text-brown">Dirección de Entrega</h3>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
                <MapPin size={18} className="text-gold-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown">María García López</p>
                <p className="text-xs text-brown/50">Av. Reforma 456, Depto. 1202</p>
                <p className="text-xs text-brown/50">Col. Juárez, CDMX 06600</p>
                <p className="text-xs text-brown/50">México</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
