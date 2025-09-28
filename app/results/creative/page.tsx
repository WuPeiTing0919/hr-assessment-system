"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, Home, RotateCcw, TrendingUp } from "lucide-react"
import Link from "next/link"
import { creativeQuestions } from "@/lib/questions/creative-questions"

interface CreativeTestResults {
  type: string
  score: number
  totalScore: number
  maxScore: number
  answers: Record<number, number>
  completedAt: string
}

export default function CreativeResultsPage() {
  const [results, setResults] = useState<CreativeTestResults | null>(null)

  useEffect(() => {
    const savedResults = localStorage.getItem("creativeTestResults")
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
              <Link href="/tests/creative">重新測試</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getCreativityLevel = (score: number) => {
    if (score >= 85) return { level: "極具創意", color: "bg-purple-500", description: "擁有卓越的創新思維和想像力" }
    if (score >= 75) return { level: "很有創意", color: "bg-blue-500", description: "具備較強的創造性思維能力" }
    if (score >= 65) return { level: "有一定創意", color: "bg-green-500", description: "具有一定的創新潛力" }
    if (score >= 50) return { level: "創意一般", color: "bg-yellow-500", description: "創造性思維有待提升" }
    return { level: "缺乏創意", color: "bg-red-500", description: "需要培養創新思維能力" }
  }

  const creativityLevel = getCreativityLevel(results.score)

  // Calculate category scores
  const categoryScores = {
    innovation: { total: 0, count: 0, name: "創新能力" },
    imagination: { total: 0, count: 0, name: "想像力" },
    flexibility: { total: 0, count: 0, name: "靈活性" },
    originality: { total: 0, count: 0, name: "原創性" },
  }

  creativeQuestions.forEach((question, index) => {
    const answer = results.answers[index] || 1
    const score = question.isReverse ? 6 - answer : answer
    categoryScores[question.category].total += score
    categoryScores[question.category].count += 1
  })

  const categoryResults = Object.entries(categoryScores).map(([key, data]) => ({
    category: key,
    name: data.name,
    score: data.count > 0 ? Math.round((data.total / (data.count * 5)) * 100) : 0,
    rawScore: data.total,
    maxRawScore: data.count * 5,
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">創意能力測試結果</h1>
              <p className="text-sm text-muted-foreground">
                完成時間：{new Date(results.completedAt).toLocaleString("zh-TW")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Score Overview */}
          <Card className="text-center">
            <CardHeader>
              <div
                className={`w-24 h-24 ${creativityLevel.color} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <span className="text-3xl font-bold text-white">{results.score}</span>
              </div>
              <CardTitle className="text-3xl mb-2">創意測試完成！</CardTitle>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {creativityLevel.level}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">{creativityLevel.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">{results.totalScore}</div>
                  <div className="text-sm text-muted-foreground">总得分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{results.maxScore}</div>
                  <div className="text-sm text-muted-foreground">满分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {Math.round((results.totalScore / results.maxScore) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">得分率</div>
                </div>
              </div>
              <Progress value={results.score} className="h-3 mb-4" />
            </CardContent>
          </Card>

          {/* Category Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                能力維度分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryResults.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge variant="outline">{category.score}分</Badge>
                    </div>
                    <Progress value={category.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {category.rawScore} / {category.maxRawScore} 分
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>詳細反饋</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">創意能力評估</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    基於您的測試結果，您在創意思維方面表現為「{creativityLevel.level}」水平。
                    {results.score >= 75 &&
                      "您具備出色的創新思維能力，善於從不同角度思考問題，能夠產生獨特的想法和解決方案。"}
                    {results.score >= 50 &&
                      results.score < 75 &&
                      "您具有一定的創造性思維潛力，建議多參與創新活動，培養發散性思維。"}
                    {results.score < 50 && "建議您多接觸創新思維訓練，培養好奇心和探索精神，提升創造性解決問題的能力。"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryResults.map((category) => (
                    <div key={category.category} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{category.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={category.score} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{category.score}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {category.score >= 80 && "表現優秀，繼續保持"}
                        {category.score >= 60 && category.score < 80 && "表現良好，有提升空間"}
                        {category.score < 60 && "需要重點提升"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tests/creative">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新測試
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tests/logic">開始邏輯測試</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
