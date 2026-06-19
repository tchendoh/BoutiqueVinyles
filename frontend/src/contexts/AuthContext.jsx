import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firstName, setFirstName] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(data => setFirstName(data.firstName))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function setUser(name) {
    setFirstName(name)
  }

  function clearUser() {
    setFirstName(null)
  }

  return (
    <AuthContext.Provider value={{ firstName, setUser, clearUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
