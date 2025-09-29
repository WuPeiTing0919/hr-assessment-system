"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, BarChart3, ArrowLeft, Search, Download, Filter, ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"

interface TestResult {
  id: string
  userId: string
  userName: string
  userDepartment: string
  userEmail: string
  type: "logic" | "creative" | "combined"
  score: number
  completedAt: string
  details?: any
}

interface AdminTestResultsStats {
  totalResults: number
  filteredResults: number
  averageScore: number
  totalUsers: number
  usersWithResults: number
  participationRate: number
  testTypeCounts: {
    logic: number
    creative: number
    combined: number
  }
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalResults: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
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
  const [stats, setStats] = useState<AdminTestResultsStats>({
    totalResults: 0,
    filteredResults: 0,
    averageScore: 0,
    totalUsers: 0,
    usersWithResults: 0,
    participationRate: 0,
    testTypeCounts: { logic: 0, creative: 0, combined: 0 }
  })
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [departments, setDepartments] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [testTypeFilter, setTestTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadData()
  }, [searchTerm, departmentFilter, testTypeFilter, pagination.currentPage])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        department: departmentFilter,
        testType: testTypeFilter,
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString()
      })

      const response = await fetch(`/api/admin/test-results?${params}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.data.results)
        setStats(data.data.stats)
        setPagination(data.data.pagination)
        setDepartments(data.data.departments)
      } else {
        setError(data.message || "載入資料失敗")
      }
    } catch (error) {
      console.error("載入測驗結果失敗:", error)
      setError("載入資料時發生錯誤")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleTestTypeChange = (value: string) => {
    setTestTypeFilter(value)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const handlePreviousPage = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(pagination.currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(pagination.currentPage + 1)
    }
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
    return { level: "待加強", color: "bg-red-500" }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        department: departmentFilter,
        testType: testTypeFilter
      })

      const response = await fetch(`/api/admin/test-results/export?${params}`)
      const data = await response.json()

      if (data.success) {
        // 解碼 Base64 資料，保留 UTF-8 BOM
        const binaryString = atob(data.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }

        // 創建 Blob，保留原始字節資料
        const blob = new Blob([bytes], {
          type: 'text/csv;charset=utf-8'
        })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        console.error('匯出失敗:', data.message)
        alert('匯出失敗，請稍後再試')
      }
    } catch (error) {
      console.error('匯出錯誤:', error)
      alert('匯出時發生錯誤，請稍後再試')
    }
  }

  const handleViewDetail = async (result: TestResult) => {
    setSelectedResult(result)
    setShowDetailModal(true)
    setIsLoadingDetail(true)

    try {
      const response = await fetch(`/api/admin/test-results/detail?testResultId=${result.id}&testType=${result.type}`)
      const data = await response.json()

      if (data.success) {
        console.log('前端收到的詳細資料:', data.data)
        console.log('題目數量:', data.data.questions?.length || 0)
        setDetailData(data.data)
      } else {
        console.error('獲取詳細結果失敗:', data.message)
        alert('獲取詳細結果失敗，請稍後再試')
      }
    } catch (error) {
      console.error('獲取詳細結果錯誤:', error)
      alert('獲取詳細結果時發生錯誤，請稍後再試')
    } finally {
      setIsLoadingDetail(false)
    }
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
          {/* Summary Cards */}
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
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stats.participationRate}%</div>
                <div className="text-sm text-muted-foreground">參與率</div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                篩選條件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">搜尋用戶</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="輸入用戶姓名"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">部門</label>
                  <Select value={departmentFilter} onValueChange={handleDepartmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="所有部門" />
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

                <div>
                  <label className="text-sm font-medium mb-2 block">測試類型</label>
                  <Select value={testTypeFilter} onValueChange={handleTestTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="所有類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有類型</SelectItem>
                      <SelectItem value="logic">邏輯思維</SelectItem>
                      <SelectItem value="creative">創意能力</SelectItem>
                      <SelectItem value="combined">綜合能力</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleExport} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    匯出結果
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results List */}
          <Card>
            <CardHeader>
              <CardTitle>測試結果列表</CardTitle>
              <CardDescription>
                顯示 {pagination.totalResults} 筆結果 (共 {stats.totalResults} 筆)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>載入中...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  {error}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  沒有找到符合條件的測試結果
                </div>
              ) : (
                <>
              <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用戶</TableHead>
                        <TableHead>部門</TableHead>
                        <TableHead>測試類型</TableHead>
                        <TableHead>分數</TableHead>
                        <TableHead>等級</TableHead>
                        <TableHead>完成時間</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                <TableBody>
                      {results.map((result) => {
                        const testTypeInfo = getTestTypeInfo(result.type)
                    const scoreLevel = getScoreLevel(result.score)
                        const IconComponent = testTypeInfo.icon

                    return (
                          <TableRow key={result.id}>
                        <TableCell>
                              <div>
                          <div className="font-medium">{result.userName}</div>
                                <div className="text-sm text-muted-foreground">{result.userEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{result.userDepartment}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${testTypeInfo.color}`}>
                                  <IconComponent className="w-4 h-4 text-white" />
                            </div>
                                <span className={testTypeInfo.textColor}>{testTypeInfo.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-lg font-bold">{result.score}</div>
                        </TableCell>
                        <TableCell>
                              <Badge className={`${scoreLevel.color} text-white`}>
                                {scoreLevel.level}
                              </Badge>
                        </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(result.completedAt)}</div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(result)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                查看詳情
                              </Button>
                            </TableCell>
                          </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                      <div className="text-sm text-muted-foreground text-center sm:text-left">
                        顯示第 {(pagination.currentPage - 1) * pagination.limit + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.totalResults)} 筆，共 {pagination.totalResults} 筆
                      </div>
                      
                      {/* Desktop Pagination */}
                      <div className="hidden sm:flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={!pagination.hasPrevPage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          上一頁
                        </Button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={pagination.currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={!pagination.hasNextPage}
                        >
                          下一頁
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Mobile Pagination */}
                      <div className="flex sm:hidden items-center space-x-2 w-full justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={!pagination.hasPrevPage}
                          className="flex-1 max-w-[80px]"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          上一頁
                        </Button>
                        
                        <div className="flex items-center space-x-1 px-2">
                          {(() => {
                            const maxVisiblePages = 3
                            const startPage = Math.max(1, pagination.currentPage - 1)
                            const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)
                            const pages = []
                            
                            // 如果不在第一頁，顯示第一頁和省略號
                            if (startPage > 1) {
                              pages.push(
                                <Button
                                  key={1}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(1)}
                                  className="w-8 h-8 p-0"
                                >
                                  1
                                </Button>
                              )
                              if (startPage > 2) {
                                pages.push(
                                  <span key="ellipsis1" className="text-muted-foreground px-1">
                                    ...
                                  </span>
                                )
                              }
                            }
                            
                            // 顯示當前頁附近的頁碼
                            for (let i = startPage; i <= endPage; i++) {
                              pages.push(
                                <Button
                                  key={i}
                                  variant={pagination.currentPage === i ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handlePageChange(i)}
                                  className="w-8 h-8 p-0"
                                >
                                  {i}
                                </Button>
                              )
                            }
                            
                            // 如果不在最後一頁，顯示省略號和最後一頁
                            if (endPage < pagination.totalPages) {
                              if (endPage < pagination.totalPages - 1) {
                                pages.push(
                                  <span key="ellipsis2" className="text-muted-foreground px-1">
                                    ...
                                  </span>
                                )
                              }
                              pages.push(
                                <Button
                                  key={pagination.totalPages}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePageChange(pagination.totalPages)}
                                  className="w-8 h-8 p-0"
                                >
                                  {pagination.totalPages}
                                </Button>
                              )
                            }
                            
                            return pages
                          })()}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={!pagination.hasNextPage}
                          className="flex-1 max-w-[80px]"
                        >
                          下一頁
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 詳細結果模態框 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>測驗詳細結果</DialogTitle>
            <DialogDescription>
              {selectedResult && `${selectedResult.userName} - ${getTestTypeInfo(selectedResult.type).name}`}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>載入詳細結果中...</span>
            </div>
          ) : detailData ? (
            <div className="space-y-6">
              {/* 基本資訊 */}
              <Card>
                <CardHeader>
                  <CardTitle>基本資訊</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">用戶姓名</label>
                      <p className="text-sm">{detailData.user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">用戶郵箱</label>
                      <p className="text-sm">{detailData.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">部門</label>
                      <p className="text-sm">{detailData.user.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">完成時間</label>
                      <p className="text-sm">{formatDate(detailData.result.completedAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">總分</label>
                      <p className="text-sm font-bold text-lg">{detailData.result.score}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">等級</label>
                      <Badge className={`${getScoreLevel(detailData.result.score).color} text-white`}>
                        {getScoreLevel(detailData.result.score).level}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 題目詳情 */}
              {detailData.questions && detailData.questions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>答題詳情</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* 邏輯思維題目 */}
                      {detailData.questions.filter((q: any) => q.type === 'logic').length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-blue-600" />
                            邏輯思維題目
                          </h3>
                          <div className="space-y-4">
                            {detailData.questions
                              .filter((q: any) => q.type === 'logic')
                              .map((question: any, index: number) => (
                              <div key={index} className="border rounded-lg p-4 bg-blue-50/30">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-medium">第 {index + 1} 題</h4>
                                  <Badge variant={question.isCorrect ? "default" : "destructive"}>
                                    {question.isCorrect ? "正確" : "錯誤"}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">題目內容</label>
                                    <p className="text-sm mt-1">{question.question}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">選項</label>
                                      <div className="space-y-1 mt-1">
                                        {question.option_a && <p className="text-sm">A. {question.option_a}</p>}
                                        {question.option_b && <p className="text-sm">B. {question.option_b}</p>}
                                        {question.option_c && <p className="text-sm">C. {question.option_c}</p>}
                                        {question.option_d && <p className="text-sm">D. {question.option_d}</p>}
                                        {question.option_e && <p className="text-sm">E. {question.option_e}</p>}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">答案</label>
                                      <div className="space-y-1 mt-1">
                                        <p className="text-sm">用戶答案: <span className="font-bold">{question.userAnswer}</span></p>
                                        <p className="text-sm">正確答案: <span className="font-bold text-green-600">{question.correctAnswer}</span></p>
                                      </div>
                                    </div>
                                  </div>
                                  {question.explanation && (
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">解釋</label>
                                      <p className="text-sm mt-1">{question.explanation}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 創意能力題目 */}
                      {detailData.questions.filter((q: any) => q.type === 'creative').length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-green-600" />
                            創意能力題目
                          </h3>
                          <div className="space-y-4">
                            {detailData.questions
                              .filter((q: any) => q.type === 'creative')
                              .map((question: any, index: number) => (
                              <div key={index} className="border rounded-lg p-4 bg-green-50/30">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-medium">第 {index + 1} 題</h4>
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    {question.score} 分
                                  </Badge>
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">題目內容</label>
                                    <p className="text-sm mt-1">{question.statement}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">用戶答案</label>
                                      <p className="text-sm mt-1">{question.userAnswer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">得分</label>
                                      <p className="text-sm mt-1 font-bold">{question.score} 分</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 單一測試類型的題目（邏輯或創意） */}
                      {detailData.result.type !== 'combined' && detailData.questions.map((question: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium">第 {index + 1} 題</h4>
                            {question.isCorrect !== undefined && (
                              <Badge variant={question.isCorrect ? "default" : "destructive"}>
                                {question.isCorrect ? "正確" : "錯誤"}
                              </Badge>
                            )}
                            {question.score !== undefined && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {question.score} 分
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">題目內容</label>
                              <p className="text-sm mt-1">{question.question || question.statement}</p>
                            </div>

                            {question.type === 'logic' && (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">選項</label>
                                    <div className="space-y-1 mt-1">
                                      {question.option_a && <p className="text-sm">A. {question.option_a}</p>}
                                      {question.option_b && <p className="text-sm">B. {question.option_b}</p>}
                                      {question.option_c && <p className="text-sm">C. {question.option_c}</p>}
                                      {question.option_d && <p className="text-sm">D. {question.option_d}</p>}
                                      {question.option_e && <p className="text-sm">E. {question.option_e}</p>}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">答案</label>
                                    <div className="space-y-1 mt-1">
                                      <p className="text-sm">用戶答案: <span className="font-bold">{question.userAnswer}</span></p>
                                      <p className="text-sm">正確答案: <span className="font-bold text-green-600">{question.correctAnswer}</span></p>
                                    </div>
                                  </div>
                                </div>
                                {question.explanation && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">解釋</label>
                                    <p className="text-sm mt-1">{question.explanation}</p>
                                  </div>
                                )}
                              </>
                            )}

                            {question.type === 'creative' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">用戶答案</label>
                                  <p className="text-sm mt-1">{question.userAnswer}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">得分</label>
                                  <p className="text-sm mt-1 font-bold">{question.score} 分</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 綜合測試詳細分析 */}
              {detailData.result.type === 'combined' && detailData.result.details && (
                <Card>
                  <CardHeader>
                    <CardTitle>綜合能力分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800">邏輯思維</h4>
                        <p className="text-2xl font-bold text-blue-600">{detailData.result.details.logicScore}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">創意能力</h4>
                        <p className="text-2xl font-bold text-green-600">{detailData.result.details.creativeScore}</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-800">能力平衡</h4>
                        <p className="text-2xl font-bold text-purple-600">{detailData.result.details.abilityBalance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              無法載入詳細結果
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}