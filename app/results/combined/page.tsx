"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Lightbulb, BarChart3, Home, RotateCcw, TrendingUp, Target, Award } from "lucide-react"
import Link from "next/link"
import { getRecommendations } from "@/lib/utils/score-calculator"

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
  const [results, setResults] = useState<CombinedTestResults | null>(null)

  useEffect(() => {
    const savedResults = localStorage.getItem("combinedTestResults")
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
  }, [])

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

  const recommendations = getRecommendations(results.logicScore, results.creativityScore)

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">綜合能力測試結果</h1>
              <p className="text-sm text-muted-foreground">
                完成時間：{new Date(results.completedAt).toLocaleString("zh-TW")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overall Score */}
          <Card className="text-center bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
            <CardHeader>
              <div className="w-32 h-32 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">{results.overallScore}</span>
              </div>
              <CardTitle className="text-4xl mb-2">綜合評估完成！</CardTitle>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white text-xl px-6 py-2">
                  {results.level}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">{results.description}</p>
            </CardHeader>
            <CardContent>
              <Progress value={results.overallScore} className="h-4 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.logicScore)}`}>
                    {results.logicScore}
                  </div>
                  <div className="text-sm text-muted-foreground">邏輯思維</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.creativityScore)}`}>
                    {results.creativityScore}
                  </div>
                  <div className="text-sm text-muted-foreground">創意能力</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.breakdown.balance)}`}>
                    {results.breakdown.balance}
                  </div>
                  <div className="text-sm text-muted-foreground">能力平衡</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logic Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  邏輯思維測試
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">得分</span>
                    <span className={`text-2xl font-bold ${getScoreColor(results.logicScore)}`}>
                      {results.logicScore}
                    </span>
                  </div>
                  <Progress value={results.logicScore} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="font-bold text-green-600">{results.logicCorrect}</div>
                      <div className="text-muted-foreground">答對題數</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="font-bold text-primary">10</div>
                      <div className="text-muted-foreground">總題數</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creative Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  創意能力測試
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">得分</span>
                    <span className={`text-2xl font-bold ${getScoreColor(results.creativityScore)}`}>
                      {results.creativityScore}
                    </span>
                  </div>
                  <Progress value={results.creativityScore} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="font-bold text-accent">{results.creativityTotal}</div>
                      <div className="text-muted-foreground">總得分</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="font-bold text-primary">{results.creativityMaxScore}</div>
                      <div className="text-muted-foreground">滿分</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ability Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                能力分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">邏輯思維</h3>
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(results.logicScore)}`}>
                    {results.logicScore}分
                  </div>
                  <Progress value={results.logicScore} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {results.logicScore >= 80 ? "表現優秀" : results.logicScore >= 60 ? "表現良好" : "需要提升"}
                  </p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <Lightbulb className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">創意能力</h3>
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(results.creativityScore)}`}>
                    {results.creativityScore}分
                  </div>
                  <Progress value={results.creativityScore} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {results.creativityScore >= 80
                      ? "表現優秀"
                      : results.creativityScore >= 60
                        ? "表現良好"
                        : "需要提升"}
                  </p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">能力平衡</h3>
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(results.breakdown.balance)}`}>
                    {results.breakdown.balance}分
                  </div>
                  <Progress value={results.breakdown.balance} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {results.breakdown.balance >= 80
                      ? "非常均衡"
                      : results.breakdown.balance >= 60
                        ? "相對均衡"
                        : "發展不均"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  發展建議
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">返回首頁</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tests/combined">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新測試
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/results">查看所有成績</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
