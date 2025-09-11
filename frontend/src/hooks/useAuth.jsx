"use client"

import { useState, useEffect, createContext, useContext } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("fixbox_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("fixbox_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fixbox_user")
  }

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    localStorage.setItem("fixbox_user", JSON.stringify(newUser))
  }

  const value = { user, login, logout, register, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
