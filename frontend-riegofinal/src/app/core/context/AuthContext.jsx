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

  const primaryRole = user?.primary_role || null
  const roles = user?.roles || []

  const isAdmin =
    user?.is_superuser ||
    user?.is_staff ||
    primaryRole === "ADMIN" ||
    roles.includes("ADMIN")

  const isOperador = primaryRole === "OPERADOR" || roles.includes("OPERADOR")
  const isVisor = primaryRole === "VISOR" || roles.includes("VISOR")

  const hasRole = (role) => {
    if (isAdmin) return true
    return primaryRole === role || roles.includes(role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        roles,
        primaryRole,
        isAdmin,
        isOperador,
        isVisor,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}