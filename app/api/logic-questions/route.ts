import { NextRequest, NextResponse } from 'next/server'
import { getAllLogicQuestions, getRandomLogicQuestions } from '@/lib/database/models/logic_question'
import { initializeDatabase } from '@/lib/database/init'

export async function GET(request: NextRequest) {
  try {
    // 確保資料庫已初始化
    await initializeDatabase()
    
    const { searchParams } = new URL(request.url)
    const random = searchParams.get('random')
    const limit = searchParams.get('limit')
    
    let questions
    
    if (random === 'true') {
      const questionLimit = limit ? parseInt(limit) : 10
      questions = await getRandomLogicQuestions(questionLimit)
    } else {
      questions = await getAllLogicQuestions()
    }
    
    return NextResponse.json({
      success: true,
      questions,
      count: questions.length
    })
  } catch (error) {
    console.error('獲取邏輯思維題目錯誤:', error)
    return NextResponse.json(
      { error: '獲取題目失敗，請稍後再試' },
      { status: 500 }
    )
  }
}
