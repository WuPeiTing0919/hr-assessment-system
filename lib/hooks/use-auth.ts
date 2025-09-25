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

// 預設用戶數據
const defaultUsers = [
  {
    id: "admin-1",
    name: "系統管理員",
    email: "admin@company.com",
    password: "admin123",
    department: "人力資源部",
    role: "admin" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-1",
    name: "張小明",
    email: "user@company.com",
    password: "user123",
    department: "資訊技術部",
    role: "user" as const,
    createdAt: new Date().toISOString(),
  },
]

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 初始化預設用戶數據
    const existingUsers = localStorage.getItem("hr_users")
    if (!existingUsers) {
      localStorage.setItem("hr_users", JSON.stringify(defaultUsers))
    }

    // 檢查是否有已登入的用戶
    const currentUser = localStorage.getItem("hr_current_user")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("hr_users") || "[]")
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      setUser(userWithoutPassword)
      localStorage.setItem("hr_current_user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (userData: Omit<User, "id" | "createdAt"> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("hr_users") || "[]")

    // 檢查電子郵件是否已存在
    if (users.some((u: any) => u.email === userData.email)) {
      return false
    }

    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("hr_users", JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("hr_current_user", JSON.stringify(userWithoutPassword))

    return true
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
