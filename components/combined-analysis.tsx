"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Lightbulb, Target, TrendingUp, Search, Star } from "lucide-react"

interface CombinedAnalysisProps {
  overallScore: number
  logicScore: number
  creativityScore: number
  balanceScore: number
  level: string
  description: string
  logicBreakdown?: any
  creativityBreakdown?: any
}

export function CombinedAnalysis({ 
  overallScore, 
  logicScore, 
  creativityScore, 
  balanceScore, 
  level, 
  description,
  logicBreakdown,
  creativityBreakdown
}: CombinedAnalysisProps) {
  
  // 獲取等級顏色
  const getLevelColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-purple-500 to-blue-500"
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-green-500"
    if (score >= 70) return "bg-gradient-to-r from-green-500 to-yellow-500"
    if (score >= 60) return "bg-gradient-to-r from-yellow-500 to-orange-500"
    return "bg-gradient-to-r from-orange-500 to-red-500"
  }

  // 獲取能力狀態
  const getAbilityStatus = (score: number) => {
    if (score >= 80) return { text: "表現優秀", color: "text-green-600" }
    if (score >= 60) return { text: "表現良好", color: "text-blue-600" }
    if (score >= 40) return { text: "需要提升", color: "text-yellow-600" }
    return { text: "需要加強", color: "text-red-600" }
  }

  // 獲取平衡狀態
  const getBalanceStatus = (score: number) => {
    if (score >= 80) return { text: "非常均衡", color: "text-green-600" }
    if (score >= 60) return { text: "相對均衡", color: "text-blue-600" }
    if (score >= 40) return { text: "需要平衡", color: "text-yellow-600" }
    return { text: "失衡嚴重", color: "text-red-600" }
  }

  // 生成發展建議
  const getRecommendations = () => {
    const recommendations = []
    
    if (logicScore < 70) {
      recommendations.push("建議加強邏輯思維訓練，多做推理題和數學題")
      recommendations.push("學習系統性思維方法，如思維導圖、流程圖等")
    }
    
    if (creativityScore < 70) {
      recommendations.push("建議參與更多創意活動，如頭腦風暴、設計思維工作坊")
      recommendations.push("培養好奇心，多接觸不同領域的知識和經驗")
    }
    
    const scoreDiff = Math.abs(logicScore - creativityScore)
    if (scoreDiff > 20) {
      if (logicScore > creativityScore) {
        recommendations.push("您的邏輯思維較強，建議平衡發展創意能力")
      } else {
        recommendations.push("您的創意能力較強，建議平衡發展邏輯思維")
      }
    }
    
    if (logicScore >= 80 && creativityScore >= 80) {
      recommendations.push("您具備優秀的綜合能力，建議承擔更多挑戰性工作")
      recommendations.push("可以考慮擔任需要創新和分析並重的領導角色")
    }
    
    return recommendations.length > 0 ? recommendations : ["繼續保持現有的學習節奏，持續提升各方面能力"]
  }

  const recommendations = getRecommendations()
  const logicStatus = getAbilityStatus(logicScore)
  const creativityStatus = getAbilityStatus(creativityScore)
  const balanceStatus = getBalanceStatus(balanceScore)

  return (
    <div className="space-y-6">
      {/* 綜合評估概覽 */}
      <Card className="text-center">
        <CardHeader>
          <div
            className={`w-24 h-24 ${getLevelColor(overallScore)} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <span className="text-3xl font-bold text-white">{overallScore}</span>
          </div>
          <CardTitle className="text-3xl mb-2">綜合評估完成！</CardTitle>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              {level}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground mb-3">{description}</p>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore} className="h-3 mb-4" />
        </CardContent>
      </Card>

      {/* 能力分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            能力分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 邏輯思維 */}
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-sm mb-2">邏輯思維</h3>
              <div className="text-2xl font-bold text-red-600 mb-1">{logicScore}分</div>
              <div className={`text-xs ${logicStatus.color} mb-2`}>{logicStatus.text}</div>
              <Progress value={logicScore} className="h-2" />
            </div>

            {/* 創意能力 */}
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-sm mb-2">創意能力</h3>
              <div className="text-2xl font-bold text-orange-600 mb-1">{creativityScore}分</div>
              <div className={`text-xs ${creativityStatus.color} mb-2`}>{creativityStatus.text}</div>
              <Progress value={creativityScore} className="h-2" />
            </div>

            {/* 能力平衡 */}
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-sm mb-2">能力平衡</h3>
              <div className="text-2xl font-bold text-orange-600 mb-1">{balanceScore}分</div>
              <div className={`text-xs ${balanceStatus.color} mb-2`}>{balanceStatus.text}</div>
              <Progress value={balanceScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 發展建議 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            發展建議
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
