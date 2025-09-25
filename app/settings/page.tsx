"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Lock, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    department: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const departments = ["人力資源部", "資訊技術部", "財務部", "行銷部", "業務部", "研發部", "客服部", "其他"]

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        department: user.department,
      })
    }
  }, [user])

  const handleProfileUpdate = async () => {
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem("hr_users") || "[]")

      // Check if email is already taken by another user
      const emailExists = users.some((u: any) => u.email === profileData.email && u.id !== user?.id)
      if (emailExists) {
        setError("該電子郵件已被其他用戶使用")
        return
      }

      // Update user data
      const updatedUsers = users.map((u: any) =>
        u.id === user?.id
          ? { ...u, name: profileData.name, email: profileData.email, department: profileData.department }
          : u,
      )

      localStorage.setItem("hr_users", JSON.stringify(updatedUsers))

      // Update current user session
      const updatedUser = {
        ...user!,
        name: profileData.name,
        email: profileData.email,
        department: profileData.department,
      }
      localStorage.setItem("hr_current_user", JSON.stringify(updatedUser))

      setMessage("個人資料已成功更新")

      // Refresh page to update user context
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError("更新失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setError("")
    setMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("新密碼確認不一致")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("新密碼長度至少需要6個字元")
      return
    }

    setIsLoading(true)

    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem("hr_users") || "[]")

      // Find current user and verify current password
      const currentUser = users.find((u: any) => u.id === user?.id)
      if (!currentUser || currentUser.password !== passwordData.currentPassword) {
        setError("目前密碼不正確")
        return
      }

      // Update password
      const updatedUsers = users.map((u: any) => (u.id === user?.id ? { ...u, password: passwordData.newPassword } : u))

      localStorage.setItem("hr_users", JSON.stringify(updatedUsers))

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setMessage("密碼已成功更新")
    } catch (err) {
      setError("密碼更新失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回儀表板
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">帳戶設定</h1>
              <p className="text-sm text-muted-foreground">管理您的個人資料和帳戶設定</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                個人資料
              </CardTitle>
              <CardDescription>更新您的個人資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="請輸入您的姓名"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="請輸入電子郵件"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">部門</Label>
                <Select
                  value={profileData.department}
                  onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇部門" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>角色</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">{user.role === "admin" ? "管理員" : "一般用戶"}</span>
                  <p className="text-xs text-muted-foreground mt-1">角色由管理員設定，無法自行修改</p>
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={isLoading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "更新中..." : "更新個人資料"}
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                密碼設定
              </CardTitle>
              <CardDescription>更改您的登入密碼</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">目前密碼</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="請輸入目前密碼"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">新密碼</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="請輸入新密碼（至少6個字元）"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">確認新密碼</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="請再次輸入新密碼"
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={isLoading} className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                {isLoading ? "更新中..." : "更新密碼"}
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>帳戶資訊</CardTitle>
              <CardDescription>您的帳戶詳細資訊</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">用戶ID：</span>
                  <span className="font-mono">{user.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">建立時間：</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">登出帳戶</h4>
                  <p className="text-sm text-muted-foreground">結束目前的登入狀態</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout()
                    router.push("/login")
                  }}
                >
                  登出
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {message && (
            <Alert>
              <AlertDescription className="text-green-600">{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
