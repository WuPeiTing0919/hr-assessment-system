"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Building, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TestLinkPage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    department: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }))
    setError('') // 清除錯誤訊息
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userInfo.name || !userInfo.email || !userInfo.department) {
      setError('請填寫所有必填欄位')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // 註冊用戶
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          department: userInfo.department,
          password: 'Aa123456', // 預設密碼
          role: 'user'
        }),
      })

      if (response.ok) {
        // 註冊成功後自動登入
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userInfo.email,
            password: 'Aa123456'
          }),
        })

        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          
          // 存儲 token 和用戶資料到 localStorage
          if (loginData.accessToken && loginData.refreshToken) {
            localStorage.setItem('accessToken', loginData.accessToken)
            localStorage.setItem('refreshToken', loginData.refreshToken)
            localStorage.setItem('hr_current_user', JSON.stringify(loginData.user))
          }
          
          setIsSuccess(true)
          // 2秒後跳轉到個人專區（儀表板）
          setTimeout(() => {
            // 使用 window.location.href 確保頁面完全重新載入
            window.location.href = '/home'
          }, 2000)
        } else {
          setError('註冊成功但自動登入失敗，請手動登入')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || '註冊失敗，請稍後再試')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('註冊失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-600">註冊成功！</h2>
                <p className="text-muted-foreground mt-2">
                  正在跳轉到個人專區...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">測驗資料收集</CardTitle>
          <CardDescription>
            請填寫以下資料以開始測驗
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                姓名
              </Label>
              <Input
                id="name"
                placeholder="請輸入您的姓名"
                value={userInfo.name}
                onChange={(e) => handleUserInfoChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                電子郵件
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="請輸入電子郵件"
                value={userInfo.email}
                onChange={(e) => handleUserInfoChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                部門
              </Label>
              <Select 
                value={userInfo.department} 
                onValueChange={(value) => handleUserInfoChange('department', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="請選擇部門" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="資訊技術部">資訊技術部</SelectItem>
                  <SelectItem value="人力資源部">人力資源部</SelectItem>
                  <SelectItem value="財務部">財務部</SelectItem>
                  <SelectItem value="行銷部">行銷部</SelectItem>
                  <SelectItem value="營運部">營運部</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  處理中...
                </>
              ) : (
                '開始測驗'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
