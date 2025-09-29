import { NextRequest, NextResponse } from "next/server"
import { getAllTestResults } from "@/lib/database/models/test_result"
import { getLogicTestAnswersByTestResultId } from "@/lib/database/models/logic_test_answer"
import { getCreativeTestAnswersByTestResultId } from "@/lib/database/models/creative_test_answer"
import { getAllCombinedTestResults } from "@/lib/database/models/combined_test_result"
import { getAllUsers } from "@/lib/database/models/user"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || "all"
    const testType = searchParams.get("testType") || "all"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    // 獲取所有用戶
    const users = await getAllUsers()
    const userMap = new Map(users.map(user => [user.id, user]))

    // 獲取所有測試結果
    const [testResults, combinedResults] = await Promise.all([
      getAllTestResults(),
      getAllCombinedTestResults()
    ])

    // 合併所有測試結果
    const allResults = []

    // 處理邏輯和創意測試結果
    for (const result of testResults) {
      const user = userMap.get(result.user_id)
      if (user) {
        let details = null
        
        // 根據測試類型獲取詳細資料
        if (result.test_type === 'logic') {
          const logicAnswers = await getLogicTestAnswersByTestResultId(result.id)
          if (logicAnswers.length > 0) {
            const correctAnswers = logicAnswers.filter(answer => answer.is_correct).length
            const totalQuestions = logicAnswers.length
            const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
            details = {
              correctAnswers,
              totalQuestions,
              accuracy
            }
          }
        } else if (result.test_type === 'creative') {
          const creativeAnswers = await getCreativeTestAnswersByTestResultId(result.id)
          if (creativeAnswers.length > 0) {
            const totalScore = creativeAnswers.reduce((sum, answer) => sum + answer.score, 0)
            const maxScore = creativeAnswers.length * 5 // Assuming max score per question is 5
            details = {
              dimensionScores: {}, // This would need to be calculated based on question categories
              totalScore,
              maxScore
            }
          }
        }

        allResults.push({
          id: result.id,
          userId: result.user_id,
          userName: user.name,
          userDepartment: user.department,
          userEmail: user.email,
          type: result.test_type as 'logic' | 'creative',
          score: result.score,
          completedAt: result.completed_at,
          details
        })
      }
    }

    // 處理綜合測試結果
    for (const result of combinedResults) {
      const user = userMap.get(result.user_id)
      if (user) {
        allResults.push({
          id: result.id,
          userId: result.user_id,
          userName: user.name,
          userDepartment: user.department,
          userEmail: user.email,
          type: 'combined' as const,
          score: result.overall_score,
          completedAt: result.completed_at,
          details: {
            logicScore: result.logic_score,
            creativeScore: result.creativity_score, // 使用 creativity_score
            abilityBalance: result.balance_score,   // 使用 balance_score
            breakdown: result.logic_breakdown
          }
        })
      }
    }

    // 按完成時間排序（最新的在前）
    allResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    // 應用篩選
    let filteredResults = allResults

    // 搜尋篩選
    if (search) {
      filteredResults = filteredResults.filter(result => 
        result.userName.toLowerCase().includes(search.toLowerCase()) ||
        result.userEmail.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 部門篩選
    if (department !== "all") {
      filteredResults = filteredResults.filter(result => result.userDepartment === department)
    }

    // 測試類型篩選
    if (testType !== "all") {
      filteredResults = filteredResults.filter(result => result.type === testType)
    }

    // 分頁
    const totalResults = filteredResults.length
    const totalPages = Math.ceil(totalResults / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = filteredResults.slice(startIndex, endIndex)

    // 計算統計資料
    const stats = {
      totalResults: allResults.length,
      filteredResults: filteredResults.length,
      averageScore: allResults.length > 0 
        ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length) 
        : 0,
      totalUsers: users.length,
      usersWithResults: new Set(allResults.map(r => r.userId)).size,
      participationRate: users.length > 0 
        ? Math.round((new Set(allResults.map(r => r.userId)).size / users.length) * 100) 
        : 0,
      testTypeCounts: {
        logic: allResults.filter(r => r.type === 'logic').length,
        creative: allResults.filter(r => r.type === 'creative').length,
        combined: allResults.filter(r => r.type === 'combined').length
      }
    }

    // 獲取所有部門列表
    const departments = Array.from(new Set(users.map(user => user.department))).sort()

    return NextResponse.json({
      success: true,
      data: {
        results: paginatedResults,
        stats,
        pagination: {
          currentPage: page,
          totalPages,
          totalResults,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        departments
      }
    })

  } catch (error) {
    console.error("獲取管理員測驗結果失敗:", error)
    return NextResponse.json(
      { success: false, message: "獲取測驗結果失敗", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
