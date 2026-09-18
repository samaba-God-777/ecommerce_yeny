import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  User,
  Camera,
  Save,
  Lock,
  Mail,
  Smartphone,
  Bell,
  Globe,
  DollarSign,
  Moon,
  Sun,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '../../components/ui/button'

const genderOptions = [
  { value: '', label: 'Seleccionar...' },
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
  { value: 'non-binary', label: 'No binario' },
  { value: 'other', label: 'Otro' },
  { value: 'prefer-not', label: 'Prefiero no decir' },
]

const languageOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD - Dólar Americano' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'PAB', label: 'PAB - Balboa' },
  { value: 'COP', label: 'COP - Peso Colombiano' },
]

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function DashboardProfile() {
  const [firstName, setFirstName] = useState('María')
  const [lastName, setLastName] = useState('González')
  const [email, setEmail] = useState('maria.gonzalez@email.com')
  const [phone, setPhone] = useState('+507 6123 4567')
  const [birthday, setBirthday] = useState('1995-03-15')
  const [gender, setGender] = useState('female')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)

  const [language, setLanguage] = useState('es')
  const [currency, setCurrency] = useState('USD')
  const [darkMode, setDarkMode] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPw, setIsChangingPw] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  const handleSaveProfile = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    }, 1000)
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return
    setIsChangingPw(true)
    setTimeout(() => {
      setIsChangingPw(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }, 1000)
  }

  const renderToggle = (
    enabled: boolean,
    onChange: (v: boolean) => void,
    label: string,
    description: string,
    icon: React.ReactNode
  ) => (
    <div className="flex items-center justify-between rounded-xl border border-brown/8 p-4 transition-colors hover:bg-beige/50">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-brown">{label}</p>
          <p className="text-[11px] text-brown/50">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          enabled ? 'bg-gold' : 'bg-brown/20'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-serif text-3xl font-bold text-brown">Mi Perfil</h1>
        <p className="mt-1 text-sm text-brown/60">Gestiona tu información personal y preferencias.</p>
      </motion.div>

      {/* Profile Picture */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 rounded-2xl border border-brown/8 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gold/20 bg-beige">
              <img
                src="https://picsum.photos/seed/avatar/200/200"
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brown text-cream shadow-md transition-colors hover:bg-brown/90">
              <Camera size={14} />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-xl font-bold text-brown">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-brown/50">{email}</p>
            <p className="mt-1 text-xs text-brown/40">Miembro desde Junio 2026</p>
          </div>
        </div>
      </motion.section>

      {/* Personal Information */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="mb-8 rounded-2xl border border-brown/8 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-gold" />
          <h2 className="font-serif text-lg font-bold text-brown">Información Personal</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-brown/15 bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-brown/15 bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Correo electrónico</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-brown/15 bg-beige py-2.5 pl-9 pr-4 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Teléfono</label>
            <div className="relative">
              <Smartphone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/30" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-brown/15 bg-beige py-2.5 pl-9 pr-4 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Fecha de nacimiento</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full rounded-xl border border-brown/15 bg-beige px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Género</label>
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full appearance-none rounded-xl border border-brown/15 bg-beige px-4 py-2.5 pr-10 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                {genderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown/30" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-full bg-brown px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown/90 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
            ) : profileSaved ? (
              <>
                <Check size={16} />
                Guardado
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar cambios
              </>
            )}
          </motion.button>
        </div>
      </motion.section>

      {/* Change Password */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="mb-8 rounded-2xl border border-brown/8 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <Lock size={18} className="text-gold" />
          <h2 className="font-serif text-lg font-bold text-brown">Cambiar Contraseña</h2>
        </div>

        <div className="grid max-w-md gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Contraseña actual</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/30" />
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-brown/15 bg-beige py-2.5 pl-9 pr-10 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/30 hover:text-brown/60"
              >
                {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Nueva contraseña</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/30" />
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-brown/15 bg-beige py-2.5 pl-9 pr-10 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/30 hover:text-brown/60"
              >
                {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-brown/60">Confirmar nueva contraseña</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/30" />
              <input
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-brown/15 bg-beige py-2.5 pl-9 pr-10 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/30 hover:text-brown/60"
              >
                {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-[11px] text-red-400">Las contraseñas no coinciden</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleChangePassword}
            disabled={isChangingPw || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className="flex items-center gap-2 rounded-full border border-brown/15 px-6 py-2.5 text-sm font-medium text-brown transition-colors hover:bg-beige disabled:opacity-50"
          >
            {isChangingPw ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brown/30 border-t-brown" />
            ) : (
              <>
                <Lock size={16} />
                Actualizar contraseña
              </>
            )}
          </motion.button>
        </div>
      </motion.section>

      {/* Communication Preferences */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className="mb-8 rounded-2xl border border-brown/8 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-gold" />
          <h2 className="font-serif text-lg font-bold text-brown">Preferencias de Comunicación</h2>
        </div>

        <div className="space-y-3">
          {renderToggle(
            emailNotifications,
            setEmailNotifications,
            'Notificaciones por email',
            'Recibe ofertas, novedades y actualizaciones por correo.',
            <Mail size={16} />
          )}
          {renderToggle(
            smsNotifications,
            setSmsNotifications,
            'Notificaciones por SMS',
            'Recibe alertas de envíos y promociones por mensaje de texto.',
            <Smartphone size={16} />
          )}
          {renderToggle(
            pushNotifications,
            setPushNotifications,
            'Notificaciones push',
            'Recibe notificaciones en tu dispositivo cuando haya novedades.',
            <Bell size={16} />
          )}
        </div>
      </motion.section>

      {/* Preferences */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="mb-8 rounded-2xl border border-brown/8 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <Globe size={18} className="text-gold" />
          <h2 className="font-serif text-lg font-bold text-brown">Preferencias</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Language */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-brown/60">
              <Globe size={12} />
              Idioma
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none rounded-xl border border-brown/15 bg-beige px-4 py-2.5 pr-10 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown/30" />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-brown/60">
              <DollarSign size={12} />
              Moneda
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full appearance-none rounded-xl border border-brown/15 bg-beige px-4 py-2.5 pr-10 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brown/30" />
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-brown/8 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <div>
              <p className="text-sm font-medium text-brown">Modo oscuro</p>
              <p className="text-[11px] text-brown/50">Cambia la apariencia de la interfaz.</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              darkMode ? 'bg-gold' : 'bg-brown/20'
            }`}
          >
            <motion.div
              animate={{ x: darkMode ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        className="mb-12 rounded-2xl border border-red-200 bg-red-50/50 p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-400" />
          <h2 className="font-serif text-lg font-bold text-red-600">Zona de Peligro</h2>
        </div>
        <p className="text-sm text-red-500/70">
          Eliminar tu cuenta es permanente. Se perderán todos tus datos, pedidos y favoritos.
        </p>

        <AnimatePresence>
          {showDeleteConfirm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-xl border border-red-200 bg-white p-4">
                <p className="text-sm font-medium text-red-600">
                  ¿Estás seguro? Escribe "ELIMINAR" para confirmar.
                </p>
                <div className="mt-3 flex gap-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    <Trash2 size={14} />
                    Eliminar cuenta
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-4 flex items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-100"
            >
              <Trash2 size={16} />
              Eliminar mi cuenta
            </motion.button>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  )
}
