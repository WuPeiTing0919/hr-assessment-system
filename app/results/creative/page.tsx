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
    if (score >= 90) return { 
      level: "創意巔峰者", 
      color: "bg-purple-600", 
      description: "創意力近乎無窮，你是團隊裡的靈感源泉，總能帶來突破性的想法。",
      suggestion: "你不只創造靈感，更能影響他人。如果能結合執行力，你將成為真正的創新領袖。"
    }
    if (score >= 75) return { 
      level: "創意引領者", 
      color: "bg-blue-500", 
      description: "你是靈感的推動者！總是能在團體中主動拋出新想法，激發別人跟進。",
      suggestion: "持續累積學習，讓你的靈感不僅是點子，而能帶動真正的行動。"
    }
    if (score >= 55) return { 
      level: "創意實踐者", 
      color: "bg-green-500", 
      description: "靈感已經隨手可得，在團體中也常被認為是「有創意的人」。",
      suggestion: "再給自己一點勇氣，不要害怕挑戰慣例，你的創意將更有力量。"
    }
    if (score >= 35) return { 
      level: "創意開拓者", 
      color: "bg-yellow-500", 
      description: "你其實有自己的想法，但有時習慣跟隨大多數人的步伐。",
      suggestion: "試著勇敢說出腦中天馬行空的念頭，你會發現，這些點子或許就是團隊需要的突破口。"
    }
    return { 
      level: "創意萌芽者", 
      color: "bg-red-500", 
      description: "還在創意旅程的起點。雖然暫時表現平淡，但這正是無限潛力的開端！",
      suggestion: "觀察生活小事，或閱讀不同領域的內容，讓靈感一點一滴積累。"
    }
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
              <p className="text-lg text-muted-foreground mb-3">{creativityLevel.description}</p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">👉 建議：</span>
                  {creativityLevel.suggestion}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">{results.totalScore}</div>
                  <div className="text-xs text-muted-foreground">總得分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{results.maxScore}</div>
                  <div className="text-xs text-muted-foreground">滿分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {Math.round((results.totalScore / results.maxScore) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">得分率</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {categoryResults.map((category) => (
                  <div key={category.category} className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm md:text-base">{category.name}</h3>
                      <Badge variant="outline" className="text-xs">{category.score}分</Badge>
                    </div>
                    <Progress value={category.score} className="h-2" />
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {category.rawScore} / {category.maxRawScore} 分
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Feedback Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                創意能力分析圖表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-3 md:p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2 text-sm md:text-base">創意能力評估</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    基於您的測試結果，您在創意思維方面表現為「{creativityLevel.level}」水平。
                    {results.score >= 75 &&
                      "您具備出色的創新思維能力，善於從不同角度思考問題，能夠產生獨特的想法和解決方案。"}
                    {results.score >= 50 &&
                      results.score < 75 &&
                      "您具有一定的創造性思維潛力，建議多參與創新活動，培養發散性思維。"}
                    {results.score < 50 && "建議您多接觸創新思維訓練，培養好奇心和探索精神，提升創造性解決問題的能力。"}
                  </p>
                </div>

                {/* Radar Chart */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm md:text-base text-center">能力維度雷達圖</h4>
                  <div className="flex justify-center">
                    <div className="relative w-56 h-56 md:w-72 md:h-72">
                      {/* Radar Chart Background */}
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Grid circles */}
                        <circle cx="100" cy="100" r="60" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        <circle cx="100" cy="100" r="45" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        <circle cx="100" cy="100" r="30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        <circle cx="100" cy="100" r="15" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        
                        {/* Grid lines - 4 axes for 4 dimensions */}
                        {[0, 90, 180, 270].map((angle, index) => {
                          const x1 = 100 + 60 * Math.cos((angle - 90) * Math.PI / 180)
                          const y1 = 100 + 60 * Math.sin((angle - 90) * Math.PI / 180)
                          return (
                            <line
                              key={index}
                              x1="100"
                              y1="100"
                              x2={x1}
                              y2={y1}
                              stroke="#e5e7eb"
                              strokeWidth="1"
                            />
                          )
                        })}
                        
                        {/* Data points and area */}
                        {categoryResults.map((category, index) => {
                          const angle = (index * 90 - 90) * Math.PI / 180
                          const radius = (category.score / 100) * 60
                          const x = 100 + radius * Math.cos(angle)
                          const y = 100 + radius * Math.sin(angle)
                          
                          // Calculate label position - more space for text
                          let labelRadius = 75
                          let labelX = 100 + labelRadius * Math.cos(angle)
                          let labelY = 100 + labelRadius * Math.sin(angle)
                          
                          // Special adjustments for imagination and originality
                          if (angle === 0) { // Right - 想像力
                            labelRadius = 70
                            labelX = 100 + labelRadius * Math.cos(angle)
                            labelY = 100 + labelRadius * Math.sin(angle)
                          } else if (angle === 180 * Math.PI / 180) { // Left - 原創性
                            labelRadius = 70
                            labelX = 100 + labelRadius * Math.cos(angle)
                            labelY = 100 + labelRadius * Math.sin(angle)
                          }
                          
                          // Adjust text anchor based on position
                          let textAnchor: "middle" | "start" | "end" = "middle"
                          let dominantBaseline: "middle" | "hanging" | "alphabetic" = "middle"
                          
                          if (angle === -90 * Math.PI / 180) { // Top
                            dominantBaseline = "hanging"
                          } else if (angle === 90 * Math.PI / 180) { // Bottom
                            dominantBaseline = "alphabetic"
                          } else if (angle === 0) { // Right
                            textAnchor = "start"
                          } else if (angle === 180 * Math.PI / 180) { // Left
                            textAnchor = "end"
                          }
                          
                          return (
                            <g key={category.category}>
                              {/* Data point */}
                              <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#3b82f6"
                                stroke="white"
                                strokeWidth="2"
                                className="drop-shadow-sm"
                              />
                              {/* Label - positioned closer to the chart */}
                              <text
                                x={labelX}
                                y={labelY}
                                textAnchor={textAnchor}
                                dominantBaseline={dominantBaseline}
                                className="text-[10px] fill-gray-600 font-medium"
                              >
                                {category.name}
                              </text>
                              {/* Score label - positioned above the data point */}
                              <text
                                x={x}
                                y={y - 12}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] fill-blue-600 font-bold"
                                style={{ textShadow: '1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white' }}
                              >
                                {category.score}%
                              </text>
                            </g>
                          )
                        })}
                        
                        {/* Area fill */}
                        <polygon
                          points={categoryResults.map((category, index) => {
                            const angle = (index * 90 - 90) * Math.PI / 180
                            const radius = (category.score / 100) * 60
                            const x = 100 + radius * Math.cos(angle)
                            const y = 100 + radius * Math.sin(angle)
                            return `${x},${y}`
                          }).join(' ')}
                          fill="rgba(59, 130, 246, 0.2)"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {categoryResults.map((category) => (
                        <div key={category.category} className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-muted-foreground">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                <span>返回首頁</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/tests/creative">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新測試
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/tests/logic">開始邏輯測試</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
