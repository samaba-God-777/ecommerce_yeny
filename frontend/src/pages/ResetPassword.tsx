import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, ShoppingBag, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth, mensajeDeError } from '../lib/firebase'

export default function ResetPassword() {
  const [params] = useSearchParams()
  // Firebase llama a este parametro oobCode; se acepta token por compatibilidad
  const token = params.get('oobCode') || params.get('token') || ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    try {
      // verify primero: asi un enlace vencido se avisa antes de cambiar nada
      await verifyPasswordResetCode(auth, token)
      await confirmPasswordReset(auth, token, password)
      setDone(true)
      toast.success('Contraseña actualizada')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err: any) {
      if (['auth/expired-action-code', 'auth/invalid-action-code'].includes(err.code)) {
        setError('El enlace no es válido o ya venció. Pide uno nuevo.')
      } else {
        setError(err.code ? mensajeDeError(err.code) : 'No pudimos cambiar la contraseña. Intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-2xl mb-4">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-serif">Yenyleths Boutique</h1>
          <p className="text-yellow-300/80 text-sm mt-1">Tu tienda de moda</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          {!token ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 mb-4">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900 font-serif">Enlace incompleto</h2>
              <p className="text-slate-600 text-sm mt-3">
                Abre el enlace tal como llegó en el correo, o pide uno nuevo.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block mt-6 text-sm text-amber-700 hover:text-amber-800 font-medium"
              >
                Pedir un enlace nuevo
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900 font-serif">¡Listo!</h2>
              <p className="text-slate-600 text-sm mt-3">
                Tu contraseña quedó cambiada. Te llevamos al inicio de sesión...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-amber-900 font-serif">Nueva contraseña</h2>
                <p className="text-slate-600 text-sm mt-1">Elige la contraseña con la que vas a entrar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label className="text-sm font-medium text-amber-900">Nueva contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    autoFocus
                    className="w-full mt-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-amber-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative">
                  <label className="text-sm font-medium text-amber-900">Repite la contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full mt-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-2.5 rounded-lg font-semibold hover:from-amber-800 hover:to-amber-900 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Guardar contraseña
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          © 2024 Yenyleths Boutique. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
