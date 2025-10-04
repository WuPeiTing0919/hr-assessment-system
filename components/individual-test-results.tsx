"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Lightbulb, CheckCircle, Star } from "lucide-react"

interface IndividualTestResultsProps {
  logicScore: number
  logicCorrectAnswers: number
  logicTotalQuestions: number
  logicLevel: string
  logicDescription: string
  logicSuggestion: string
  creativityScore: number
  creativityTotalScore: number
  creativityMaxScore: number
  creativityLevel: string
  creativityDescription: string
  creativitySuggestion: string
}

export function IndividualTestResults({
  logicScore,
  logicCorrectAnswers,
  logicTotalQuestions,
  logicLevel,
  logicDescription,
  logicSuggestion,
  creativityScore,
  creativityTotalScore,
  creativityMaxScore,
  creativityLevel,
  creativityDescription,
  creativitySuggestion
}: IndividualTestResultsProps) {
  
  // 獲取邏輯測試等級顏色
  const getLogicLevelColor = (score: number) => {
    if (score >= 90) return "bg-purple-600"
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-blue-500"
    if (score >= 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  // 獲取創意測試等級顏色
  const getCreativityLevelColor = (score: number) => {
    if (score >= 90) return "bg-purple-600"
    if (score >= 75) return "bg-blue-500"
    if (score >= 55) return "bg-green-500"
    if (score >= 35) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 邏輯思維測試 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            邏輯思維測試
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 分數顯示 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">得分</span>
              <div className="flex items-center gap-3">
                <Progress value={logicScore} className="w-24 h-2" />
                <span className="text-2xl font-bold text-red-600">{logicScore}</span>
              </div>
            </div>

            {/* 統計數據 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{logicCorrectAnswers}</div>
                <div className="text-xs text-muted-foreground">答對題數</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{logicTotalQuestions}</div>
                <div className="text-xs text-muted-foreground">總題數</div>
              </div>
            </div>

            {/* 等級和描述 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getLogicLevelColor(logicScore)}`}></div>
                <span className="font-medium text-sm">{logicLevel}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {logicDescription}
              </p>
              <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-muted-foreground">建議：</span>
                  <p className="text-sm text-muted-foreground mt-1">{logicSuggestion}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 創意能力測試 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            創意能力測試
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 分數顯示 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">得分</span>
              <div className="flex items-center gap-3">
                <Progress value={creativityScore} className="w-24 h-2" />
                <span className="text-2xl font-bold text-orange-600">{creativityScore}</span>
              </div>
            </div>

            {/* 統計數據 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{creativityTotalScore}</div>
                <div className="text-xs text-muted-foreground">原始得分</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{creativityMaxScore}</div>
                <div className="text-xs text-muted-foreground">滿分</div>
              </div>
            </div>

            {/* 等級和描述 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getCreativityLevelColor(creativityScore)}`}></div>
                <span className="font-medium text-sm">{creativityLevel}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {creativityDescription}
              </p>
              <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-muted-foreground">建議：</span>
                  <p className="text-sm text-muted-foreground mt-1">{creativitySuggestion}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
