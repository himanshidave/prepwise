import { createContext, useContext, useState, useEffect } from 'react'

/*
  AuthContext = Shared place to store login information.
  Any component can read isLoggedIn and user data using useAuth().
*/

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check localStorage when app loads (user was logged in before)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('prepwiseUser')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Error parsing saved user from localStorage:', error)
      localStorage.removeItem('prepwiseUser')
    }
  }, [])

  // Login function - saves user to state and localStorage
  function login(userData) {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('prepwiseUser', JSON.stringify(userData))
  }

  // Logout function - clears everything
  function logout() {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('prepwiseUser')
  }

  const value = {
    user,
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
