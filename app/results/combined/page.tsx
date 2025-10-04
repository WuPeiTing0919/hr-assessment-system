"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Lightbulb, BarChart3, Home, RotateCcw, TrendingUp, Target, Award, Printer } from "lucide-react"
import Link from "next/link"
import { getRecommendations } from "@/lib/utils/score-calculator"
import { useAuth } from "@/lib/hooks/use-auth"

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

interface CreativeQuestion {
  id: number
  statement: string
  category: 'innovation' | 'imagination' | 'flexibility' | 'originality'
  is_reverse: boolean
  created_at: string
}

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
  const [logicQuestions, setLogicQuestions] = useState<LogicQuestion[]>([])
  const [creativeQuestions, setCreativeQuestions] = useState<CreativeQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        // 從資料庫獲取最新的綜合測試結果
        const response = await fetch(`/api/test-results/combined?userId=${user.id}`)
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          // 取最新的結果
          const latestResult = data.data[0]
          
          // 轉換為前端需要的格式
          setResults({
            type: "combined",
            logicScore: latestResult.logic_score,
            creativityScore: latestResult.creativity_score,
            overallScore: latestResult.overall_score,
            level: latestResult.level,
            description: latestResult.description || "",
            breakdown: {
              logic: latestResult.logic_score,
              creativity: latestResult.creativity_score,
              balance: latestResult.balance_score
            },
            logicAnswers: latestResult.logic_breakdown?.answers || {},
            creativeAnswers: latestResult.creativity_breakdown?.answers || {},
            logicCorrect: latestResult.logic_breakdown?.correct || 0,
            creativityTotal: latestResult.creativity_breakdown?.total || 0,
            creativityMaxScore: latestResult.creativity_breakdown?.maxScore || 0,
            completedAt: latestResult.completed_at
          })
        } else {
          // 如果沒有資料庫結果，回退到 localStorage
          const savedResults = localStorage.getItem("combinedTestResults")
          if (savedResults) {
            setResults(JSON.parse(savedResults))
          }
        }

        // Load questions from database
        const logicResponse = await fetch('/api/logic-questions')
        const logicData = await logicResponse.json()
        
        const creativeResponse = await fetch('/api/creative-questions')
        const creativeData = await creativeResponse.json()

        if (logicData.success && creativeData.success) {
          setLogicQuestions(logicData.questions)
          setCreativeQuestions(creativeData.questions)
        } else {
          console.error('Failed to load questions:', logicData.error || creativeData.error)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // 回退到 localStorage
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

  const recommendations = getRecommendations(results.logicScore, results.creativityScore)

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getLogicLevel = (score: number) => {
    if (score >= 100) return {
      level: "邏輯巔峰者",
      color: "bg-purple-600",
      description: "近乎完美的邏輯典範！你像一台「推理引擎」，嚴謹又高效，幾乎不受陷阱干擾。",
      suggestion: "多和他人分享你的思考路徑，能幫助團隊整體邏輯力提升。"
    }
    if (score >= 80) return {
      level: "邏輯大師",
      color: "bg-blue-500",
      description: "你的思維如同精密儀器，能快速抓住題目關鍵，並做出有效推理。常常是團隊中「冷靜的分析者」。",
      suggestion: "挑戰更高層次的難題，讓你的邏輯力更加精進。"
    }
    if (score >= 60) return {
      level: "邏輯高手",
      color: "bg-green-500",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <Button 
              onClick={() => window.print()} 
              variant="outline" 
              size="sm"
              className="print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              列印結果
            </Button>
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
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${getScoreColor(results.logicScore)}`}>
                    {results.logicScore}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">邏輯思維</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${getScoreColor(results.creativityScore)}`}>
                    {results.creativityScore}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">創意能力</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${getScoreColor(results.breakdown.balance)}`}>
                    {results.breakdown.balance}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">能力平衡</div>
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
                      <div className="font-bold text-primary">{logicQuestions.length}</div>
                      <div className="text-muted-foreground">總題數</div>
                    </div>
                  </div>
                  
                  {/* Logic Level Assessment */}
                  {(() => {
                    const logicLevel = getLogicLevel(results.logicScore)
                    return (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 ${logicLevel.color} rounded-full`}></div>
                          <span className="font-medium text-sm">{logicLevel.level}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                          {logicLevel.description}
                        </p>
                        <div className="bg-muted/50 rounded p-2 text-xs">
                          <span className="font-medium">👉 建議：</span>
                          <span className="text-muted-foreground">{logicLevel.suggestion}</span>
                        </div>
                      </div>
                    )
                  })()}
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
                      <div className="text-muted-foreground">原始得分</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="font-bold text-primary">{results.creativityMaxScore}</div>
                      <div className="text-muted-foreground">滿分</div>
                    </div>
                  </div>
                  
                  {/* Creative Level Assessment */}
                  {(() => {
                    const creativityLevel = getCreativityLevel(results.creativityScore)
                    return (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 ${creativityLevel.color} rounded-full`}></div>
                          <span className="font-medium text-sm">{creativityLevel.level}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                          {creativityLevel.description}
                        </p>
                        <div className="bg-muted/50 rounded p-2 text-xs">
                          <span className="font-medium">👉 建議：</span>
                          <span className="text-muted-foreground">{creativityLevel.suggestion}</span>
                        </div>
                      </div>
                    )
                  })()}
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
                <span>返回首頁</span>
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
