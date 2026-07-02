import { createContext, useContext, useState, useEffect } from 'react'

/*
  AuthContext = Shared place to store login information.
  Any component can read isLoggedIn and user data using useAuth().
*/

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check localStorage when app loads (user was logged in before)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('prepwiseUser')
      const savedToken = localStorage.getItem('prepwiseToken')
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Error parsing saved user from localStorage:', error)
      localStorage.removeItem('prepwiseUser')
      localStorage.removeItem('prepwiseToken')
    }
  }, [])

  // Login - persists the backend-issued JWT + user profile
  function login({ token: authToken, user: userData }) {
    setUser(userData)
    setToken(authToken)
    setIsLoggedIn(true)
    localStorage.setItem('prepwiseUser', JSON.stringify(userData))
    localStorage.setItem('prepwiseToken', authToken)
  }

  // Logout function - clears everything
  function logout() {
    setUser(null)
    setToken(null)
    setIsLoggedIn(false)
    localStorage.removeItem('prepwiseUser')
    localStorage.removeItem('prepwiseToken')
  }

  const value = {
    user,
    token,
    isLoggedIn,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook - easy way to use auth in any component
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
