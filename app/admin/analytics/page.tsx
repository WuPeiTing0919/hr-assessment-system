"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Lightbulb, BarChart3, ArrowLeft, TrendingUp, Users, Award, Target } from "lucide-react"
import Link from "next/link"
import { useAuth, type User } from "@/lib/hooks/use-auth"

interface DepartmentStats {
  department: string
  totalUsers: number
  participatedUsers: number
  participationRate: number
  averageLogicScore: number
  averageCreativeScore: number
  averageCombinedScore: number
  overallAverage: number
  topPerformer: string | null
  testCounts: {
    logic: number
    creative: number
    combined: number
  }
}

interface TestResult {
  userId: string
  userName: string
  userDepartment: string
  type: "logic" | "creative" | "combined"
  score: number
  completedAt: string
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}

function AnalyticsContent() {
  const { user } = useAuth()
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [overallStats, setOverallStats] = useState({
    totalUsers: 0,
    totalParticipants: 0,
    overallParticipationRate: 0,
    averageScore: 0,
    totalTests: 0,
  })


  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      const response = await fetch('/api/admin/analytics/departments')
      const data = await response.json()

      if (data.success) {
        setDepartmentStats(data.data.departmentStats)
        setOverallStats(data.data.overallStats)
      } else {
        console.error('獲取部門分析數據失敗:', data.message)
      }
    } catch (error) {
      console.error('獲取部門分析數據錯誤:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getParticipationColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-blue-600"
    if (rate >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredStats =
    selectedDepartment === "all"
      ? departmentStats
      : departmentStats.filter((stat) => stat.department === selectedDepartment)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">返回儀表板</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">部門分析</h1>
              <p className="text-sm text-muted-foreground">查看各部門的測試結果統計和分析</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Overall Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Users className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-foreground mb-1">{overallStats.totalUsers}</div>
                <div className="text-xs md:text-sm text-muted-foreground">總用戶數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Target className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-foreground mb-1">{overallStats.totalParticipants}</div>
                <div className="text-xs md:text-sm text-muted-foreground">參與用戶</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-foreground mb-1">{overallStats.overallParticipationRate}%</div>
                <div className="text-xs md:text-sm text-muted-foreground">參與率</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Award className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-foreground mb-1">{overallStats.averageScore}</div>
                <div className="text-xs md:text-sm text-muted-foreground">平均分數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-purple-500" />
                </div>
                <div className="text-lg md:text-2xl font-bold text-foreground mb-1">{overallStats.totalTests}</div>
                <div className="text-xs md:text-sm text-muted-foreground">總測試次數</div>
              </CardContent>
            </Card>
          </div>

          {/* Department Filter */}
          <Card>
            <CardHeader>
              <CardTitle>部門篩選</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有部門</SelectItem>
                    {departmentStats.map((stat) => (
                      <SelectItem key={stat.department} value={stat.department}>
                        {stat.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Department Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStats.map((stat) => (
              <Card key={stat.department} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{stat.department}</span>
                    <Badge variant="outline">
                      {stat.participatedUsers}/{stat.totalUsers} 人參與
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    參與率：
                    <span className={getParticipationColor(stat.participationRate)}>{stat.participationRate}%</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Participation Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">參與率</span>
                      <span className="text-sm font-medium">{stat.participationRate}%</span>
                    </div>
                    <Progress value={stat.participationRate} className="h-2" />
                  </div>

                  {/* Test Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(stat.averageLogicScore)}`}>
                        {stat.averageLogicScore || "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">邏輯思維</div>
                      <div className="text-xs text-muted-foreground">({stat.testCounts.logic} 次)</div>
                    </div>

                    <div className="text-center">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Lightbulb className="w-5 h-5 text-accent" />
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(stat.averageCreativeScore)}`}>
                        {stat.averageCreativeScore || "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">創意能力</div>
                      <div className="text-xs text-muted-foreground">({stat.testCounts.creative} 次)</div>
                    </div>

                    <div className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(stat.averageCombinedScore)}`}>
                        {stat.averageCombinedScore || "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">綜合能力</div>
                      <div className="text-xs text-muted-foreground">({stat.testCounts.combined} 次)</div>
                    </div>
                  </div>

                  {/* Overall Average */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">部門平均分數</span>
                      <span className={`text-xl font-bold ${getScoreColor(stat.overallAverage)}`}>
                        {stat.overallAverage || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Top Performer */}
                  {stat.topPerformer && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">表現最佳</span>
                        <Badge className="bg-yellow-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          {stat.topPerformer}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStats.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {selectedDepartment === "all" ? "暫無部門數據" : "該部門暫無數據"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
