import { NextRequest, NextResponse } from 'next/server'
import { createTestResult, getTestResultsByUserId } from '@/lib/database/models/test_result'
import { createLogicTestAnswers } from '@/lib/database/models/logic_test_answer'
import { getAllLogicQuestions } from '@/lib/database/models/logic_question'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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

    // 獲取邏輯題目
    const questions = await getAllLogicQuestions()
    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: '無法獲取題目' },
        { status: 500 }
      )
    }

    // 計算分數
    let correctAnswers = 0
    const answerRecords = []

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const userAnswer = answers[i] || ''
      const isCorrect = userAnswer === question.correct_answer
      
      if (isCorrect) {
        correctAnswers++
      }

      answerRecords.push({
        test_result_id: '', // 稍後填入
        question_id: question.id,
        user_answer: userAnswer as 'A' | 'B' | 'C' | 'D' | 'E',
        is_correct: isCorrect
      })
    }

    const score = Math.round((correctAnswers / questions.length) * 100)

    // 建立測試結果
    console.log('🔄 開始建立測試結果...')
    console.log('測試結果數據:', {
      user_id: userId,
      test_type: 'logic',
      score: score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      completed_at: completedAt
    })

    // 統一使用台灣時間格式
    // 將 UTC 時間轉換為台灣時間，然後轉換為 MySQL 格式
    const utcDate = new Date(completedAt)
    const taiwanTime = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000)) // UTC + 8 小時
    const mysqlCompletedAt = taiwanTime.toISOString().replace('Z', '').replace('T', ' ')

    const testResult = await createTestResult({
      user_id: userId,
      test_type: 'logic',
      score: score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      completed_at: mysqlCompletedAt
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
    const answerResults = await createLogicTestAnswers(answerRecords)

    return NextResponse.json({
      success: true,
      data: {
        testResult,
        answerCount: answerResults.length
      }
    })

  } catch (error) {
    console.error('上傳邏輯測驗結果失敗:', error)
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

    // 獲取用戶的邏輯測驗結果
    const results = await getTestResultsByUserId(userId)
    const logicResults = results.filter(result => result.test_type === 'logic')

    return NextResponse.json({
      success: true,
      data: logicResults
    })

  } catch (error) {
    console.error('獲取邏輯測驗結果失敗:', error)
    return NextResponse.json(
      { success: false, error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}
