import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, ShoppingBag, Send, CheckCircle2 } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth, mensajeDeError } from '../lib/firebase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      // Firebase responde igual exista o no la cuenta, salvo errores de forma
      // (correo mal escrito) o de conexion.
      if (err.code === 'auth/user-not-found') {
        setSent(true)
        return
      }
      setError(err.code ? mensajeDeError(err.code) : 'No pudimos enviar el correo. Intenta de nuevo.')
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
          {sent ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900 font-serif">Revisa tu correo</h2>
              <p className="text-slate-600 text-sm mt-3">
                Si <strong className="text-amber-900">{email}</strong> está registrado, te enviamos un
                enlace para elegir una contraseña nueva.
              </p>
              <p className="text-slate-500 text-xs mt-3">
                El enlace vence en una hora. Si no lo ves, mira en la carpeta de spam.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-6 text-sm text-pink-700 hover:text-amber-800 font-medium"
              >
                Usar otro correo
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-amber-900 font-serif">Recuperar contraseña</h2>
                <p className="text-slate-600 text-sm mt-1">
                  Escribe tu correo y te mandamos un enlace para cambiarla
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label className="text-sm font-medium text-amber-900">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    autoComplete="email"
                    autoFocus
                    className="w-full mt-1 rounded-lg border border-pink-200 bg-pink-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                  <Mail className="absolute right-3 top-9 h-5 w-5 text-slate-400" />
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
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar enlace
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-pink-700 transition-colors"
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
