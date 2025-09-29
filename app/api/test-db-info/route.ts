import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database/connection"

export async function GET(request: NextRequest) {
  try {
    // 獲取資料庫信息
    const dbInfo = await executeQuery('SELECT DATABASE() as current_db, USER() as current_user, VERSION() as version')
    
    // 檢查所有表
    const tables = await executeQuery('SHOW TABLES')
    
    // 檢查 logic_test_answers 表
    let logicAnswersCount = 0
    let logicAnswersSample = []
    
    try {
      const countResult = await executeQuery('SELECT COUNT(*) as count FROM logic_test_answers')
      logicAnswersCount = countResult[0].count
      
      if (logicAnswersCount > 0) {
        logicAnswersSample = await executeQuery('SELECT * FROM logic_test_answers LIMIT 3')
      }
    } catch (error) {
      console.error('查詢 logic_test_answers 失敗:', error)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        database: dbInfo[0],
        tables: tables.map(t => Object.values(t)[0]),
        logicTestAnswers: {
          count: logicAnswersCount,
          sample: logicAnswersSample
        }
      }
    })
    
  } catch (error) {
    console.error('獲取資料庫信息失敗:', error)
    return NextResponse.json(
      { success: false, message: "獲取資料庫信息失敗", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
