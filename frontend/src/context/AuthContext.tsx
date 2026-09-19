import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth'
import { auth } from '../lib/firebase'
import api from '../lib/api'

interface User {
  id: string
  username: string
  email: string
  isAdmin?: boolean
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  /** Sincroniza el perfil tras iniciar sesion o registrarse. */
  sincronizar: (username?: string) => Promise<User | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  sincronizar: async () => null,
  logout: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Sesion con Firebase Auth.
 *
 * Firebase mantiene la sesion en el navegador y renueva el token solo; aqui
 * solo se escucha ese estado y se trae el perfil del API, que es donde viven
 * el nombre de usuario, el telefono y la direccion.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const traerPerfil = async (username?: string): Promise<User | null> => {
    try {
      const { data } = await api.get('/auth/me')
      if (data.success) return data.user
      return null
    } catch (err: any) {
      // Cuenta recien creada en Auth: todavia no tiene perfil en el API
      if (err.response?.status === 404) {
        const { data } = await api.post('/auth/ensure-profile', username ? { username } : {})
        return data.user ?? null
      }
      return null
    }
  }

  const sincronizar = async (username?: string) => {
    const perfil = await traerPerfil(username)
    setUser(perfil)
    return perfil
  }

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, async (cuenta: FirebaseUser | null) => {
      if (!cuenta) {
        setUser(null)
        setLoading(false)
        return
      }
      await sincronizar()
      setLoading(false)
    })
    return cancelar
  }, [])

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, sincronizar, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
