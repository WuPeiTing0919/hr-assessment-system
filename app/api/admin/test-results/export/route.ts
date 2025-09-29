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
            const logicAnswer = logicAnswers[0]
            details = {
              correctAnswers: logicAnswer.correct_answers,
              totalQuestions: logicAnswer.total_questions,
              accuracy: logicAnswer.accuracy
            }
          }
        } else if (result.test_type === 'creative') {
          const creativeAnswers = await getCreativeTestAnswersByTestResultId(result.id)
          if (creativeAnswers.length > 0) {
            const creativeAnswer = creativeAnswers[0]
            details = {
              dimensionScores: creativeAnswer.dimension_scores,
              totalScore: creativeAnswer.total_score,
              maxScore: creativeAnswer.max_score
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

    // 生成 CSV 格式的資料
    const headers = [
      "用戶姓名",
      "用戶郵箱",
      "部門",
      "測試類型",
      "分數",
      "等級",
      "完成時間",
      "詳細資料"
    ]

    const data = filteredResults.map(result => {
      const getScoreLevel = (score: number) => {
        if (score >= 90) return "優秀"
        if (score >= 80) return "良好"
        if (score >= 70) return "中等"
        if (score >= 60) return "及格"
        return "待加強"
      }

      const getTestTypeName = (type: string) => {
        switch (type) {
          case "logic": return "邏輯思維"
          case "creative": return "創意能力"
          case "combined": return "綜合能力"
          default: return "未知"
        }
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

      let detailsStr = ""
      if (result.details) {
        if (result.type === 'logic' && result.details.correctAnswers !== undefined) {
          detailsStr = `正確答案: ${result.details.correctAnswers}/${result.details.totalQuestions}, 準確率: ${result.details.accuracy}%`
        } else if (result.type === 'creative' && result.details.dimensionScores) {
          detailsStr = `總分: ${result.details.totalScore}/${result.details.maxScore}, 維度分數: ${JSON.stringify(result.details.dimensionScores)}`
        } else if (result.type === 'combined' && result.details.logicScore !== undefined) {
          const logicScore = result.details.logicScore ?? '無資料'
          const creativeScore = result.details.creativeScore ?? '無資料'
          const abilityBalance = result.details.abilityBalance ?? '無資料'
          detailsStr = `邏輯: ${logicScore}, 創意: ${creativeScore}, 平衡: ${abilityBalance}`
        }
      }

      return [
        result.userName,
        result.userEmail,
        result.userDepartment,
        getTestTypeName(result.type),
        result.score,
        getScoreLevel(result.score),
        formatDate(result.completedAt),
        detailsStr
      ]
    })

    // 轉換為 CSV 格式
    const csvRows = [headers, ...data].map(row =>
      row.map(cell => {
        const escaped = String(cell).replace(/"/g, '""')
        return `"${escaped}"`
      }).join(",")
    )

    const csvContent = csvRows.join("\n")

    // 直接使用 UTF-8 BOM 字節
    const bomBytes = new Uint8Array([0xEF, 0xBB, 0xBF]) // UTF-8 BOM
    const contentBytes = new TextEncoder().encode(csvContent)
    const result = new Uint8Array(bomBytes.length + contentBytes.length)
    result.set(bomBytes)
    result.set(contentBytes, bomBytes.length)

    const base64Content = Buffer.from(result).toString('base64')

    return new NextResponse(JSON.stringify({
      success: true,
      data: base64Content,
      filename: `測驗結果_${new Date().toISOString().split('T')[0]}.csv`,
      contentType: "text/csv; charset=utf-8"
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    })

  } catch (error) {
    console.error("匯出測驗結果失敗:", error)
    return NextResponse.json(
      { success: false, message: "匯出失敗", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
