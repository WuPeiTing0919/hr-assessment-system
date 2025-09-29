"use client"

import { useState, useEffect } from "react"
import { TestLayout } from "@/components/test-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { calculateCombinedScore } from "@/lib/utils/score-calculator"
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

type TestPhase = "logic" | "creative" | "completed"

export default function CombinedTestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [phase, setPhase] = useState<TestPhase>("logic")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [logicAnswers, setLogicAnswers] = useState<Record<number, string>>({})
  const [creativeAnswers, setCreativeAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(45 * 60) // 45 minutes total
  const [logicQuestions, setLogicQuestions] = useState<LogicQuestion[]>([])
  const [creativeQuestions, setCreativeQuestions] = useState<CreativeQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Load logic questions
        const logicResponse = await fetch('/api/logic-questions')
        const logicData = await logicResponse.json()
        
        // Load creative questions
        const creativeResponse = await fetch('/api/creative-questions')
        const creativeData = await creativeResponse.json()

        if (logicData.success && creativeData.success) {
          setLogicQuestions(logicData.questions)
          setCreativeQuestions(creativeData.questions)
        } else {
          console.error('Failed to load questions:', logicData.error || creativeData.error)
        }
      } catch (error) {
        console.error('Error loading questions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [])

  // Timer effect
  useEffect(() => {
    if (logicQuestions.length === 0 && creativeQuestions.length === 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [logicQuestions, creativeQuestions])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentQuestions = () => {
    return phase === "logic" ? logicQuestions : creativeQuestions
  }

  const getTotalQuestions = () => {
    return logicQuestions.length + creativeQuestions.length
  }

  const getOverallProgress = () => {
    const logicCompleted = phase === "logic" ? currentQuestion : logicQuestions.length
    const creativeCompleted = phase === "creative" ? currentQuestion : 0
    return logicCompleted + creativeCompleted
  }

  const handleAnswerChange = (value: string) => {
    if (phase === "logic") {
      setLogicAnswers((prev) => ({
        ...prev,
        [currentQuestion]: value,
      }))
    } else {
      setCreativeAnswers((prev) => ({
        ...prev,
        [currentQuestion]: Number.parseInt(value),
      }))
    }
  }

  const handleNext = () => {
    const currentQuestions = getCurrentQuestions()

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else if (phase === "logic") {
      // Switch to creative phase
      setPhase("creative")
      setCurrentQuestion(0)
    } else {
      // Complete the test
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    } else if (phase === "creative") {
      // Go back to logic phase
      setPhase("logic")
      setCurrentQuestion(logicQuestions.length - 1)
    }
  }

  const handleSubmit = async () => {
    console.log('🔍 開始提交綜合測試...')
    console.log('用戶狀態:', user)

    if (!user) {
      console.log('❌ 用戶未登入')
      alert('請先登入')
      return
    }

    console.log('✅ 用戶已登入，用戶ID:', user.id)
    setIsSubmitting(true)

    try {
      // Calculate logic score
      let logicCorrect = 0
      logicQuestions.forEach((question, index) => {
        if (logicAnswers[index] === question.correct_answer) {
          logicCorrect++
        }
      })
      const logicScore = Math.round((logicCorrect / logicQuestions.length) * 100)

      // Calculate creativity score
      let creativityTotal = 0
      creativeQuestions.forEach((question, index) => {
        const answer = creativeAnswers[index] || 1
        creativityTotal += question.is_reverse ? 6 - answer : answer
      })
      const creativityMaxScore = creativeQuestions.length * 5
      const creativityScore = Math.round((creativityTotal / creativityMaxScore) * 100)

      // Calculate combined score
      const combinedResult = calculateCombinedScore(logicScore, creativityScore)

      // Store results in localStorage (for backward compatibility)
      const results = {
        type: "combined",
        logicScore,
        creativityScore,
        overallScore: combinedResult.overallScore,
        level: combinedResult.level,
        description: combinedResult.description,
        breakdown: combinedResult.breakdown,
        logicAnswers,
        creativeAnswers,
        logicCorrect,
        creativityTotal,
        creativityMaxScore,
        completedAt: new Date().toISOString(),
      }

      localStorage.setItem("combinedTestResults", JSON.stringify(results))
      console.log('✅ 結果已儲存到 localStorage')

      // Upload to database
      console.log('🔄 開始上傳到資料庫...')
      const uploadData = {
        userId: user.id,
        logicScore,
        creativityScore,
        overallScore: combinedResult.overallScore,
        level: combinedResult.level,
        description: combinedResult.description,
        logicBreakdown: {
          correct: logicCorrect,
          total: logicQuestions.length,
          answers: logicAnswers
        },
        creativityBreakdown: {
          total: creativityTotal,
          maxScore: creativityMaxScore,
          answers: creativeAnswers
        },
        balanceScore: combinedResult.breakdown.balance,
        completedAt: new Date().toISOString()
      }
      console.log('上傳數據:', uploadData)

      const uploadResponse = await fetch('/api/test-results/combined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData)
      })

      console.log('📡 API 響應狀態:', uploadResponse.status)
      const uploadResult = await uploadResponse.json()
      console.log('📡 API 響應內容:', uploadResult)

      if (uploadResult.success) {
        console.log('✅ 綜合測試結果已上傳到資料庫')
        console.log('測試結果ID:', uploadResult.data.testResult.id)
      } else {
        console.error('❌ 上傳到資料庫失敗:', uploadResult.error)
        // 即使上傳失敗，也繼續顯示結果
      }

      router.push("/results/combined")

    } catch (error) {
      console.error('❌ 提交測驗失敗:', error)
      alert('提交測驗失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestions = getCurrentQuestions()
  const currentQ = currentQuestions[currentQuestion]
  const isLastQuestion = phase === "creative" && currentQuestion === creativeQuestions.length - 1
  const hasAnswer =
    phase === "logic" ? logicAnswers[currentQuestion] !== undefined : creativeAnswers[currentQuestion] !== undefined

  const getPhaseTitle = () => {
    if (phase === "logic") return "第一部分：邏輯思維測試"
    return "第二部分：創意能力測試"
  }

  const getQuestionNumber = () => {
    if (phase === "logic") return currentQuestion + 1
    return logicQuestions.length + currentQuestion + 1
  }

  if (isLoading) {
    return (
      <TestLayout
        title="綜合能力測試"
        currentQuestion={0}
        totalQuestions={0}
        timeRemaining="00:00"
        onBack={() => router.push("/")}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">載入題目中...</p>
        </div>
      </TestLayout>
    )
  }

  if (logicQuestions.length === 0 || creativeQuestions.length === 0) {
    return (
      <TestLayout
        title="綜合能力測試"
        currentQuestion={0}
        totalQuestions={0}
        timeRemaining="00:00"
        onBack={() => router.push("/")}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">無法載入題目，請稍後再試</p>
          <Button onClick={() => window.location.reload()}>重新載入</Button>
        </div>
      </TestLayout>
    )
  }

  return (
    <TestLayout
      title="綜合能力測試"
      currentQuestion={getQuestionNumber()}
      totalQuestions={getTotalQuestions()}
      timeRemaining={formatTime(timeRemaining)}
      onBack={() => router.push("/")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Phase Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{getPhaseTitle()}</h2>
            <div className="text-sm text-muted-foreground">
              {phase === "logic"
                ? `${currentQuestion + 1}/${logicQuestions.length}`
                : `${currentQuestion + 1}/${creativeQuestions.length}`}
            </div>
          </div>
          <Progress value={(getOverallProgress() / getTotalQuestions()) * 100} className="h-2" />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-balance">
              {phase === "logic" ? (currentQ as LogicQuestion).question : (currentQ as CreativeQuestion).statement}
            </CardTitle>
            {phase === "logic" && (
              <p className="text-sm text-muted-foreground mt-2">
                請仔細閱讀題目，選擇最正確的答案，每題均為單選。
              </p>
            )}
            {phase === "creative" && (
              <p className="text-sm text-muted-foreground">請根據您的實際情況，選擇最符合的選項（5=非常符合，1=完全不符合）。</p>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={
                phase === "logic"
                  ? logicAnswers[currentQuestion] || ""
                  : creativeAnswers[currentQuestion]?.toString() || ""
              }
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {phase === "logic"
                ? // Logic question options
                  [
                    { value: 'A', text: (currentQ as LogicQuestion).option_a },
                    { value: 'B', text: (currentQ as LogicQuestion).option_b },
                    { value: 'C', text: (currentQ as LogicQuestion).option_c },
                    { value: 'D', text: (currentQ as LogicQuestion).option_d },
                    { value: 'E', text: (currentQ as LogicQuestion).option_e }
                  ].map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                        {option.value}. {option.text}
                      </Label>
                    </div>
                  ))
                : // Creative question options
                  [
                    { value: "5", label: "我最符合", color: "text-green-600", bgColor: "bg-green-50" },
                    { value: "4", label: "比較符合", color: "text-green-500", bgColor: "bg-green-50" },
                    { value: "3", label: "一般", color: "text-yellow-500", bgColor: "bg-yellow-50" },
                    { value: "2", label: "不太符合", color: "text-orange-500", bgColor: "bg-orange-50" },
                    { value: "1", label: "與我不符", color: "text-red-500", bgColor: "bg-red-50" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${option.bgColor} hover:bg-muted/50 transition-colors`}
                    >
                      <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                      <Label
                        htmlFor={`option-${option.value}`}
                        className={`flex-1 cursor-pointer text-base font-medium ${option.color}`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePrevious} disabled={phase === "logic" && currentQuestion === 0}>
            上一題
          </Button>

          <div className="flex gap-2 max-w-md overflow-x-auto">
            {/* Logic questions indicators */}
            {logicQuestions.map((_, index) => (
              <button
                key={`logic-${index}`}
                onClick={() => {
                  if (phase === "logic" || phase === "creative") {
                    setPhase("logic")
                    setCurrentQuestion(index)
                  }
                }}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  phase === "logic" && index === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : logicAnswers[index] !== undefined
                      ? "bg-primary/70 text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-8 bg-border mx-2"></div>

            {/* Creative questions indicators */}
            {creativeQuestions.map((_, index) => (
              <button
                key={`creative-${index}`}
                onClick={() => {
                  if (phase === "creative") {
                    setCurrentQuestion(index)
                  }
                }}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  phase === "creative" && index === currentQuestion
                    ? "bg-accent text-accent-foreground"
                    : creativeAnswers[index] !== undefined
                      ? "bg-accent/70 text-accent-foreground"
                      : phase === "creative"
                        ? "bg-muted text-muted-foreground hover:bg-muted/80"
                        : "bg-muted/50 text-muted-foreground/50"
                }`}
                disabled={phase === "logic"}
              >
                {logicQuestions.length + index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!hasAnswer || isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? '提交中...' : '提交測試'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!hasAnswer}>
              {phase === "logic" && currentQuestion === logicQuestions.length - 1 ? "進入第二部分" : "下一題"}
            </Button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          總進度：已完成 {getOverallProgress()} / {getTotalQuestions()} 題
          <br />
          當前階段：{phase === "logic" ? "邏輯思維測試" : "創意能力測試"} (
          {Object.keys(phase === "logic" ? logicAnswers : creativeAnswers).length} / {currentQuestions.length} 題)
        </div>
      </div>
    </TestLayout>
  )
}
