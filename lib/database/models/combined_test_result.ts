import { executeQuery, executeQueryOne } from '../connection'
import { v4 as uuidv4 } from 'uuid'

export interface CombinedTestResult {
  id: string
  user_id: string
  logic_score: number
  creativity_score: number
  overall_score: number
  level: string
  description: string | null
  logic_breakdown: any | null // JSON 格式
  creativity_breakdown: any | null // JSON 格式
  balance_score: number
  completed_at: string
  created_at?: string
}

export interface CreateCombinedTestResultData {
  user_id: string
  logic_score: number
  creativity_score: number
  overall_score: number
  level: string
  description: string | null
  logic_breakdown: any | null
  creativity_breakdown: any | null
  balance_score: number
  completed_at: string
}

// 建立綜合測試結果表（如果不存在）
export async function createCombinedTestResultsTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS combined_test_results (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      logic_score INT NOT NULL,
      creativity_score INT NOT NULL,
      overall_score INT NOT NULL,
      level VARCHAR(50) NOT NULL,
      description TEXT NULL,
      logic_breakdown JSON NULL,
      creativity_breakdown JSON NULL,
      balance_score INT NOT NULL,
      completed_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_completed_at (completed_at)
    )
  `
  
  await executeQuery(createTableQuery)
  console.log('✅ 綜合測試結果表建立成功')
}

// 建立新的綜合測試結果
export async function createCombinedTestResult(resultData: CreateCombinedTestResultData): Promise<CombinedTestResult | null> {
  const id = `combined_${Date.now()}_${uuidv4().substring(0, 9)}`
  
  const insertQuery = `
    INSERT INTO combined_test_results (
      id, user_id, logic_score, creativity_score, overall_score, 
      level, description, logic_breakdown, creativity_breakdown, 
      balance_score, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  
  const values = [
    id,
    resultData.user_id,
    resultData.logic_score,
    resultData.creativity_score,
    resultData.overall_score,
    resultData.level,
    resultData.description,
    resultData.logic_breakdown ? JSON.stringify(resultData.logic_breakdown) : null,
    resultData.creativity_breakdown ? JSON.stringify(resultData.creativity_breakdown) : null,
    resultData.balance_score,
    resultData.completed_at
  ]
  
  try {
    await executeQuery(insertQuery, values)
    console.log('✅ 綜合測試結果建立成功，ID:', id)
    
    // 獲取剛建立的記錄
    return await getCombinedTestResultById(id)
  } catch (error) {
    console.error('建立綜合測試結果失敗:', error)
    throw error
  }
}

// 根據ID獲取綜合測試結果
export async function getCombinedTestResultById(id: string): Promise<CombinedTestResult | null> {
  try {
    const query = 'SELECT * FROM combined_test_results WHERE id = ?'
    const result = await executeQueryOne<CombinedTestResult>(query, [id])
    
    if (result) {
      // 解析 JSON 欄位
      if (result.logic_breakdown && typeof result.logic_breakdown === 'string') {
        result.logic_breakdown = JSON.parse(result.logic_breakdown)
      }
      if (result.creativity_breakdown && typeof result.creativity_breakdown === 'string') {
        result.creativity_breakdown = JSON.parse(result.creativity_breakdown)
      }
    }
    
    return result
  } catch (error) {
    console.error('獲取綜合測試結果失敗:', error)
    return null
  }
}

// 根據用戶ID獲取所有綜合測試結果
export async function getCombinedTestResultsByUserId(userId: string): Promise<CombinedTestResult[]> {
  try {
    const query = 'SELECT * FROM combined_test_results WHERE user_id = ? ORDER BY completed_at DESC'
    const results = await executeQuery<CombinedTestResult>(query, [userId])
    
    // 解析 JSON 欄位
    return results.map(result => {
      if (result.logic_breakdown && typeof result.logic_breakdown === 'string') {
        result.logic_breakdown = JSON.parse(result.logic_breakdown)
      }
      if (result.creativity_breakdown && typeof result.creativity_breakdown === 'string') {
        result.creativity_breakdown = JSON.parse(result.creativity_breakdown)
      }
      return result
    })
  } catch (error) {
    console.error('獲取用戶綜合測試結果失敗:', error)
    return []
  }
}

// 獲取所有綜合測試結果
export async function getAllCombinedTestResults(): Promise<CombinedTestResult[]> {
  try {
    const query = 'SELECT * FROM combined_test_results ORDER BY completed_at DESC'
    const results = await executeQuery<CombinedTestResult>(query)
    
    // 解析 JSON 欄位
    return results.map(result => {
      if (result.logic_breakdown && typeof result.logic_breakdown === 'string') {
        result.logic_breakdown = JSON.parse(result.logic_breakdown)
      }
      if (result.creativity_breakdown && typeof result.creativity_breakdown === 'string') {
        result.creativity_breakdown = JSON.parse(result.creativity_breakdown)
      }
      return result
    })
  } catch (error) {
    console.error('獲取所有綜合測試結果失敗:', error)
    return []
  }
}

// 清空所有綜合測試結果
export async function clearCombinedTestResults(): Promise<void> {
  await executeQuery('DELETE FROM combined_test_results')
  console.log('✅ 已清空所有綜合測試結果')
}
