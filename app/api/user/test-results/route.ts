import { NextRequest, NextResponse } from 'next/server'
import { getTestResultsByUserId, TestResult as DBTestResult } from '@/lib/database/models/test_result'
import { getCombinedTestResultsByUserId, CombinedTestResult } from '@/lib/database/models/combined_test_result'
import { findUserById } from '@/lib/database/models/user'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用戶ID' },
        { status: 400 }
      )
    }

    // 獲取邏輯和創意測試結果
    const testResults = await getTestResultsByUserId(userId)
    
    // 獲取綜合測試結果
    const combinedResults = await getCombinedTestResultsByUserId(userId)

    // 按測試類型分組，只保留每種類型的最新結果
    const latestResults = {
      logic: testResults.filter(r => r.test_type === 'logic').sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )[0],
      creative: testResults.filter(r => r.test_type === 'creative').sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )[0],
      combined: combinedResults.sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )[0]
    }

    // 只保留有結果的測試類型
    const results = Object.values(latestResults).filter(result => result !== undefined)

    // 計算統計數據
    // 完成測試：基於每種類型測試是否有最新結果
    const totalTests = Object.values(latestResults).filter(result => result !== undefined).length
    
    // 平均分數：基於每種類型測試的最新分數計算
    const latestScores = Object.values(latestResults)
      .filter(result => result !== undefined)
      .map(result => {
        // 綜合測試結果使用 overall_score，其他使用 score
        return 'overall_score' in result ? result.overall_score : result.score
      })
    
    const averageScore = latestScores.length > 0 
      ? Math.round(latestScores.reduce((sum, score) => sum + score, 0) / latestScores.length)
      : 0
    
    // 最高分數：基於每種類型測試的最新分數
    const bestScore = latestScores.length > 0 ? Math.max(...latestScores) : 0
    
    // 最近測試日期：基於所有測試結果
    const allTestDates = [
      ...testResults.map(r => r.completed_at),
      ...combinedResults.map(r => r.completed_at)
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    
    const lastTestDate = allTestDates.length > 0 ? allTestDates[0] : null

    // 計算各類型測試次數
    const testCounts = {
      logic: testResults.filter(r => r.test_type === 'logic').length,
      creative: testResults.filter(r => r.test_type === 'creative').length,
      combined: combinedResults.length
    }

    // 轉換為前端需要的格式
    const formattedResults = results.map(result => {
      // 檢查是否為綜合測試結果
      if ('overall_score' in result) {
        // 綜合測試結果
        const combinedResult = result as CombinedTestResult
        return {
          type: 'combined' as const,
          score: combinedResult.overall_score,
          completedAt: combinedResult.completed_at,
          testCount: testCounts.combined,
          details: {
            id: combinedResult.id,
            logic_score: combinedResult.logic_score,
            creativity_score: combinedResult.creativity_score,
            level: combinedResult.level,
            description: combinedResult.description,
            balance_score: combinedResult.balance_score,
            created_at: combinedResult.created_at
          }
        }
      } else {
        // 邏輯或創意測試結果
        const testResult = result as DBTestResult
        return {
          type: testResult.test_type,
          score: testResult.score,
          completedAt: testResult.completed_at,
          testCount: testCounts[testResult.test_type as keyof typeof testCounts],
          details: {
            id: testResult.id,
            total_questions: testResult.total_questions,
            correct_answers: testResult.correct_answers,
            created_at: testResult.created_at
          }
        }
      }
    })

    // 按完成時間排序（最新的在前）
    formattedResults.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    return NextResponse.json({
      success: true,
      data: {
        results: formattedResults,
        stats: {
          totalTests,
          averageScore,
          bestScore,
          lastTestDate,
          testCounts
        }
      }
    })

  } catch (error) {
    console.error('獲取用戶測試結果失敗:', error)
    return NextResponse.json(
      { success: false, error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
