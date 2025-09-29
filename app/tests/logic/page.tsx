"use client"

import { useState, useEffect } from "react"
import { TestLayout } from "@/components/test-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
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

export default function LogicTestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [questions, setQuestions] = useState<LogicQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20 minutes in seconds
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/logic-questions')
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
      [currentQuestion]: value,
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
    console.log('🔍 開始提交邏輯測驗...')
    console.log('用戶狀態:', user)
    
    if (!user) {
      console.log('❌ 用戶未登入')
      alert('請先登入')
      return
    }

    console.log('✅ 用戶已登入，用戶ID:', user.id)
    setIsSubmitting(true)

    try {
      // Calculate score
      let correctAnswers = 0
      questions.forEach((question, index) => {
        if (answers[index] === question.correct_answer) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / questions.length) * 100)
      const completedAt = new Date().toISOString()

      console.log('📊 測驗結果計算:')
      console.log('答對題數:', correctAnswers)
      console.log('總題數:', questions.length)
      console.log('分數:', score)
      console.log('完成時間:', completedAt)

      // Store results in localStorage (for backward compatibility)
      const results = {
        type: "logic",
        score,
        correctAnswers,
        totalQuestions: questions.length,
        answers,
        completedAt,
      }

      localStorage.setItem("logicTestResults", JSON.stringify(results))
      console.log('✅ 結果已儲存到 localStorage')

      // Upload to database
      console.log('🔄 開始上傳到資料庫...')
      const uploadData = {
        userId: user.id,
        answers: Object.values(answers),
        completedAt: completedAt
      }
      console.log('上傳數據:', uploadData)

      const uploadResponse = await fetch('/api/test-results/logic', {
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
        console.log('✅ 邏輯測驗結果已上傳到資料庫')
        console.log('測試結果ID:', uploadResult.data.testResult.id)
        console.log('答案記錄數量:', uploadResult.data.answerCount)
      } else {
        console.error('❌ 上傳到資料庫失敗:', uploadResult.error)
        // 即使上傳失敗，也繼續顯示結果
      }

      router.push("/results/logic")

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
        title="邏輯思維測試"
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
        title="邏輯思維測試"
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

  return (
    <TestLayout
      title="邏輯思維測試"
      currentQuestion={currentQuestion + 1}
      totalQuestions={questions.length}
      timeRemaining={formatTime(timeRemaining)}
      onBack={() => router.push("/")}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-balance">{currentQ.question}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              請仔細閱讀題目，選擇最正確的答案，每題均為單選。
            </p>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswerChange} className="space-y-4">
              {[
                { value: 'A', text: currentQ.option_a },
                { value: 'B', text: currentQ.option_b },
                { value: 'C', text: currentQ.option_c },
                { value: 'D', text: currentQ.option_d },
                { value: 'E', text: currentQ.option_e }
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
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} size="sm">
              上一題
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!hasAnswer || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isSubmitting ? '提交中...' : '提交測試'}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!hasAnswer} size="sm">
                下一題
              </Button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 px-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  index === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : answers[index] !== undefined
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          已完成 {Object.keys(answers).length} / {questions.length} 題
        </div>
      </div>
    </TestLayout>
  )
}
