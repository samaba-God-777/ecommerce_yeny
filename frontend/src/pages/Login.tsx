import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, mensajeDeError } from '../lib/firebase'
import { Lock, User, Eye, EyeOff, ShoppingBag, Mail, UserPlus, ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user, loading: authLoading, sincronizar } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (user) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Firebase Auth identifica por correo, no por nombre de usuario
      await signInWithEmailAndPassword(auth, email, password)
      const perfil = await sincronizar()
      toast.success(`¡Bienvenido, ${perfil?.username || ''}!`)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.code ? mensajeDeError(err.code) : 'No pudimos iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await sincronizar(username)
      setSuccess('¡Cuenta creada exitosamente!')
      toast.success('¡Cuenta creada exitosamente!')
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err: any) {
      setError(err.code ? mensajeDeError(err.code) : 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-2xl mb-4">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white font-serif">Yenyleths Boutique</h1>
          <p className="text-yellow-300/80 text-sm mt-1">Tu tienda de moda</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-amber-900 font-serif">
              {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              {isRegister ? 'Regístrate para continuar' : 'Inicia sesión para continuar'}
            </p>
          </div>

          {isRegister ? (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-amber-900">Nombre de usuario</label>
                <input
                  placeholder="Tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full mt-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <User className="absolute right-3 top-9 h-5 w-5 text-slate-400" />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-amber-900">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <Mail className="absolute right-3 top-9 h-5 w-5 text-slate-400" />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-amber-900">Contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                <label className="text-sm font-medium text-amber-900">Confirmar contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full mt-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <Lock className="absolute right-3 top-9 h-5 w-5 text-slate-400" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 text-center">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-2.5 rounded-lg font-semibold hover:from-amber-800 hover:to-amber-900 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Crear Cuenta
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegister(false)
                  setError('')
                  setSuccess('')
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-amber-700 transition-colors py-2"
              >
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <label className="text-sm font-medium text-amber-900">Correo electrónico</label>
                <input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full mt-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <Mail className="absolute right-3 top-9 h-5 w-5 text-slate-400" />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-amber-900">Contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

              <div className="flex justify-end -mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-2.5 rounded-lg font-semibold hover:from-amber-800 hover:to-amber-900 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle Login/Register */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            {isRegister ? (
              <p className="text-xs text-center text-slate-600">
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => {
                    setIsRegister(false)
                    setError('')
                    setSuccess('')
                  }}
                  className="text-amber-700 hover:text-amber-800 font-medium"
                >
                  Iniciar Sesión
                </button>
              </p>
            ) : (
              <p className="text-xs text-center text-slate-600">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => {
                    setIsRegister(true)
                    setError('')
                  }}
                  className="text-amber-700 hover:text-amber-800 font-medium"
                >
                  Crear Cuenta
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/50 text-xs mt-6">
          © 2024 Yenyleths Boutique. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
