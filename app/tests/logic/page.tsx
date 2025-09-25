"use client"

import { useState, useEffect } from "react"
import { TestLayout } from "@/components/test-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { logicQuestions } from "@/lib/questions/logic-questions"

export default function LogicTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20 minutes in seconds

  // Timer effect
  useEffect(() => {
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
  }, [])

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
    if (currentQuestion < logicQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correctAnswers = 0
    logicQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / logicQuestions.length) * 100)

    // Store results in localStorage
    const results = {
      type: "logic",
      score,
      correctAnswers,
      totalQuestions: logicQuestions.length,
      answers,
      completedAt: new Date().toISOString(),
    }

    localStorage.setItem("logicTestResults", JSON.stringify(results))
    router.push("/results/logic")
  }

  const currentQ = logicQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === logicQuestions.length - 1
  const hasAnswer = answers[currentQuestion] !== undefined

  return (
    <TestLayout
      title="邏輯思維測試"
      currentQuestion={currentQuestion + 1}
      totalQuestions={logicQuestions.length}
      timeRemaining={formatTime(timeRemaining)}
      onBack={() => router.push("/")}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-balance">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswerChange} className="space-y-4">
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                    {option.text}
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
                disabled={!hasAnswer}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                提交測試
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!hasAnswer} size="sm">
                下一題
              </Button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 px-2">
            {logicQuestions.map((_, index) => (
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
          已完成 {Object.keys(answers).length} / {logicQuestions.length} 題
        </div>
      </div>
    </TestLayout>
  )
}
