import { executeQuery, executeQueryOne } from '../connection'

export interface TestResult {
  id: string
  user_id: string
  test_type: 'logic' | 'creative' | 'combined'
  score: number
  total_questions: number
  correct_answers: number
  completed_at: string
  created_at?: string
}

export interface CreateTestResultData {
  user_id: string
  test_type: 'logic' | 'creative' | 'combined'
  score: number
  total_questions: number
  correct_answers: number
  completed_at: string
}

// 建立測試結果表（如果不存在）
export async function createTestResultsTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS test_results (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      test_type ENUM('logic', 'creative', 'combined') NOT NULL,
      score INT NOT NULL,
      total_questions INT NOT NULL,
      correct_answers INT NOT NULL,
      completed_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_test_type (test_type),
      INDEX idx_completed_at (completed_at)
    )
  `
  
  await executeQuery(createTableQuery)
  console.log('✅ 測試結果表建立成功')
}

// 建立新測試結果
export async function createTestResult(resultData: CreateTestResultData): Promise<TestResult | null> {
  try {
    const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const insertQuery = `
      INSERT INTO test_results (
        id, user_id, test_type, score, total_questions, 
        correct_answers, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    
    await executeQuery(insertQuery, [
      id,
      resultData.user_id,
      resultData.test_type,
      resultData.score,
      resultData.total_questions,
      resultData.correct_answers,
      resultData.completed_at
    ])
    
    const result = await getTestResultById(id)
    console.log('建立的測試結果:', result)
    return result
  } catch (error) {
    console.error('建立測試結果失敗:', error)
    return null
  }
}

// 根據ID獲取測試結果
export async function getTestResultById(id: string): Promise<TestResult | null> {
  try {
    const query = 'SELECT * FROM test_results WHERE id = ?'
    return await executeQueryOne<TestResult>(query, [id])
  } catch (error) {
    console.error('獲取測試結果失敗:', error)
    return null
  }
}

// 根據用戶ID獲取測試結果
export async function getTestResultsByUserId(userId: string): Promise<TestResult[]> {
  try {
    const query = 'SELECT * FROM test_results WHERE user_id = ? ORDER BY completed_at DESC'
    return await executeQuery<TestResult>(query, [userId])
  } catch (error) {
    console.error('獲取用戶測試結果失敗:', error)
    return []
  }
}

// 根據測試類型獲取測試結果
export async function getTestResultsByType(testType: 'logic' | 'creative' | 'combined'): Promise<TestResult[]> {
  try {
    const query = 'SELECT * FROM test_results WHERE test_type = ? ORDER BY completed_at DESC'
    return await executeQuery<TestResult>(query, [testType])
  } catch (error) {
    console.error('獲取測試結果失敗:', error)
    return []
  }
}

// 獲取所有測試結果
export async function getAllTestResults(): Promise<TestResult[]> {
  try {
    const query = 'SELECT * FROM test_results ORDER BY completed_at DESC'
    return await executeQuery<TestResult>(query)
  } catch (error) {
    console.error('獲取所有測試結果失敗:', error)
    return []
  }
}

// 刪除測試結果
export async function deleteTestResult(id: string): Promise<boolean> {
  try {
    const query = 'DELETE FROM test_results WHERE id = ?'
    await executeQuery(query, [id])
    return true
  } catch (error) {
    console.error('刪除測試結果失敗:', error)
    return false
  }
}
