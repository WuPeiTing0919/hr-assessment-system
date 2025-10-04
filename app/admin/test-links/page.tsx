"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Copy,
  Link as LinkIcon,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default function TestLinksPage() {
  const handleCopyLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/test-link`
    navigator.clipboard.writeText(url)
    alert('連結已複製到剪貼簿')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回儀表板
                </Link>
              </Button>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">測驗連結管理</h1>
                <p className="text-sm text-muted-foreground">
                  管理測驗連結的發送和追蹤測試完成狀態
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <LinkIcon className="w-6 h-6" />
                  測驗連結
                </CardTitle>
                <CardDescription>
                  分享此連結給受測者，點擊後會自動收集用戶資料並開始測驗
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 連結顯示區域 */}
                <div className="space-y-3">
                  <Label>測驗連結</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/test-link`}
                      readOnly
                      className="text-sm"
                    />
                    <Button
                      onClick={() => {
                        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/test-link`
                        navigator.clipboard.writeText(url)
                        alert('連結已複製到剪貼簿')
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 功能說明 */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">功能說明：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 受測者點擊連結後會要求填寫基本資料</li>
                    <li>• 系統會自動創建用戶帳號（密碼：Aa123456）</li>
                    <li>• 填寫完成後自動跳轉到測驗選擇頁面</li>
                    <li>• 支援邏輯思維、創意能力、綜合測試三種類型</li>
                  </ul>
                </div>

                {/* 預覽按鈕 */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => window.open('/test-link', '_blank')}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    預覽測驗頁面
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  )
}