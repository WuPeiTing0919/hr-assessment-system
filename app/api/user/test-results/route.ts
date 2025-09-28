import { NextRequest, NextResponse } from 'next/server'
import { getTestResultsByUserId } from '@/lib/database/models/test_result'

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

    // 獲取用戶的所有測試結果
    const allResults = await getTestResultsByUserId(userId)
    
    if (allResults.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          results: [],
          stats: {
            totalTests: 0,
            averageScore: 0,
            bestScore: 0,
            lastTestDate: null,
            testCounts: {
              logic: 0,
              creative: 0,
              combined: 0
            }
          }
        }
      })
    }

    // 按測試類型分組，只保留每種類型的最新結果
    const latestResults = {
      logic: allResults.filter(r => r.test_type === 'logic').sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )[0],
      creative: allResults.filter(r => r.test_type === 'creative').sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      )[0],
      combined: allResults.filter(r => r.test_type === 'combined').sort((a, b) => 
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
      .map(result => result.score)
    
    const averageScore = latestScores.length > 0 
      ? Math.round(latestScores.reduce((sum, score) => sum + score, 0) / latestScores.length)
      : 0
    
    // 最高分數：基於每種類型測試的最新分數
    const bestScore = latestScores.length > 0 ? Math.max(...latestScores) : 0
    
    // 最近測試日期：基於所有測試結果
    const lastTestDate = allResults.length > 0 
      ? allResults.sort((a, b) => 
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        )[0]?.completed_at || null
      : null

    // 計算各類型測試次數
    const testCounts = {
      logic: allResults.filter(r => r.test_type === 'logic').length,
      creative: allResults.filter(r => r.test_type === 'creative').length,
      combined: allResults.filter(r => r.test_type === 'combined').length
    }

    // 轉換為前端需要的格式
    const formattedResults = results.map(result => ({
      type: result.test_type,
      score: result.score,
      completedAt: result.completed_at,
      testCount: testCounts[result.test_type as keyof typeof testCounts],
      details: {
        id: result.id,
        total_questions: result.total_questions,
        correct_answers: result.correct_answers,
        created_at: result.created_at
      }
    }))

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
