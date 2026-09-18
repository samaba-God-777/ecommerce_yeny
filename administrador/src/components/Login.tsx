import { useState, useEffect } from 'react'
import { Lock, User, Eye, EyeOff, ShoppingBag, Mail, UserPlus, ArrowLeft } from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'

interface LoginProps {
  onLogin: (username: string, isAdmin: boolean) => void
}

interface RegisteredUser {
  username: string
  email: string
  password: string
  createdAt: string
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('yenyleths_users')
    if (saved) {
      setRegisteredUsers(JSON.parse(saved))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 800))

    // Admin credentials
    if (username === 'admin' && password === 'admin123') {
      onLogin(username, true)
      setIsLoading(false)
      return
    }

    // Check registered users directly from localStorage
    const saved = localStorage.getItem('yenyleths_users')
    const users: RegisteredUser[] = saved ? JSON.parse(saved) : []
    const user = users.find(
      u => u.username === username && u.password === password
    )

    if (user) {
      onLogin(user.username, false)
    } else {
      setError('Usuario o contraseña incorrectos')
    }
    
    setIsLoading(false)
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

    // Check if username already exists
    if (registeredUsers.some(u => u.username === username)) {
      setError('Este nombre de usuario ya está en uso')
      return
    }

    // Check if email already exists
    if (registeredUsers.some(u => u.email === email)) {
      setError('Este correo electrónico ya está registrado')
      return
    }

    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const newUser: RegisteredUser = {
      username,
      email,
      password,
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...registeredUsers, newUser]
    setRegisteredUsers(updatedUsers)
    localStorage.setItem('yenyleths_users', JSON.stringify(updatedUsers))

    setSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.')
    setIsLoading(false)
    
    setTimeout(() => {
      setIsRegister(false)
      setSuccess('')
      setUsername('')
      setPassword('')
      setEmail('')
      setConfirmPassword('')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ruled ledger hairlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.5]" aria-hidden>
        <div className="absolute inset-y-0 left-6 sm:left-10 w-px bg-line" />
        <div className="absolute inset-y-0 left-10 sm:left-16 w-px bg-line/60" />
        <div className="absolute inset-y-0 right-6 sm:right-10 w-px bg-line" />
        <div className="absolute inset-x-0 top-0 h-px bg-line" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Seal + wordmark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ink rounded-xl shadow-md mb-4">
            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Yenyleths</h1>
          <p className="text-market font-mono text-xs tracking-[0.2em] uppercase mt-1">Panel de Administración</p>
        </div>

        {/* Register card: a fresh ledger page */}
        <div className="bg-card rounded-xl border border-line shadow-lg p-8">
          <div className="text-center mb-6 border-b border-line pb-4">
            <h2 className="text-2xl font-extrabold text-foreground">
              {isRegister ? 'Crear Cuenta' : 'Abrir el Registro'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isRegister ? 'Regístrate para continuar' : 'Inicia sesión para administrar la tienda'}
            </p>
          </div>

          {isRegister ? (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <Input
                  label="Nombre de usuario"
                  placeholder="Tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <User className="absolute right-3 top-9 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="relative">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute right-3 top-9 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmar contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Lock className="absolute right-3 top-9 h-5 w-5 text-muted-foreground" />
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

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Creando cuenta...
                  </div>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Crear Cuenta
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setIsRegister(false)
                  setError('')
                  setSuccess('')
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <Input
                  label="Usuario"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
                <User className="absolute right-3 top-9 h-5 w-5 text-muted-foreground" />
              </div>

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <>
                    <Lock size={18} />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Toggle Login/Register */}
          <div className="mt-6 pt-5 border-t border-line">
            {isRegister ? (
              <p className="text-xs text-center text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => {
                    setIsRegister(false)
                    setError('')
                    setSuccess('')
                  }}
                  className="text-market hover:text-market-deep font-semibold"
                >
                  Iniciar Sesión
                </button>
              </p>
            ) : (
              <p className="text-xs text-center text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => {
                    setIsRegister(true)
                    setError('')
                  }}
                  className="text-market hover:text-market-deep font-semibold"
                >
                  Crear Cuenta
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-xs mt-6 font-mono">
          © 2024 Yenyleths Store · Registro de administración
        </p>
      </div>
    </div>
  )
}