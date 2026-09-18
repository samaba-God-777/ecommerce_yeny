import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../lib/api'

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        if (data.success) {
          setUser(data.user)
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('customerToken')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('customerToken', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('customerToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
