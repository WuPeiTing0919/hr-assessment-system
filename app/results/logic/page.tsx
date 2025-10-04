"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Brain, Home, RotateCcw, Printer, Share2 } from "lucide-react"
import Link from "next/link"

interface LogicQuestion {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation?: string
  created_at: string
}

interface LogicTestResults {
  type: string
  score: number
  correctAnswers: number
  totalQuestions: number
  answers: Record<number, string>
  completedAt: string
}

export default function LogicResultsPage() {
  const [results, setResults] = useState<LogicTestResults | null>(null)
  const [questions, setQuestions] = useState<LogicQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // 載入測試結果
        const savedResults = localStorage.getItem("logicTestResults")
        if (savedResults) {
          setResults(JSON.parse(savedResults))
        }

        // 載入題目資料
        const response = await fetch('/api/logic-questions')
        const data = await response.json()
        
        if (data.success) {
          setQuestions(data.questions)
        } else {
          console.error('Failed to load questions:', data.error)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

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
              <Link href="/tests/logic">重新測試</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getScoreLevel = (score: number) => {
    if (score === 100) return { 
      level: "邏輯巔峰者", 
      color: "bg-purple-600", 
      description: "近乎完美的邏輯典範！你像一台「推理引擎」，嚴謹又高效，幾乎不受陷阱干擾。",
      suggestion: "多和他人分享你的思考路徑，能幫助團隊整體邏輯力提升。"
    }
    if (score >= 80) return { 
      level: "邏輯大師", 
      color: "bg-green-500", 
      description: "你的思維如同精密儀器，能快速抓住題目關鍵，並做出有效推理。常常是團隊中「冷靜的分析者」。",
      suggestion: "挑戰更高層次的難題，讓你的邏輯力更加精進。"
    }
    if (score >= 60) return { 
      level: "邏輯高手", 
      color: "bg-blue-500", 
      description: "邏輯清晰穩定，大部分情境都能正確判斷。偶爾會因粗心錯過陷阱。",
      suggestion: "在思維縝密之餘，更加留心細節，就能把錯誤率降到最低。"
    }
    if (score >= 30) return { 
      level: "邏輯學徒", 
      color: "bg-yellow-500", 
      description: "已經抓到一些邏輯規律，能解決中等難度的問題。遇到複雜情境時，仍可能卡關。",
      suggestion: "嘗試將問題拆解成小步驟，就像組裝樂高，每一塊拼好，答案就自然浮現。"
    }
    return { 
      level: "邏輯探險新手", 
      color: "bg-red-500", 
      description: "還在邏輯森林的入口徘徊。思考時可能忽略細節，或被陷阱誤導。",
      suggestion: "多練習經典邏輯題，像是在拼拼圖般，慢慢建立清晰的分析步驟。"
    }
  }

  const scoreLevel = getScoreLevel(results.score)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">邏輯思維測試完成！</h1>
          <p className="text-lg text-muted-foreground mb-6">
            感謝您完成邏輯思維測試，您的答案已成功提交。
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
              <Link href="/tests/creative">
                開始創意測試
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
