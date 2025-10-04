"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Brain, Lightbulb, BarChart3, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { CreativeAnalysis } from "@/components/creative-analysis"

interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
}

interface TestResult {
  id: string
  userId: string
  type: "logic" | "creative" | "combined"
  score: number
  completedAt: string
  details?: {
    logicScore?: number
    creativeScore?: number
    abilityBalance?: number
    breakdown?: any
  }
  dimensionScores?: {
    innovation: { percentage: number, rawScore: number, maxScore: number }
    imagination: { percentage: number, rawScore: number, maxScore: number }
    flexibility: { percentage: number, rawScore: number, maxScore: number }
    originality: { percentage: number, rawScore: number, maxScore: number }
  }
}

interface Question {
  id: number
  question?: string
  statement?: string
  option_a?: string
  option_b?: string
  option_c?: string
  option_d?: string
  option_e?: string
  correct_answer?: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation?: string
  type: 'logic' | 'creative'
  userAnswer?: string | number
  isCorrect?: boolean
  score?: number
  created_at: string
}

interface DetailData {
  result: TestResult
  user: User
  questions: Question[]
}

export default function AdminResultDetailPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminResultDetailContent />
    </ProtectedRoute>
  )
}

function AdminResultDetailContent() {
  const params = useParams()
  const router = useRouter()
  const testResultId = params.testResultId as string
  
  const [detailData, setDetailData] = useState<DetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDetailData = async () => {
      if (!testResultId) return
      
      setIsLoading(true)
      setError(null)

      try {
        // 從 URL 參數獲取測試類型，如果沒有則嘗試從結果中獲取
        const urlParams = new URLSearchParams(window.location.search)
        const testType = urlParams.get('testType') as "logic" | "creative" | "combined"
        
        if (!testType) {
          setError("缺少測試類型參數")
          return
        }

        const response = await fetch(`/api/admin/test-results/detail?testResultId=${testResultId}&testType=${testType}`)
        const data = await response.json()

        if (data.success) {
          setDetailData(data.data)
        } else {
          setError(data.message || "載入詳細結果失敗")
        }
      } catch (error) {
        console.error("載入詳細結果錯誤:", error)
        setError("載入詳細結果時發生錯誤")
      } finally {
        setIsLoading(false)
      }
    }

    loadDetailData()
  }, [testResultId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">載入詳細結果中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !detailData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error || "未找到測試結果"}</p>
            <Button asChild>
              <Link href="/admin/results">返回測試結果列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { result, user, questions } = detailData

  const getTestTypeInfo = (type: string) => {
    switch (type) {
      case "logic":
        return {
          name: "邏輯思維",
          icon: Brain,
          color: "bg-primary",
          textColor: "text-primary",
        }
      case "creative":
        return {
          name: "創意能力",
          icon: Lightbulb,
          color: "bg-accent",
          textColor: "text-accent",
        }
      case "combined":
        return {
          name: "綜合能力",
          icon: BarChart3,
          color: "bg-gradient-to-r from-primary to-accent",
          textColor: "text-primary",
        }
      default:
        return {
          name: "未知",
          icon: BarChart3,
          color: "bg-muted",
          textColor: "text-muted-foreground",
        }
    }
  }

  const getDimensionInfo = (category: string) => {
    switch (category) {
      case "innovation":
        return {
          name: "創新能力",
          color: "bg-blue-500",
          textColor: "text-blue-600",
          borderColor: "border-blue-200"
        }
      case "imagination":
        return {
          name: "想像力",
          color: "bg-purple-500",
          textColor: "text-purple-600",
          borderColor: "border-purple-200"
        }
      case "flexibility":
        return {
          name: "靈活性",
          color: "bg-green-500",
          textColor: "text-green-600",
          borderColor: "border-green-200"
        }
      case "originality":
        return {
          name: "原創性",
          color: "bg-orange-500",
          textColor: "text-orange-600",
          borderColor: "border-orange-200"
        }
      default:
        return {
          name: "未知維度",
          color: "bg-gray-500",
          textColor: "text-gray-600",
          borderColor: "border-gray-200"
        }
    }
  }

  const getScoreLevel = (score: number, type: string) => {
    if (type === "logic") {
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
    } else if (type === "creative") {
      if (score >= 90) return { 
        level: "創意大師", 
        color: "bg-purple-600", 
        description: "你的創意如泉水般源源不絕，總能提出令人驚豔的解決方案！",
        suggestion: "繼續保持這種創意精神，並嘗試將創意轉化為實際行動。"
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
    } else {
      // combined
      if (score >= 90) return { 
        level: "全能高手", 
        color: "bg-purple-600", 
        description: "邏輯與創意完美結合，是團隊中的全能型人才！",
        suggestion: "繼續保持這種平衡，並嘗試帶領團隊解決複雜問題。"
      }
      if (score >= 80) return { 
        level: "綜合專家", 
        color: "bg-green-500", 
        description: "邏輯思維和創意能力都很出色，能夠勝任各種挑戰。",
        suggestion: "繼續精進兩種能力，成為更全面的專業人才。"
      }
      if (score >= 60) return { 
        level: "平衡發展者", 
        color: "bg-blue-500", 
        description: "邏輯和創意能力都有一定水準，正在朝全面發展邁進。",
        suggestion: "針對較弱的能力進行重點提升，達到更好的平衡。"
      }
      if (score >= 40) return { 
        level: "潛力新星", 
        color: "bg-yellow-500", 
        description: "有發展潛力，需要更多練習來提升綜合能力。",
        suggestion: "制定學習計劃，系統性地提升邏輯和創意能力。"
      }
      return { 
        level: "成長中", 
        color: "bg-red-500", 
        description: "正在學習階段，需要更多時間和練習來提升能力。",
        suggestion: "從基礎開始，逐步建立邏輯思維和創意思維。"
      }
    }
  }

  const testTypeInfo = getTestTypeInfo(result.type)
  const scoreLevel = getScoreLevel(result.score, result.type)
  const IconComponent = testTypeInfo.icon

  // 計算統計數據
  const logicQuestions = questions.filter(q => q.type === 'logic')
  const creativeQuestions = questions.filter(q => q.type === 'creative')
  const correctAnswers = logicQuestions.filter(q => q.isCorrect).length
  const totalQuestions = questions.length

  // 計算創意測試的統計數據
  const creativeTotalScore = creativeQuestions.reduce((sum, q) => sum + (q.score || 0), 0)
  const creativeMaxScore = creativeQuestions.length * 5
  const creativeScorePercentage = creativeQuestions.length > 0 ? Math.round((creativeTotalScore / creativeMaxScore) * 100) : 0
  
  // 如果沒有從答案中獲得分數，使用結果中的分數
  const displayTotalScore = creativeTotalScore > 0 ? creativeTotalScore : result.score
  const displayMaxScore = creativeMaxScore > 0 ? creativeMaxScore : 100
  const displayScorePercentage = creativeScorePercentage > 0 ? creativeScorePercentage : result.score

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/results">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">返回測試結果</span>
              </Link>
            </Button>
            <div className={`w-10 h-10 ${testTypeInfo.color} rounded-lg flex items-center justify-center`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {user.name} - {testTypeInfo.name}測試結果
              </h1>
              <p className="text-sm text-muted-foreground">
                完成時間：{new Date(result.completedAt).toLocaleString("zh-TW")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>用戶資訊</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">姓名</label>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">電子郵件</label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">部門</label>
                  <p className="text-sm">{user.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">角色</label>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Overview */}
          <Card className="text-center">
            <CardHeader>
              <div
                className={`w-24 h-24 ${scoreLevel.color} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <span className="text-3xl font-bold text-white">{result.score}</span>
              </div>
              <CardTitle className="text-3xl mb-2">測試完成！</CardTitle>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {scoreLevel.level}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-3">{scoreLevel.description}</p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">👉 建議：</span>
                  {scoreLevel.suggestion}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {result.type === 'creative' ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{displayTotalScore}</div>
                      <div className="text-xs text-muted-foreground">總得分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{displayMaxScore}</div>
                      <div className="text-xs text-muted-foreground">滿分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {displayScorePercentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">得分率</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{correctAnswers}</div>
                      <div className="text-xs text-muted-foreground">答對題數</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{totalQuestions}</div>
                      <div className="text-xs text-muted-foreground">總題數</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">正確率</div>
                    </div>
                  </>
                )}
              </div>
              <Progress value={result.score} className="h-3 mb-4" />
            </CardContent>
          </Card>

          {/* Combined Test Details */}
          {result.type === 'combined' && result.details && (
            <Card>
              <CardHeader>
                <CardTitle>綜合能力分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">邏輯思維</h4>
                    <p className="text-2xl font-bold text-blue-600">{result.details.logicScore}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">創意能力</h4>
                    <p className="text-2xl font-bold text-green-600">{result.details.creativeScore}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800">能力平衡</h4>
                    <p className="text-2xl font-bold text-purple-600">{result.details.abilityBalance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Creative Analysis for Creative Tests */}
          {result.type === 'creative' && result.dimensionScores && (
            <CreativeAnalysis 
              score={result.score}
              dimensionScores={result.dimensionScores}
              creativityLevel={scoreLevel}
              totalScore={displayTotalScore}
              maxScore={displayMaxScore}
            />
          )}

          {/* Detailed Results */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>詳細結果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Logic Questions */}
                  {logicQuestions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-600" />
                        邏輯思維題目
                      </h3>
                      <div className="space-y-4">
                        {logicQuestions.map((question, index) => {
                          const userAnswer = question.userAnswer as string
                          const isCorrect = question.isCorrect
                          
                          const getOptionText = (option: string) => {
                            switch (option) {
                              case 'A': return question.option_a
                              case 'B': return question.option_b
                              case 'C': return question.option_c
                              case 'D': return question.option_d
                              case 'E': return question.option_e
                              default: return "未作答"
                            }
                          }

                          const correctOptionText = getOptionText(question.correct_answer || '')
                          const userOptionText = userAnswer ? getOptionText(userAnswer) : "未作答"

                          return (
                            <div key={question.id} className="border rounded-lg p-3 sm:p-4 bg-blue-50/30">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex-shrink-0 mt-1">
                                  {isCorrect ? (
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium mb-2 text-sm sm:text-base text-balance">
                                    第{index + 1}題：{question.question}
                                  </h4>
                                  <div className="space-y-2 text-xs sm:text-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                      <span className="text-muted-foreground text-xs">用戶答案：</span>
                                      <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs w-fit">
                                        {userAnswer ? `${userAnswer}. ${userOptionText}` : "未作答"}
                                      </Badge>
                                    </div>
                                    {!isCorrect && (
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                        <span className="text-muted-foreground text-xs">正確答案：</span>
                                        <Badge variant="outline" className="border-green-500 text-green-700 text-xs w-fit">
                                          {question.correct_answer}. {correctOptionText}
                                        </Badge>
                                      </div>
                                    )}
                                    {question.explanation && (
                                      <div className="mt-2 p-2 sm:p-3 bg-muted/50 rounded text-xs sm:text-sm">
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
                    </div>
                  )}

                  {/* Creative Questions */}
                  {creativeQuestions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-green-600" />
                        創意能力題目
                      </h3>
                      <div className="space-y-4">
                        {creativeQuestions.map((question, index) => {
                          const dimensionInfo = getDimensionInfo(question.category)
                          return (
                            <div key={question.id} className={`border rounded-lg p-3 sm:p-4 ${dimensionInfo.borderColor} bg-opacity-30`} style={{ backgroundColor: `${dimensionInfo.color.replace('bg-', '')}10` }}>
                              <div className="flex items-start justify-between mb-2 sm:mb-3">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm sm:text-base">第 {index + 1} 題</h4>
                                  <Badge variant="outline" className={`${dimensionInfo.textColor} ${dimensionInfo.borderColor} text-xs`}>
                                    {dimensionInfo.name}
                                  </Badge>
                                </div>
                                <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                  {question.score} 分
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 sm:space-y-3">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">題目內容</label>
                                  <p className="text-xs sm:text-sm mt-1 break-words">{question.statement}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">用戶答案</label>
                                    <p className="text-xs sm:text-sm mt-1">{question.userAnswer}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">得分</label>
                                    <p className="text-xs sm:text-sm mt-1 font-bold">{question.score} 分</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/admin/results">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>返回測試結果列表</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
