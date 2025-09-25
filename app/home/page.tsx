"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, BarChart3, Users, Settings, Menu, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // 調試信息
  console.log("Current user:", user)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">HR 評估系統</h1>
                  <p className="text-sm text-muted-foreground">員工能力測評平台</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {/* Navigation Links */}
                <div className="flex items-center gap-12">
                  <Link 
                    href={user?.role === "admin" ? "/admin/results" : "/results"} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {user?.role === "admin" ? "所有測試結果" : "我的測試結果"}
                  </Link>
                  {user?.role === "admin" && (
                    <Link 
                      href="/admin/analytics" 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      部門分析
                    </Link>
                  )}
                </div>
                
                {/* 自定義下拉選單 */}
                <div className="relative" ref={dropdownRef}>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 hover:bg-accent px-6 py-6 text-foreground rounded-lg group"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground group-hover:text-white">{user?.name || '系統管理員'}</p>
                      <p className="text-xs text-muted-foreground group-hover:text-white/80">{user?.department || '人力資源部'}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform group-hover:text-white ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-background border border-border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <Link 
                          href="/settings" 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          帳戶設定
                        </Link>
                        {user?.role === "admin" && (
                          <>
                            <div className="border-t border-border my-1"></div>
                            <Link 
                              href="/admin/users" 
                              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Users className="w-4 h-4" />
                              用戶管理
                            </Link>
                            <Link 
                              href="/admin/questions" 
                              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Brain className="w-4 h-4" />
                              題目管理
                            </Link>
                          </>
                        )}
                        <div className="border-t border-border my-1"></div>
                        <button 
                          onClick={() => {
                            handleLogout()
                            setIsDropdownOpen(false)
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left"
                        >
                          登出
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="text-left">選單</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4 px-4">
                      <div className="pb-4 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.department}</p>
                      </div>
                      
                      {/* Navigation Links */}
                      <Button asChild variant="ghost" className="w-full justify-start px-4">
                        <Link href={user?.role === "admin" ? "/admin/results" : "/results"} className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          {user?.role === "admin" ? "所有測試結果" : "我的測試結果"}
                        </Link>
                      </Button>
                      {user?.role === "admin" && (
                        <Button asChild variant="ghost" className="w-full justify-start px-4">
                          <Link href="/admin/analytics" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            部門分析
                          </Link>
                        </Button>
                      )}
                      
                      <Button asChild variant="ghost" className="w-full justify-start px-4">
                        <Link href="/settings" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          帳戶設定
                        </Link>
                      </Button>
                      {user?.role === "admin" && (
                        <>
                          <Button asChild variant="ghost" className="w-full justify-start px-4">
                            <Link href="/admin/users" className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              用戶管理
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" className="w-full justify-start px-4">
                            <Link href="/admin/questions" className="flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              題目管理
                            </Link>
                          </Button>
                        </>
                      )}
                      <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 px-4">
                        登出
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-8 md:py-16 px-4 flex items-center">
          <div className="container mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6 text-balance">
                歡迎回來，{user?.name}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
                透過科學的邏輯思維測試和創意能力評估，全面了解您的綜合素質
              </p>
            </div>
          </div>
        </section>

        {/* Test Cards / Admin Info Cards */}
        <section className="py-8 md:py-16 px-4">
          <div className="container mx-auto">
            {user?.role === "admin" ? (
              // 管理者看到的介紹卡片
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
                {/* 邏輯思維測試介紹 */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">邏輯思維測試</CardTitle>
                    <CardDescription>評估邏輯推理、分析判斷和問題解決能力</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">題目數量</span>
                        <span className="text-sm font-bold text-primary">10題</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">題目類型</span>
                        <span className="text-sm font-bold text-primary">單選題</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">預計時間</span>
                        <span className="text-sm font-bold text-primary">15-20分鐘</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 創意能力測試介紹 */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/20">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                      <Lightbulb className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">創意能力測試</CardTitle>
                    <CardDescription>評估創新思維、想像力和創造性解決問題的能力</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">題目數量</span>
                        <span className="text-sm font-bold text-accent">20題</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">題目類型</span>
                        <span className="text-sm font-bold text-accent">5級量表</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">預計時間</span>
                        <span className="text-sm font-bold text-accent">25-30分鐘</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 綜合測試介紹 */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 md:col-span-2 lg:col-span-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">綜合測試</CardTitle>
                    <CardDescription>完整的邏輯思維 + 創意能力雙重評估，獲得全面的能力報告</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">總題目數</span>
                        <span className="text-sm font-bold text-primary">30題</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">預計時間</span>
                        <span className="text-sm font-bold text-accent">45分鐘</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // 一般用戶看到的測試功能
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
                {/* Logic Test */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">邏輯思維測試</CardTitle>
                    <CardDescription>評估邏輯推理能力</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button asChild className="w-full">
                      <Link href="/tests/logic">開始測試</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Creative Test */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/20">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                      <Lightbulb className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">創意能力測試</CardTitle>
                    <CardDescription>評估創新思維能力</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                    >
                      <Link href="/tests/creative">開始測試</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Combined Test */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 md:col-span-2 lg:col-span-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">綜合測試</CardTitle>
                    <CardDescription>完整能力評估</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button asChild size="lg" className="w-full">
                      <Link href="/tests/combined">開始測試</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-12 px-4 mt-16">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* 左側內容 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-lg font-semibold">HR 評估系統</span>
                  <p className="text-muted-foreground text-sm">專業的員工能力測評解決方案，助力企業人才發展</p>
                </div>
              </div>
              
              {/* 右側內容 */}
              <div className="text-sm text-muted-foreground">
                © 2025 HR 評估系統. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
