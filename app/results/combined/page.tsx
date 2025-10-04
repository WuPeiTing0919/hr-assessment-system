"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Home } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"

interface CombinedTestResults {
  type: string
  logicScore: number
  creativityScore: number
  overallScore: number
  level: string
  description: string
  breakdown: {
    logic: number
    creativity: number
    balance: number
  }
  logicAnswers: Record<number, string>
  creativeAnswers: Record<number, number>
  logicCorrect: number
  creativityTotal: number
  creativityMaxScore: number
  completedAt: string
}

export default function CombinedResultsPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<CombinedTestResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        // 從資料庫獲取最新的綜合測驗結果
        const response = await fetch(`/api/test-results/combined?userId=${user.id}`)
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          // 按創建時間排序，取最新的結果
          const sortedResults = data.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          const latestResult = sortedResults[0]
          
          setResults({
            type: latestResult.type,
            logicScore: latestResult.logicScore || 0,
            creativityScore: latestResult.creativityScore || 0,
            overallScore: latestResult.overallScore || latestResult.score || 0,
            level: latestResult.level || "待評估",
            description: latestResult.description || "測試完成",
            breakdown: latestResult.breakdown || {
              logic: latestResult.logicScore || 0,
              creativity: latestResult.creativityScore || 0,
              balance: latestResult.balance || 0
            },
            logicAnswers: latestResult.logicAnswers || {},
            creativeAnswers: latestResult.creativeAnswers || {},
            logicCorrect: latestResult.logicCorrect || 0,
            creativityTotal: latestResult.creativityTotal || 0,
            creativityMaxScore: latestResult.creativityMaxScore || 100,
            completedAt: latestResult.created_at
          })
        } else {
          // 如果沒有資料庫結果，嘗試從 localStorage 載入
          const savedResults = localStorage.getItem("combinedTestResults")
          if (savedResults) {
            setResults(JSON.parse(savedResults))
          }
        }
      } catch (error) {
        console.error('Error loading combined test results:', error)
        // 如果 API 失敗，嘗試從 localStorage 載入
        const savedResults = localStorage.getItem("combinedTestResults")
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
              <Link href="/tests/combined">重新測試</Link>
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
            <BarChart3 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">綜合測試完成！</h1>
          <p className="text-lg text-muted-foreground mb-6">
            感謝您完成綜合能力測試，您的答案已成功提交。
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
              <Link href="/tests/creative">
                開始創意測試
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}