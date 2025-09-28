import { NextRequest, NextResponse } from 'next/server'
import { getCreativeTestAnswersByTestResultId } from '@/lib/database/models/creative_test_answer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testResultId = searchParams.get('testResultId')

    if (!testResultId) {
      return NextResponse.json(
        { success: false, error: '缺少測試結果ID' },
        { status: 400 }
      )
    }

    // 獲取創意測驗答案
    const answers = await getCreativeTestAnswersByTestResultId(testResultId)

    return NextResponse.json({
      success: true,
      data: answers
    })

  } catch (error) {
    console.error('獲取創意測驗答案失敗:', error)
    return NextResponse.json(
      { success: false, error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
