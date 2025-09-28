import { NextRequest, NextResponse } from 'next/server'
import { getAllCreativeQuestions } from '@/lib/database/models/creative_question'
import { initializeDatabase } from '@/lib/database/init'

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase()
    const questions = await getAllCreativeQuestions()

    // 可以根據需求添加隨機排序或限制數量
    const { searchParams } = new URL(request.url)
    const random = searchParams.get('random') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : questions.length

    let filteredQuestions = questions

    if (random) {
      // 隨機排序
      filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5)
    }

    // 限制數量
    filteredQuestions = filteredQuestions.slice(0, limit)

    return NextResponse.json({ success: true, questions: filteredQuestions })
  } catch (error) {
    console.error('獲取創意能力測試題目失敗:', error)
    return NextResponse.json({ success: false, error: '無法獲取題目' }, { status: 500 })
  }
}
