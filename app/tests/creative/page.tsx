"use client"

import { useState, useEffect } from "react"
import { TestLayout } from "@/components/test-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"

interface CreativeQuestion {
  id: number
  statement: string
  category: 'innovation' | 'imagination' | 'flexibility' | 'originality'
  is_reverse: boolean
  created_at: string
}

export default function CreativeTestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [questions, setQuestions] = useState<CreativeQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/creative-questions')
        const data = await response.json()

        if (data.success) {
          setQuestions(data.questions)
        } else {
          console.error('Failed to load questions:', data.error)
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
    if (questions.length === 0) return

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
  }, [questions])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: Number.parseInt(value),
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    console.log('🔍 開始提交創意測驗...')
    console.log('用戶狀態:', user)

    if (!user) {
      console.log('❌ 用戶未登入')
      alert('請先登入')
      return
    }

    console.log('✅ 用戶已登入，用戶ID:', user.id)
    setIsSubmitting(true)

    try {
      // Calculate score based on creativity scoring
      let totalScore = 0
      questions.forEach((question, index) => {
        const answer = answers[index] || 1
        // For creativity, higher scores indicate more creative thinking
        // 反向題：選擇 5 得 1 分，選擇 1 得 5 分
        totalScore += question.is_reverse ? 6 - answer : answer
      })

      const maxScore = questions.length * 5
      const score = Math.round((totalScore / maxScore) * 100)

      // Store results in localStorage (for backward compatibility)
      const results = {
        type: "creative",
        score,
        totalScore,
        maxScore,
        answers,
        completedAt: new Date().toISOString(),
      }

      localStorage.setItem("creativeTestResults", JSON.stringify(results))
      console.log('✅ 結果已儲存到 localStorage')

      // Upload to database
      console.log('🔄 開始上傳到資料庫...')
      const uploadData = {
        userId: user.id,
        answers: Object.values(answers),
        completedAt: new Date().toISOString().replace('Z', '').replace('T', ' ')
      }
      console.log('上傳數據:', uploadData)

      const uploadResponse = await fetch('/api/test-results/creative', {
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
        console.log('✅ 創意測驗結果已上傳到資料庫')
        console.log('測試結果ID:', uploadResult.data.testResult.id)
        console.log('答案記錄數量:', uploadResult.data.answerCount)
      } else {
        console.error('❌ 上傳到資料庫失敗:', uploadResult.error)
        // 即使上傳失敗，也繼續顯示結果
      }

      router.push("/results/creative")

    } catch (error) {
      console.error('❌ 提交測驗失敗:', error)
      alert('提交測驗失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <TestLayout
        title="創意能力測試"
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

  if (questions.length === 0) {
    return (
      <TestLayout
        title="創意能力測試"
        currentQuestion={0}
        totalQuestions={0}
        timeRemaining="00:00"
        onBack={() => router.push("/")}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">無法載入題目，請稍後再試</p>
        </div>
      </TestLayout>
    )
  }

  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const hasAnswer = answers[currentQuestion] !== undefined

  const scaleOptions = [
    { value: "5", label: "我最符合", color: "text-green-600", bgColor: "bg-green-50" },
    { value: "4", label: "比較符合", color: "text-green-500", bgColor: "bg-green-50" },
    { value: "3", label: "一般", color: "text-yellow-500", bgColor: "bg-yellow-50" },
    { value: "2", label: "不太符合", color: "text-orange-500", bgColor: "bg-orange-50" },
    { value: "1", label: "與我不符", color: "text-red-500", bgColor: "bg-red-50" },
  ]

  return (
    <TestLayout
      title="創意能力測試"
      currentQuestion={currentQuestion + 1}
      totalQuestions={questions.length}
      timeRemaining={formatTime(timeRemaining)}
      onBack={() => router.push("/")}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-balance">{currentQ.statement}</CardTitle>
            <p className="text-sm text-muted-foreground">請根據您的實際情況，選擇最符合的選項（5=非常符合，1=完全不符合）。</p>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {scaleOptions.map((option) => (
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
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            上一題
          </Button>

          <div className="flex gap-2 max-w-md overflow-x-auto">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  index === currentQuestion
                    ? "bg-accent text-accent-foreground"
                    : answers[index] !== undefined
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!hasAnswer || isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? '提交中...' : '提交測試'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!hasAnswer}>
              下一題
            </Button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          已完成 {Object.keys(answers).length} / {questions.length} 題
        </div>
      </div>
    </TestLayout>
  )
}
