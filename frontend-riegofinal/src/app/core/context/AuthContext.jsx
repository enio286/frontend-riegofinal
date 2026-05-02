import { createContext, useContext, useEffect, useState } from "react"
import { loginRequest, logoutRequest, meRequest } from "../services/auth.service"
import { getAccessToken, getUser } from "../services/storage.service"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken()

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await meRequest()
        setUser(currentUser)
      } catch {
        logoutRequest()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (username, password) => {
    const currentUser = await loginRequest(username, password)
    setUser(currentUser)
    return currentUser
  }

  const logout = () => {
    logoutRequest()
    setUser(null)
  }

  const isAdmin = user?.is_staff || user?.is_superuser

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}