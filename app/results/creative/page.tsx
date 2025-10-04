"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Home } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"

interface CreativeTestResults {
  type: string
  score: number
  totalScore: number
  maxScore: number
  answers: Record<number, number>
  completedAt: string
}

export default function CreativeResultsPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<CreativeTestResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        // 從資料庫獲取最新的創意測驗結果
        const response = await fetch(`/api/test-results/creative?userId=${user.id}`)
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          // 按創建時間排序，取最新的結果
          const sortedResults = data.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          const latestResult = sortedResults[0]
          
          setResults({
            type: latestResult.type,
            score: latestResult.score,
            totalScore: latestResult.totalScore || latestResult.score,
            maxScore: latestResult.maxScore || 100,
            answers: latestResult.answers || {},
            completedAt: latestResult.created_at
          })
        } else {
          // 如果沒有資料庫結果，嘗試從 localStorage 載入
          const savedResults = localStorage.getItem("creativeTestResults")
          if (savedResults) {
            setResults(JSON.parse(savedResults))
          }
        }
      } catch (error) {
        console.error('Error loading creative test results:', error)
        // 如果 API 失敗，嘗試從 localStorage 載入
        const savedResults = localStorage.getItem("creativeTestResults")
        if (savedResults) {
          setResults(JSON.parse(savedResults))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">載入結果中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">未找到測試結果</p>
            <Button asChild>
              <Link href="/tests/creative">重新測試</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">創意能力測試完成！</h1>
          <p className="text-lg text-muted-foreground mb-6">
            感謝您完成創意能力測試，您的答案已成功提交。
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            完成時間：{new Date(results.completedAt).toLocaleString("zh-TW")}
          </p>
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/home">
                <Home className="w-4 h-4 mr-2" />
                返回首頁
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/tests/logic">
                開始邏輯測試
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/tests/combined">
                開始綜合測試
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}