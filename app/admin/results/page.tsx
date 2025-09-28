"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, BarChart3, ArrowLeft, Search, Download, Filter } from "lucide-react"
import Link from "next/link"
import { useAuth, type User } from "@/lib/hooks/use-auth"

interface TestResult {
  userId: string
  userName: string
  userDepartment: string
  type: "logic" | "creative" | "combined"
  score: number
  completedAt: string
  details?: any
}

export default function AdminResultsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminResultsContent />
    </ProtectedRoute>
  )
}

function AdminResultsContent() {
  const { user } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [testTypeFilter, setTestTypeFilter] = useState("all")
  const [stats, setStats] = useState({
    totalResults: 0,
    averageScore: 0,
    totalUsers: 0,
    completionRate: 0,
  })

  const departments = ["人力資源部", "資訊技術部", "財務部", "行銷部", "業務部", "研發部", "客服部", "其他"]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchTerm, departmentFilter, testTypeFilter])

  const loadData = () => {
    // Load users
    const usersData = JSON.parse(localStorage.getItem("hr_users") || "[]")
    setUsers(usersData)

    // Load all test results
    const allResults: TestResult[] = []

    usersData.forEach((user: User) => {
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
          details: data,
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
          details: data,
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
          details: data,
        })
      }
    })

    // Sort by completion date (newest first)
    allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    setResults(allResults)

    // Calculate statistics
    const totalResults = allResults.length
    const averageScore =
      totalResults > 0 ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / totalResults) : 0
    const totalUsers = usersData.length
    const usersWithResults = new Set(allResults.map((r) => r.userId)).size
    const completionRate = totalUsers > 0 ? Math.round((usersWithResults / totalUsers) * 100) : 0

    setStats({
      totalResults,
      averageScore,
      totalUsers,
      completionRate,
    })
  }

  const filterResults = () => {
    let filtered = results

    // Filter by search term (user name)
    if (searchTerm) {
      filtered = filtered.filter((result) => result.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter((result) => result.userDepartment === departmentFilter)
    }

    // Filter by test type
    if (testTypeFilter !== "all") {
      filtered = filtered.filter((result) => result.type === testTypeFilter)
    }

    setFilteredResults(filtered)
  }

  const getTestTypeInfo = (type: string) => {
    switch (type) {
      case "logic":
        return {
          name: "邏輯思維",
          icon: Brain,
          color: "bg-primary",
          textColor: "text-primary",
        }
      case "creative":
        return {
          name: "創意能力",
          icon: Lightbulb,
          color: "bg-accent",
          textColor: "text-accent",
        }
      case "combined":
        return {
          name: "綜合能力",
          icon: BarChart3,
          color: "bg-gradient-to-r from-primary to-accent",
          textColor: "text-primary",
        }
      default:
        return {
          name: "未知",
          icon: BarChart3,
          color: "bg-muted",
          textColor: "text-muted-foreground",
        }
    }
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "優秀", color: "bg-green-500" }
    if (score >= 80) return { level: "良好", color: "bg-blue-500" }
    if (score >= 70) return { level: "中等", color: "bg-yellow-500" }
    if (score >= 60) return { level: "及格", color: "bg-orange-500" }
    return { level: "不及格", color: "bg-red-500" }
  }

  const exportResults = () => {
    const csvContent = [
      ["姓名", "部門", "測試類型", "分數", "等級", "完成時間"],
      ...filteredResults.map((result) => [
        result.userName,
        result.userDepartment,
        getTestTypeInfo(result.type).name,
        result.score.toString(),
        getScoreLevel(result.score).level,
        new Date(result.completedAt).toLocaleString("zh-TW"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `測試結果_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
              <h1 className="text-xl font-bold text-foreground">所有測試結果</h1>
              <p className="text-sm text-muted-foreground">查看和分析所有員工的測試結果</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.totalResults}</div>
                <div className="text-sm text-muted-foreground">總測試次數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.averageScore}</div>
                <div className="text-sm text-muted-foreground">平均分數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">總用戶數</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.completionRate}%</div>
                <div className="text-sm text-muted-foreground">參與率</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                篩選條件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">搜尋用戶</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="輸入用戶姓名"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">部門</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">測試類型</label>
                  <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有類型</SelectItem>
                      <SelectItem value="logic">邏輯思維</SelectItem>
                      <SelectItem value="creative">創意能力</SelectItem>
                      <SelectItem value="combined">綜合能力</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">操作</label>
                  <Button onClick={exportResults} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    匯出結果
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>測試結果列表</CardTitle>
              <CardDescription>
                顯示 {filteredResults.length} 筆結果（共 {results.length} 筆）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用戶</TableHead>
                    <TableHead>部門</TableHead>
                    <TableHead>測試類型</TableHead>
                    <TableHead>分數</TableHead>
                    <TableHead>等級</TableHead>
                    <TableHead>完成時間</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index) => {
                    const testInfo = getTestTypeInfo(result.type)
                    const scoreLevel = getScoreLevel(result.score)
                    const Icon = testInfo.icon

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">{result.userName}</div>
                        </TableCell>
                        <TableCell>{result.userDepartment}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 ${testInfo.color} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className={testInfo.textColor}>{testInfo.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-lg font-bold">{result.score}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${scoreLevel.color} text-white`}>{scoreLevel.level}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(result.completedAt).toLocaleString("zh-TW")}</div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {filteredResults.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">沒有找到符合條件的測試結果</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
