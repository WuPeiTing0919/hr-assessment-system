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

  const departments = ["人力資源部", "資訊技術部", "財務部", "行銷部", "業務部", "研發部", "客服部", "其他"]

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = () => {
    // Load users
    const users: User[] = JSON.parse(localStorage.getItem("hr_users") || "[]")

    // Load all test results
    const allResults: TestResult[] = []

    users.forEach((user: User) => {
      // Check for logic test results
      const logicKey = `logicTestResults_${user.id}`
      const logicResults = localStorage.getItem(logicKey)
      if (logicResults) {
        const data = JSON.parse(logicResults)
        allResults.push({
          userId: user.id,
          userName: user.name,
          userDepartment: user.department,
          type: "logic",
          score: data.score,
          completedAt: data.completedAt,
        })
      }

      // Check for creative test results
      const creativeKey = `creativeTestResults_${user.id}`
      const creativeResults = localStorage.getItem(creativeKey)
      if (creativeResults) {
        const data = JSON.parse(creativeResults)
        allResults.push({
          userId: user.id,
          userName: user.name,
          userDepartment: user.department,
          type: "creative",
          score: data.score,
          completedAt: data.completedAt,
        })
      }

      // Check for combined test results
      const combinedKey = `combinedTestResults_${user.id}`
      const combinedResults = localStorage.getItem(combinedKey)
      if (combinedResults) {
        const data = JSON.parse(combinedResults)
        allResults.push({
          userId: user.id,
          userName: user.name,
          userDepartment: user.department,
          type: "combined",
          score: data.overallScore,
          completedAt: data.completedAt,
        })
      }
    })

    // Calculate department statistics
    const deptStats: DepartmentStats[] = departments
      .map((dept) => {
        const deptUsers = users.filter((u) => u.department === dept)
        const deptResults = allResults.filter((r) => r.userDepartment === dept)
        const participatedUsers = new Set(deptResults.map((r) => r.userId)).size

        // Calculate average scores by test type
        const logicResults = deptResults.filter((r) => r.type === "logic")
        const creativeResults = deptResults.filter((r) => r.type === "creative")
        const combinedResults = deptResults.filter((r) => r.type === "combined")

        const averageLogicScore =
          logicResults.length > 0
            ? Math.round(logicResults.reduce((sum, r) => sum + r.score, 0) / logicResults.length)
            : 0

        const averageCreativeScore =
          creativeResults.length > 0
            ? Math.round(creativeResults.reduce((sum, r) => sum + r.score, 0) / creativeResults.length)
            : 0

        const averageCombinedScore =
          combinedResults.length > 0
            ? Math.round(combinedResults.reduce((sum, r) => sum + r.score, 0) / combinedResults.length)
            : 0

        // Calculate overall average
        const allScores = [averageLogicScore, averageCreativeScore, averageCombinedScore].filter((s) => s > 0)
        const overallAverage =
          allScores.length > 0 ? Math.round(allScores.reduce((sum, s) => sum + s, 0) / allScores.length) : 0

        // Find top performer
        const userScores = new Map<string, number[]>()
        deptResults.forEach((result) => {
          if (!userScores.has(result.userId)) {
            userScores.set(result.userId, [])
          }
          userScores.get(result.userId)!.push(result.score)
        })

        let topPerformer: string | null = null
        let topScore = 0
        userScores.forEach((scores, userId) => {
          const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length
          if (avgScore > topScore) {
            topScore = avgScore
            const user = users.find((u) => u.id === userId)
            topPerformer = user ? user.name : null
          }
        })

        return {
          department: dept,
          totalUsers: deptUsers.length,
          participatedUsers,
          participationRate: deptUsers.length > 0 ? Math.round((participatedUsers / deptUsers.length) * 100) : 0,
          averageLogicScore,
          averageCreativeScore,
          averageCombinedScore,
          overallAverage,
          topPerformer,
          testCounts: {
            logic: logicResults.length,
            creative: creativeResults.length,
            combined: combinedResults.length,
          },
        }
      })
      .filter((stat) => stat.totalUsers > 0) // Only show departments with users

    setDepartmentStats(deptStats)

    // Calculate overall statistics
    const totalUsers = users.length
    const totalParticipants = new Set(allResults.map((r) => r.userId)).size
    const overallParticipationRate = totalUsers > 0 ? Math.round((totalParticipants / totalUsers) * 100) : 0
    const averageScore =
      allResults.length > 0 ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length) : 0

    setOverallStats({
      totalUsers,
      totalParticipants,
      overallParticipationRate,
      averageScore,
      totalTests: allResults.length,
    })
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{overallStats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">總用戶數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{overallStats.totalParticipants}</div>
                <div className="text-sm text-muted-foreground">參與用戶</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{overallStats.overallParticipationRate}%</div>
                <div className="text-sm text-muted-foreground">參與率</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{overallStats.averageScore}</div>
                <div className="text-sm text-muted-foreground">平均分數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{overallStats.totalTests}</div>
                <div className="text-sm text-muted-foreground">總測試次數</div>
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
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
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
