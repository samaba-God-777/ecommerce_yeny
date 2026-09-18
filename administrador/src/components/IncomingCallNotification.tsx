import { motion } from 'framer-motion'
import { Phone, PhoneOff, User } from 'lucide-react'

interface IncomingCallNotificationProps {
  callerName: string
  onAccept: () => void
  onReject: () => void
}

export default function IncomingCallNotification({
  callerName,
  onAccept,
  onReject
}: IncomingCallNotificationProps) {
  return (
    <motion.div
      initial={{ top: -120 }}
      animate={{ top: 20 }}
      exit={{ top: -120 }}
      className="fixed left-1/2 -translate-x-1/2 z-[100] w-full max-w-md"
    >
      <div className="mx-4 rounded-2xl bg-gradient-to-r from-market to-market-deep shadow-2xl overflow-hidden">
        <div className="p-6 text-white">
          {/* Encabezado */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <User size={24} />
              </div>
            </motion.div>
            <div>
              <p className="text-sm opacity-90">Llamada entrante</p>
              <p className="text-lg font-bold">{callerName}</p>
            </div>
          </div>

          {/* Indicador de llamada */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-4 text-sm opacity-90 font-medium"
          >
            📱 Llamando...
          </motion.div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/25 hover:bg-white/35 transition font-semibold text-white backdrop-blur-sm"
            >
              <Phone size={20} />
              Aceptar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReject}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/40 hover:bg-red-500/60 transition font-semibold text-white backdrop-blur-sm"
            >
              <PhoneOff size={20} />
              Rechazar
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
