import { NextRequest, NextResponse } from 'next/server'
import { createCombinedTestResult } from '@/lib/database/models/combined_test_result'

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
    const {
      userId,
      logicScore,
      creativityScore,
      overallScore,
      level,
      description,
      logicBreakdown,
      creativityBreakdown,
      balanceScore,
      completedAt
    } = body

    // 驗證必要欄位
    if (!userId || logicScore === undefined || creativityScore === undefined || 
        overallScore === undefined || !level || !completedAt) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位' },
        { status: 400 }
      )
    }

    console.log('🔄 開始建立綜合測試結果...')
    console.log('用戶ID:', userId)
    console.log('邏輯分數:', logicScore)
    console.log('創意分數:', creativityScore)
    console.log('總分:', overallScore)
    console.log('等級:', level)

    // 統一使用台灣時間格式
    // 將 UTC 時間轉換為台灣時間，然後轉換為 MySQL 格式
    const utcDate = new Date(completedAt)
    const taiwanTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000)) // UTC + 8 小時
    const mysqlCompletedAt = taiwanTime.toISOString().replace('Z', '').replace('T', ' ')

    // 建立綜合測試結果
    const testResult = await createCombinedTestResult({
      user_id: userId,
      logic_score: logicScore,
      creativity_score: creativityScore,
      overall_score: overallScore,
      level: level,
      description: description || null,
      logic_breakdown: logicBreakdown || null,
      creativity_breakdown: creativityBreakdown || null,
      balance_score: balanceScore || 0,
      completed_at: mysqlCompletedAt
    })

    if (!testResult) {
      return NextResponse.json(
        { success: false, error: '建立綜合測試結果失敗' },
        { status: 500 }
      )
    }

    console.log('✅ 綜合測試結果建立成功，ID:', testResult.id)

    return NextResponse.json({
      success: true,
      data: {
        testResult
      }
    })

  } catch (error) {
    console.error('上傳綜合測試結果失敗:', error)
    return NextResponse.json(
      {
        success: false,
        error: '伺服器錯誤',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    )
  }
}

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

    // 獲取用戶的綜合測試結果
    const { getCombinedTestResultsByUserId } = await import('@/lib/database/models/combined_test_result')
    const results = await getCombinedTestResultsByUserId(userId)

    return NextResponse.json({
      success: true,
      data: results
    })

  } catch (error) {
    console.error('獲取綜合測試結果失敗:', error)
    return NextResponse.json(
      { success: false, error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
