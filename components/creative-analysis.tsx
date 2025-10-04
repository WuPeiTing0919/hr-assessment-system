"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"

interface DimensionScore {
  percentage: number
  rawScore: number
  maxScore: number
}

interface CreativeAnalysisProps {
  score: number
  dimensionScores: {
    innovation: DimensionScore
    imagination: DimensionScore
    flexibility: DimensionScore
    originality: DimensionScore
  }
  creativityLevel: {
    level: string
    description: string
    suggestion: string
  }
  totalScore?: number
  maxScore?: number
}

export function CreativeAnalysis({ score, dimensionScores, creativityLevel, totalScore, maxScore }: CreativeAnalysisProps) {
  // 計算各維度分數
  const categoryResults = [
    {
      category: 'innovation',
      name: '創新能力',
      score: dimensionScores.innovation.percentage,
      rawScore: dimensionScores.innovation.rawScore,
      maxRawScore: dimensionScores.innovation.maxScore
    },
    {
      category: 'imagination',
      name: '想像力',
      score: dimensionScores.imagination.percentage,
      rawScore: dimensionScores.imagination.rawScore,
      maxRawScore: dimensionScores.imagination.maxScore
    },
    {
      category: 'flexibility',
      name: '靈活性',
      score: dimensionScores.flexibility.percentage,
      rawScore: dimensionScores.flexibility.rawScore,
      maxRawScore: dimensionScores.flexibility.maxScore
    },
    {
      category: 'originality',
      name: '原創性',
      score: dimensionScores.originality.percentage,
      rawScore: dimensionScores.originality.rawScore,
      maxRawScore: dimensionScores.originality.maxScore
    }
  ]

  return (
    <div className="space-y-6">
      {/* 創意能力評估 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            創意能力評估
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 md:p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2 text-sm md:text-base">創意能力評估</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              基於您的測試結果，您在創意思維方面表現為「{creativityLevel.level}」水平。
              {score >= 75 &&
                "您具備出色的創新思維能力，善於從不同角度思考問題，能夠產生獨特的想法和解決方案。"}
              {score >= 50 &&
                score < 75 &&
                "您具有一定的創造性思維潛力，建議多參與創新活動，培養發散性思維。"}
              {score < 50 && "建議您多接觸創新思維訓練，培養好奇心和探索精神，提升創造性解決問題的能力。"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 能力維度分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            能力維度分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {categoryResults.map((category) => (
              <div key={category.category} className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm md:text-base">{category.name}</h3>
                  <Badge variant="outline" className="text-xs">{category.score}分</Badge>
                </div>
                <Progress value={category.score} className="h-2" />
                <p className="text-xs md:text-sm text-muted-foreground">
                  {category.rawScore} / {category.maxRawScore} 分
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 創意能力分析圖表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            創意能力分析圖表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 能力維度雷達圖 */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm md:text-base text-center">能力維度雷達圖</h4>
              <div className="flex justify-center">
                <div className="relative w-56 h-56 md:w-72 md:h-72">
                  {/* Radar Chart Background */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Grid circles */}
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    <circle cx="100" cy="100" r="45" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    <circle cx="100" cy="100" r="30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    <circle cx="100" cy="100" r="15" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    
                    {/* Grid lines - 4 axes for 4 dimensions */}
                    {[0, 90, 180, 270].map((angle, index) => {
                      const x1 = 100 + 60 * Math.cos((angle - 90) * Math.PI / 180)
                      const y1 = 100 + 60 * Math.sin((angle - 90) * Math.PI / 180)
                      return (
                        <line
                          key={index}
                          x1="100"
                          y1="100"
                          x2={x1}
                          y2={y1}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      )
                    })}
                    
                    {/* Data points and area */}
                    {categoryResults.map((category, index) => {
                      const angle = (index * 90 - 90) * Math.PI / 180
                      const radius = (category.score / 100) * 60
                      const x = 100 + radius * Math.cos(angle)
                      const y = 100 + radius * Math.sin(angle)
                      
                      // Calculate label position - more space for text
                      let labelRadius = 75
                      let labelX = 100 + labelRadius * Math.cos(angle)
                      let labelY = 100 + labelRadius * Math.sin(angle)
                      
                      // Special adjustments for imagination and originality
                      if (angle === 0) { // Right - 想像力
                        labelRadius = 70
                        labelX = 100 + labelRadius * Math.cos(angle)
                        labelY = 100 + labelRadius * Math.sin(angle)
                      } else if (angle === 180 * Math.PI / 180) { // Left - 原創性
                        labelRadius = 70
                        labelX = 100 + labelRadius * Math.cos(angle)
                        labelY = 100 + labelRadius * Math.sin(angle)
                      }
                      
                      // Adjust text anchor based on position
                      let textAnchor: "middle" | "start" | "end" = "middle"
                      let dominantBaseline: "middle" | "hanging" | "alphabetic" = "middle"
                      
                      if (angle === -90 * Math.PI / 180) { // Top
                        dominantBaseline = "hanging"
                      } else if (angle === 90 * Math.PI / 180) { // Bottom
                        dominantBaseline = "alphabetic"
                      } else if (angle === 0) { // Right
                        textAnchor = "start"
                      } else if (angle === 180 * Math.PI / 180) { // Left
                        textAnchor = "end"
                      }
                      
                      return (
                        <g key={category.category}>
                          {/* Data point */}
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#3b82f6"
                            stroke="white"
                            strokeWidth="2"
                            className="drop-shadow-sm"
                          />
                          {/* Label - positioned closer to the chart */}
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor={textAnchor}
                            dominantBaseline={dominantBaseline}
                            className="text-[10px] fill-gray-600 font-medium"
                          >
                            {category.name}
                          </text>
                          {/* Score label - positioned above the data point */}
                          <text
                            x={x}
                            y={y - 12}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[10px] fill-blue-600 font-bold"
                            style={{ textShadow: '1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white' }}
                          >
                            {category.score}%
                          </text>
                        </g>
                      )
                    })}
                    
                    {/* Area fill */}
                    <polygon
                      points={categoryResults.map((category, index) => {
                        const angle = (index * 90 - 90) * Math.PI / 180
                        const radius = (category.score / 100) * 60
                        const x = 100 + radius * Math.cos(angle)
                        const y = 100 + radius * Math.sin(angle)
                        return `${x},${y}`
                      }).join(' ')}
                      fill="rgba(59, 130, 246, 0.2)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {categoryResults.map((category) => (
                    <div key={category.category} className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dimension Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryResults.map((category) => {
                  const getDescription = (categoryName: string) => {
                    switch (categoryName) {
                      case '創新能力':
                        return '善於提出新想法，勇於嘗試不同的解決方案'
                      case '想像力':
                        return '能夠從不同角度思考，具有豐富的創意思維'
                      case '靈活性':
                        return '適應變化能力強，能夠靈活調整思維方式'
                      case '原創性':
                        return '具有獨特的創見，能夠產生原創性想法'
                      default:
                        return ''
                    }
                  }
                  
                  const getLevel = (score: number) => {
                    if (score >= 80) return { text: '優秀', color: 'text-green-600' }
                    if (score >= 60) return { text: '良好', color: 'text-blue-600' }
                    if (score >= 40) return { text: '一般', color: 'text-yellow-600' }
                    return { text: '待提升', color: 'text-red-600' }
                  }
                  
                  const level = getLevel(category.score)
                  
                  return (
                    <div key={category.category} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{category.name}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-blue-600">{category.score}%</span>
                          <span className={`text-xs ${level.color}`}>{level.text}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {getDescription(category.name)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
