"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Lightbulb, BarChart3, Calendar, TrendingUp, Users, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"

interface TestResult {
  type: "logic" | "creative" | "combined"
  score: number
  completedAt: string
  details?: any
}

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsContent />
    </ProtectedRoute>
  )
}

function ResultsContent() {
  const { user } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    lastTestDate: null as string | null,
  })

  useEffect(() => {
    // Load all test results from localStorage
    const logicResults = localStorage.getItem("logicTestResults")
    const creativeResults = localStorage.getItem("creativeTestResults")
    const combinedResults = localStorage.getItem("combinedTestResults")

    const allResults: TestResult[] = []

    if (logicResults) {
      const data = JSON.parse(logicResults)
      allResults.push({
        type: "logic",
        score: data.score,
        completedAt: data.completedAt,
        details: data,
      })
    }

    if (creativeResults) {
      const data = JSON.parse(creativeResults)
      allResults.push({
        type: "creative",
        score: data.score,
        completedAt: data.completedAt,
        details: data,
      })
    }

    if (combinedResults) {
      const data = JSON.parse(combinedResults)
      allResults.push({
        type: "combined",
        score: data.overallScore,
        completedAt: data.completedAt,
        details: data,
      })
    }

    // Sort by completion date (newest first)
    allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    setResults(allResults)

    // Calculate statistics
    if (allResults.length > 0) {
      const totalScore = allResults.reduce((sum, result) => sum + result.score, 0)
      const averageScore = Math.round(totalScore / allResults.length)
      const bestScore = Math.max(...allResults.map((r) => r.score))
      const lastTestDate = allResults[0].completedAt

      setStats({
        totalTests: allResults.length,
        averageScore,
        bestScore,
        lastTestDate,
      })
    }
  }, [])

  const getTestTypeInfo = (type: string) => {
    switch (type) {
      case "logic":
        return {
          name: "邏輯思維測試",
          icon: Brain,
          color: "bg-primary",
          textColor: "text-primary",
          link: "/results/logic",
        }
      case "creative":
        return {
          name: "創意能力測試",
          icon: Lightbulb,
          color: "bg-accent",
          textColor: "text-accent",
          link: "/results/creative",
        }
      case "combined":
        return {
          name: "綜合能力測試",
          icon: BarChart3,
          color: "bg-gradient-to-r from-primary to-accent",
          textColor: "text-primary",
          link: "/results/combined",
        }
      default:
        return {
          name: "未知測試",
          icon: BarChart3,
          color: "bg-muted",
          textColor: "text-muted-foreground",
          link: "#",
        }
    }
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "優秀", color: "bg-green-500" }
    if (score >= 80) return { level: "良好", color: "bg-blue-500" }
    if (score >= 70) return { level: "中等", color: "bg-yellow-500" }
    if (score >= 60) return { level: "及格", color: "bg-orange-500" }
    return { level: "不及格", color: "bg-red-500" }
  }

  if (results.length === 0) {
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
                <h1 className="text-xl font-bold text-foreground">我的測試結果</h1>
                <p className="text-sm text-muted-foreground">查看您的測試歷史和成績分析</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">暫無測試記錄</h2>
            <p className="text-muted-foreground mb-8">您還沒有完成任何測試，開始您的第一次評估吧！</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/tests/logic">邏輯思維測試</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/tests/creative">創意能力測試</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/tests/combined">綜合能力測試</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              <h1 className="text-xl font-bold text-foreground">我的測試結果</h1>
              <p className="text-sm text-muted-foreground">查看您的測試歷史和成績分析</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* User Info */}
          {user && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground">
                      {user.department} • {user.role === "admin" ? "管理員" : "一般用戶"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.totalTests}</div>
                <div className="text-sm text-muted-foreground">完成測試</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.averageScore}</div>
                <div className="text-sm text-muted-foreground">平均分數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.bestScore}</div>
                <div className="text-sm text-muted-foreground">最高分數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div className="text-sm font-bold text-foreground mb-1">
                  {stats.lastTestDate ? new Date(stats.lastTestDate).toLocaleDateString("zh-TW") : "無"}
                </div>
                <div className="text-sm text-muted-foreground">最近測試</div>
              </CardContent>
            </Card>
          </div>

          {/* Test History */}
          <Card>
            <CardHeader>
              <CardTitle>測試歷史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => {
                  const testInfo = getTestTypeInfo(result.type)
                  const scoreLevel = getScoreLevel(result.score)
                  const Icon = testInfo.icon

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${testInfo.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{testInfo.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            完成時間：{new Date(result.completedAt).toLocaleString("zh-TW")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{result.score}</div>
                          <Badge className={`${scoreLevel.color} text-white`}>{scoreLevel.level}</Badge>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={testInfo.link}>
                            <Eye className="w-4 h-4 mr-2" />
                            查看詳情
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>成績趨勢</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => {
                  const testInfo = getTestTypeInfo(result.type)
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${testInfo.textColor}`}>{testInfo.name}</span>
                        <span className="text-sm font-medium">{result.score}分</span>
                      </div>
                      <Progress value={result.score} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>繼續測試</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-auto p-4">
                  <Link href="/tests/logic" className="flex flex-col items-center gap-2">
                    <Brain className="w-8 h-8" />
                    <span>邏輯思維測試</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <Link href="/tests/creative" className="flex flex-col items-center gap-2">
                    <Lightbulb className="w-8 h-8" />
                    <span>創意能力測試</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <Link href="/tests/combined" className="flex flex-col items-center gap-2">
                    <BarChart3 className="w-8 h-8" />
                    <span>綜合能力測試</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
