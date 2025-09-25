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
            <p className="text-muted-foreground mb-4">未找到测试结果</p>
            <Button asChild>
              <Link href="/tests/creative">重新测试</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getCreativityLevel = (score: number) => {
    if (score >= 85) return { level: "极具创意", color: "bg-purple-500", description: "拥有卓越的创新思维和想象力" }
    if (score >= 75) return { level: "很有创意", color: "bg-blue-500", description: "具备较强的创造性思维能力" }
    if (score >= 65) return { level: "有一定创意", color: "bg-green-500", description: "具有一定的创新潜力" }
    if (score >= 50) return { level: "创意一般", color: "bg-yellow-500", description: "创造性思维有待提升" }
    return { level: "缺乏创意", color: "bg-red-500", description: "需要培养创新思维能力" }
  }

  const creativityLevel = getCreativityLevel(results.score)

  // Calculate category scores
  const categoryScores = {
    innovation: { total: 0, count: 0, name: "创新能力" },
    imagination: { total: 0, count: 0, name: "想象力" },
    flexibility: { total: 0, count: 0, name: "灵活性" },
    originality: { total: 0, count: 0, name: "原创性" },
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
              <h1 className="text-xl font-bold text-foreground">创意能力测试结果</h1>
              <p className="text-sm text-muted-foreground">
                完成时间：{new Date(results.completedAt).toLocaleString("zh-CN")}
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
              <CardTitle className="text-3xl mb-2">创意测试完成！</CardTitle>
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
                能力维度分析
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
              <CardTitle>详细反馈</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">创意能力评估</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    基于您的测试结果，您在创意思维方面表现为"{creativityLevel.level}"水平。
                    {results.score >= 75 &&
                      "您具备出色的创新思维能力，善于从不同角度思考问题，能够产生独特的想法和解决方案。"}
                    {results.score >= 50 &&
                      results.score < 75 &&
                      "您具有一定的创造性思维潜力，建议多参与创新活动，培养发散性思维。"}
                    {results.score < 50 && "建议您多接触创新思维训练，培养好奇心和探索精神，提升创造性解决问题的能力。"}
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
                        {category.score >= 80 && "表现优秀，继续保持"}
                        {category.score >= 60 && category.score < 80 && "表现良好，有提升空间"}
                        {category.score < 60 && "需要重点提升"}
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
                重新测试
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tests/logic">开始逻辑测试</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
