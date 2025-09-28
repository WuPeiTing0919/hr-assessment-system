"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Brain, Home, RotateCcw } from "lucide-react"
import Link from "next/link"
import { logicQuestions } from "@/lib/questions/logic-questions"

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

  useEffect(() => {
    const savedResults = localStorage.getItem("logicTestResults")
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
              <Link href="/tests/logic">重新測試</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "優秀", color: "bg-green-500", description: "邏輯思維能力出色" }
    if (score >= 80) return { level: "良好", color: "bg-blue-500", description: "邏輯思維能力較強" }
    if (score >= 70) return { level: "中等", color: "bg-yellow-500", description: "邏輯思維能力一般" }
    if (score >= 60) return { level: "及格", color: "bg-orange-500", description: "邏輯思維能力需要提升" }
    return { level: "不及格", color: "bg-red-500", description: "邏輯思維能力有待加強" }
  }

  const scoreLevel = getScoreLevel(results.score)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">邏輯思維測試結果</h1>
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
                className={`w-24 h-24 ${scoreLevel.color} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <span className="text-3xl font-bold text-white">{results.score}</span>
              </div>
              <CardTitle className="text-3xl mb-2">測試完成！</CardTitle>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {scoreLevel.level}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">{scoreLevel.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{results.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">答對題數</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{results.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">總題數</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">正確率</div>
                </div>
              </div>
              <Progress value={results.score} className="h-3 mb-4" />
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>詳細結果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {logicQuestions.map((question, index) => {
                  const userAnswer = results.answers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  const correctOption = question.options.find((opt) => opt.value === question.correctAnswer)
                  const userOption = question.options.find((opt) => opt.value === userAnswer)

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2 text-balance">
                            第{index + 1}題：{question.question}
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">你的答案：</span>
                              <Badge variant={isCorrect ? "default" : "destructive"}>
                                {userOption?.text || "未作答"}
                              </Badge>
                            </div>
                            {!isCorrect && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">正確答案：</span>
                                <Badge variant="outline" className="border-green-500 text-green-700">
                                  {correctOption?.text}
                                </Badge>
                              </div>
                            )}
                            {question.explanation && !isCorrect && (
                              <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                                <strong>解析：</strong>
                                {question.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">返回首頁</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tests/logic">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新測試
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tests/creative">開始創意測試</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
