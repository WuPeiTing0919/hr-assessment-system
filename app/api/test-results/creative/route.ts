import { NextRequest, NextResponse } from 'next/server'
import { createTestResult, getTestResultsByUserId } from '@/lib/database/models/test_result'
import { createCreativeTestAnswers } from '@/lib/database/models/creative_test_answer'
import { getAllCreativeQuestions } from '@/lib/database/models/creative_question'

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
    const {
      userId,
      answers,
      completedAt
    } = body

    // 驗證必要欄位
    if (!userId || !answers || !completedAt) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位' },
        { status: 400 }
      )
    }

    // 獲取創意題目
    const questions = await getAllCreativeQuestions()
    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: '無法獲取題目' },
        { status: 500 }
      )
    }

    // 計算分數（包含反向題處理）
    let totalScore = 0
    const answerRecords = []

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const userAnswer = answers[i] || 1 // 預設為1
      
      // 處理反向題：如果是反向題，分數要反轉
      let score = userAnswer
      if (question.is_reverse) {
        score = 6 - userAnswer // 5->1, 4->2, 3->3, 2->4, 1->5
      }

      totalScore += score

      answerRecords.push({
        test_result_id: '', // 稍後填入
        question_id: question.id,
        user_answer: userAnswer,
        score: score
      })
    }

    // 計算百分比分數
    const maxPossibleScore = questions.length * 5 // 每題最高5分
    const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100)

    // 建立測試結果
    console.log('🔄 開始建立創意測驗結果...')
    console.log('測試結果數據:', {
      user_id: userId,
      test_type: 'creative',
      score: scorePercentage,
      total_questions: questions.length,
      correct_answers: totalScore, // 創意測驗用總分數代替正確答案數
      completed_at: completedAt
    })

    const testResult = await createTestResult({
      user_id: userId,
      test_type: 'creative',
      score: scorePercentage,
      total_questions: questions.length,
      correct_answers: totalScore,
      completed_at: completedAt
    })

    console.log('測試結果建立結果:', testResult)

    if (!testResult) {
      console.error('❌ 建立測試結果失敗')
      return NextResponse.json(
        { success: false, error: '建立測試結果失敗' },
        { status: 500 }
      )
    }

    console.log('✅ 測試結果建立成功:', testResult.id)

    // 更新答案記錄的 test_result_id
    answerRecords.forEach(record => {
      record.test_result_id = testResult.id
    })

    // 建立答案記錄
    const answerResults = await createCreativeTestAnswers(answerRecords)

    return NextResponse.json({
      success: true,
      data: {
        testResult,
        answerCount: answerResults.length
      }
    })

  } catch (error) {
    console.error('上傳創意測驗結果失敗:', error)
    console.error('錯誤詳情:', {
      message: error instanceof Error ? error.message : '未知錯誤',
      stack: error instanceof Error ? error.stack : undefined,
      body: body
    })
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

    // 獲取用戶的創意測驗結果
    const results = await getTestResultsByUserId(userId)
    const creativeResults = results.filter(r => r.test_type === 'creative')

    return NextResponse.json({
      success: true,
      data: creativeResults
    })

  } catch (error) {
    console.error('獲取創意測驗結果失敗:', error)
    return NextResponse.json(
      { success: false, error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
