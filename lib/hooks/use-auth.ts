"use client"

import { useState, useEffect, createContext } from "react"

export interface User {
  id: string
  name: string
  email: string
  department: string
  role: "user" | "admin"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "createdAt"> & { password: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 檢查是否有已登入的用戶
    const currentUser = localStorage.getItem("hr_current_user")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem("hr_current_user", JSON.stringify(data.user))
        return true
      } else {
        console.error('登入失敗:', data.error)
        return false
      }
    } catch (error) {
      console.error('登入錯誤:', error)
      return false
    }
  }

  const register = async (userData: Omit<User, "id" | "createdAt"> & { password: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem("hr_current_user", JSON.stringify(data.user))
        return true
      } else {
        console.error('註冊失敗:', data.error)
        return false
      }
    } catch (error) {
      console.error('註冊錯誤:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hr_current_user")
  }

  return {
    user,
    login,
    register,
    logout,
    isLoading,
  }
}
