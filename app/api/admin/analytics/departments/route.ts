import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database/connection"

export async function GET(request: NextRequest) {
  try {
    // 獲取所有用戶
    const users = await executeQuery(`
      SELECT id, name, department, role
      FROM users
      ORDER BY department, name
    `)

    // 獲取所有測試結果
    const testResults = await executeQuery(`
      SELECT 
        tr.user_id,
        tr.test_type,
        tr.score,
        tr.completed_at,
        u.name as user_name,
        u.department
      FROM test_results tr
      LEFT JOIN users u ON tr.user_id = u.id
      ORDER BY u.department, tr.completed_at DESC
    `)

    // 獲取綜合測試結果
    const combinedResults = await executeQuery(`
      SELECT 
        ctr.user_id,
        ctr.logic_score,
        ctr.creativity_score,
        ctr.overall_score,
        ctr.completed_at,
        u.name as user_name,
        u.department
      FROM combined_test_results ctr
      LEFT JOIN users u ON ctr.user_id = u.id
      ORDER BY u.department, ctr.completed_at DESC
    `)

    // 按部門分組統計
    const departmentMap = new Map()

    // 初始化所有部門
    const allDepartments = Array.from(new Set(users.map((u: any) => u.department)))
    
    allDepartments.forEach(dept => {
      departmentMap.set(dept, {
        department: dept,
        totalUsers: 0,
        participatedUsers: new Set(),
        logicScores: [],
        creativeScores: [],
        combinedScores: [],
        testCounts: {
          logic: 0,
          creative: 0,
          combined: 0
        }
      })
    })

    // 統計用戶數據
    users.forEach((user: any) => {
      const dept = user.department
      if (departmentMap.has(dept)) {
        departmentMap.get(dept).totalUsers++
      }
    })

    // 統計測試結果
    testResults.forEach((result: any) => {
      const dept = result.department
      if (departmentMap.has(dept)) {
        const deptData = departmentMap.get(dept)
        deptData.participatedUsers.add(result.user_id)
        deptData.testCounts[result.test_type]++
        
        if (result.test_type === 'logic') {
          deptData.logicScores.push(result.score)
        } else if (result.test_type === 'creative') {
          deptData.creativeScores.push(result.score)
        }
      }
    })

    // 統計綜合測試結果
    combinedResults.forEach((result: any) => {
      const dept = result.department
      if (departmentMap.has(dept)) {
        const deptData = departmentMap.get(dept)
        deptData.participatedUsers.add(result.user_id)
        deptData.testCounts.combined++
        deptData.combinedScores.push(result.overall_score)
      }
    })

    // 計算部門統計數據
    const departmentStats = Array.from(departmentMap.values()).map(deptData => {
      const participatedCount = deptData.participatedUsers.size
      const participationRate = deptData.totalUsers > 0 
        ? Math.round((participatedCount / deptData.totalUsers) * 100) 
        : 0

      // 計算平均分數
      const averageLogicScore = deptData.logicScores.length > 0
        ? Math.round(deptData.logicScores.reduce((sum: number, score: number) => sum + score, 0) / deptData.logicScores.length)
        : 0

      const averageCreativeScore = deptData.creativeScores.length > 0
        ? Math.round(deptData.creativeScores.reduce((sum: number, score: number) => sum + score, 0) / deptData.creativeScores.length)
        : 0

      const averageCombinedScore = deptData.combinedScores.length > 0
        ? Math.round(deptData.combinedScores.reduce((sum: number, score: number) => sum + score, 0) / deptData.combinedScores.length)
        : 0

      // 計算整體平均分數
      const allScores = [averageLogicScore, averageCreativeScore, averageCombinedScore].filter(s => s > 0)
      const overallAverage = allScores.length > 0
        ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
        : 0

      return {
        department: deptData.department,
        totalUsers: deptData.totalUsers,
        participatedUsers: participatedCount,
        participationRate,
        averageLogicScore,
        averageCreativeScore,
        averageCombinedScore,
        overallAverage,
        testCounts: deptData.testCounts
      }
    })

    // 計算整體統計
    const totalUsers = users.length
    const totalParticipants = new Set([
      ...testResults.map((r: any) => r.user_id),
      ...combinedResults.map((r: any) => r.user_id)
    ]).size
    const overallParticipationRate = totalUsers > 0 
      ? Math.round((totalParticipants / totalUsers) * 100) 
      : 0

    // 計算整體平均分數
    const allScores = [
      ...testResults.map((r: any) => r.score),
      ...combinedResults.map((r: any) => r.overall_score)
    ]
    const averageScore = allScores.length > 0
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : 0

    const totalTests = testResults.length + combinedResults.length

    return NextResponse.json({
      success: true,
      data: {
        departmentStats,
        overallStats: {
          totalUsers,
          totalParticipants,
          overallParticipationRate,
          averageScore,
          totalTests
        }
      }
    })

  } catch (error) {
    console.error("獲取部門分析數據失敗:", error)
    return NextResponse.json(
      { success: false, message: "獲取部門分析數據失敗", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
