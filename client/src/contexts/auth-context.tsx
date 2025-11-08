import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import formAPi from "../api/api"
import { deleteToken, setAuthToken } from "../utils/authUtils"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await formAPi.get(`/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.status === 200) {
            const userData = response.data.data
            setUser(userData)
          } else {
            deleteToken();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await formAPi.post('/api/auth/login', {email, password});

    if (response.status !== 200) {
      const error = await response.data
      throw new Error(error.message || "Login failed")
    }

    const data =  response.data.data
    setAuthToken(data.token);
    setUser(data.user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const response = await formAPi.post('/api/auth/signUp', {username:name,email,password});
    if (response.status !== 200) {
      const error = response.data;
      throw new Error(error.message || "Signup failed")
    }


    localStorage.setItem("token", response.data.data.token)
    setUser(response.data.data.user)
  }

  const logout = () => {
    deleteToken()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
