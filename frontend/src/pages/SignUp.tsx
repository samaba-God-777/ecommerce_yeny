import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { FcGoogle } from 'react-icons/fc'
import { ShoppingBag, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

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
      const { data } = await api.post('/auth/register', { username, email, password })
      if (data.success) {
        localStorage.setItem('customerToken', data.token)
        toast.success('¡Cuenta creada exitosamente!')
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-muted min-h-[calc(100vh-1px)]">
      <div className="flex h-full items-center justify-center px-4 py-16">
        <div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-1 lg:justify-start">
              <a href="/" className="flex items-center gap-2">
                <ShoppingBag className="h-9 w-9 text-gold" />
                <span className="font-serif text-xl font-semibold text-foreground">
                  Yenyleths Boutique
                </span>
              </a>
            </div>
            <h1 className="text-3xl font-semibold">Crear Cuenta</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Usuario</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-gold"
                  />
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Correo electrónico</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-gold"
                  />
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-gold"
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-lg bg-gold py-2.5 font-semibold text-white hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                <FcGoogle className="h-5 w-5" />
                Registrarse con Google
              </button>
            </div>
          </form>

          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>¿Ya tienes una cuenta?</p>
            <a href="/login" className="text-primary font-medium hover:underline">
              Iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
