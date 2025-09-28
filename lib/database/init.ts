import { testConnection } from './connection'
import { createUsersTable } from './models/user'
import { createLogicQuestionsTable } from './models/logic_question'
import { createCreativeQuestionsTable } from './models/creative_question'
import { createTestResultsTable } from './models/test_result'
import { createLogicTestAnswersTable } from './models/logic_test_answer'

// 初始化資料庫
export async function initializeDatabase(): Promise<boolean> {
  try {
    console.log('🔄 正在初始化資料庫...')
    
    // 測試連接
    const isConnected = await testConnection()
    if (!isConnected) {
      console.error('❌ 無法連接到資料庫')
      return false
    }
    
    // 建立用戶表
    await createUsersTable()

    // 建立邏輯思維題目表
    await createLogicQuestionsTable()

    // 建立創意能力測試題目表
    await createCreativeQuestionsTable()

    // 建立測試結果表
    await createTestResultsTable()

    // 建立邏輯測驗答案表
    await createLogicTestAnswersTable()

    console.log('✅ 資料庫初始化完成')
    return true
  } catch (error) {
    console.error('❌ 資料庫初始化失敗:', error)
    return false
  }
}

// 在應用程式啟動時自動初始化
if (typeof window === 'undefined') {
  // 只在伺服器端執行
  initializeDatabase().catch(console.error)
}
