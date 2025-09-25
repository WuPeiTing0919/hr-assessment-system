"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface TestLayoutProps {
  children: ReactNode
  title: string
  currentQuestion: number
  totalQuestions: number
  timeRemaining?: string
  onBack?: () => void
}

export function TestLayout({
  children,
  title,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onBack,
}: TestLayoutProps) {
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={onBack} asChild={!onBack} className="flex-shrink-0">
                {onBack ? (
                  <>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">返回</span>
                  </>
                ) : (
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">返回</span>
                  </Link>
                )}
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">{title}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  第 {currentQuestion} 題 / 共 {totalQuestions} 題
                </p>
              </div>
            </div>
            {timeRemaining && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{timeRemaining}</span>
              </div>
            )}
          </div>
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
