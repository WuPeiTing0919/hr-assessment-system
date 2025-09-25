"use client"

import { useState, useEffect } from "react"
import { TestLayout } from "@/components/test-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { creativeQuestions } from "@/lib/questions/creative-questions"

export default function CreativeTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds

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
      [currentQuestion]: Number.parseInt(value),
    }))
  }

  const handleNext = () => {
    if (currentQuestion < creativeQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score based on creativity scoring
    let totalScore = 0
    creativeQuestions.forEach((question, index) => {
      const answer = answers[index] || 1
      // For creativity, higher scores indicate more creative thinking
      totalScore += question.isReverse ? 6 - answer : answer
    })

    const maxScore = creativeQuestions.length * 5
    const score = Math.round((totalScore / maxScore) * 100)

    // Store results in localStorage
    const results = {
      type: "creative",
      score,
      totalScore,
      maxScore,
      answers,
      completedAt: new Date().toISOString(),
    }

    localStorage.setItem("creativeTestResults", JSON.stringify(results))
    router.push("/results/creative")
  }

  const currentQ = creativeQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === creativeQuestions.length - 1
  const hasAnswer = answers[currentQuestion] !== undefined

  const scaleOptions = [
    { value: "5", label: "我最符合", color: "text-green-600" },
    { value: "4", label: "比较符合", color: "text-green-500" },
    { value: "3", label: "一般", color: "text-yellow-500" },
    { value: "2", label: "不太符合", color: "text-orange-500" },
    { value: "1", label: "与我不符", color: "text-red-500" },
  ]

  return (
    <TestLayout
      title="創意能力測試"
      currentQuestion={currentQuestion + 1}
      totalQuestions={creativeQuestions.length}
      timeRemaining={formatTime(timeRemaining)}
      onBack={() => router.push("/")}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-balance">{currentQ.statement}</CardTitle>
            <p className="text-sm text-muted-foreground">請根據這個描述與你的實際情況的符合程度進行選擇</p>
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
                  className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className={`flex-1 cursor-pointer text-base font-medium ${option.color}`}
                  >
                    {option.label}
                  </Label>
                  <div className="text-sm text-muted-foreground font-mono">{option.value}</div>
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
            {creativeQuestions.map((_, index) => (
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
            <Button onClick={handleSubmit} disabled={!hasAnswer} className="bg-green-600 hover:bg-green-700">
              提交測試
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!hasAnswer}>
              下一題
            </Button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          已完成 {Object.keys(answers).length} / {creativeQuestions.length} 題
        </div>
      </div>
    </TestLayout>
  )
}
