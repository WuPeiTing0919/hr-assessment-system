"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Users, Brain, Lightbulb, BarChart3, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/home")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">HR 評估系統</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild size="sm">
              <Link href="/login">登入</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">HR 評估系統</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed max-w-2xl mx-auto">
              專業的員工能力測評平台，透過科學的邏輯思維測試和創意能力評估，全面了解員工的綜合素質
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">系統特色</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              提供專業的測試類型和完整的分析報告，幫助企業全面評估員工能力
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">邏輯思維測試</h3>
              <p className="text-muted-foreground leading-relaxed">
                評估邏輯推理、分析判斷和問題解決能力，幫助識別具備優秀思維能力的人才
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">創意能力測試</h3>
              <p className="text-muted-foreground leading-relaxed">
                評估創新思維、想像力和創造性解決問題的能力，發掘具有創新潛力的員工
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">詳細分析報告</h3>
              <p className="text-muted-foreground leading-relaxed">
                提供完整的能力分析報告和發展建議，協助制定個人化的培訓計畫
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">安全可靠</h3>
              <p className="text-muted-foreground leading-relaxed">
                採用先進的資料加密技術，確保測試結果和個人資料的安全性
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">高效便捷</h3>
              <p className="text-muted-foreground leading-relaxed">
                線上測試系統，隨時隨地進行評估，大幅提升HR工作效率
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">多角色管理</h3>
              <p className="text-muted-foreground leading-relaxed">
                支援管理者和員工不同角色，提供個人化的使用體驗和權限管理
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
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
  )
}
