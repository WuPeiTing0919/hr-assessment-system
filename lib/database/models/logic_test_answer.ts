import { executeQuery, executeQueryOne } from '../connection'

export interface LogicTestAnswer {
  id: string
  test_result_id: string
  question_id: number
  user_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  is_correct: boolean
  created_at?: string
}

export interface CreateLogicTestAnswerData {
  test_result_id: string
  question_id: number
  user_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  is_correct: boolean
}

// 建立邏輯測驗答案表（如果不存在）
export async function createLogicTestAnswersTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logic_test_answers (
      id VARCHAR(50) PRIMARY KEY,
      test_result_id VARCHAR(50) NOT NULL,
      question_id INT NOT NULL,
      user_answer ENUM('A', 'B', 'C', 'D', 'E') NOT NULL,
      is_correct TINYINT(1) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_test_result_id (test_result_id),
      INDEX idx_question_id (question_id),
      FOREIGN KEY (test_result_id) REFERENCES test_results(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES logic_questions(id) ON DELETE CASCADE
    )
  `
  
  await executeQuery(createTableQuery)
  console.log('✅ 邏輯測驗答案表建立成功')
}

// 建立新邏輯測驗答案
export async function createLogicTestAnswer(answerData: CreateLogicTestAnswerData): Promise<LogicTestAnswer | null> {
  try {
    const id = `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const insertQuery = `
      INSERT INTO logic_test_answers (
        id, test_result_id, question_id, user_answer, is_correct
      ) VALUES (?, ?, ?, ?, ?)
    `
    
    await executeQuery(insertQuery, [
      id,
      answerData.test_result_id,
      answerData.question_id,
      answerData.user_answer,
      answerData.is_correct ? 1 : 0
    ])
    
    return await getLogicTestAnswerById(id)
  } catch (error) {
    console.error('建立邏輯測驗答案失敗:', error)
    return null
  }
}

// 批量建立邏輯測驗答案
export async function createLogicTestAnswers(answersData: CreateLogicTestAnswerData[]): Promise<LogicTestAnswer[]> {
  try {
    const results: LogicTestAnswer[] = []
    
    for (const answerData of answersData) {
      const result = await createLogicTestAnswer(answerData)
      if (result) {
        results.push(result)
      }
    }
    
    return results
  } catch (error) {
    console.error('批量建立邏輯測驗答案失敗:', error)
    return []
  }
}

// 根據ID獲取邏輯測驗答案
export async function getLogicTestAnswerById(id: string): Promise<LogicTestAnswer | null> {
  try {
    const query = 'SELECT * FROM logic_test_answers WHERE id = ?'
    return await executeQueryOne<LogicTestAnswer>(query, [id])
  } catch (error) {
    console.error('獲取邏輯測驗答案失敗:', error)
    return null
  }
}

// 根據測試結果ID獲取所有答案
export async function getLogicTestAnswersByTestResultId(testResultId: string): Promise<LogicTestAnswer[]> {
  try {
    const query = 'SELECT * FROM logic_test_answers WHERE test_result_id = ? ORDER BY question_id'
    return await executeQuery<LogicTestAnswer>(query, [testResultId])
  } catch (error) {
    console.error('獲取測試結果答案失敗:', error)
    return []
  }
}

// 根據問題ID獲取所有答案
export async function getLogicTestAnswersByQuestionId(questionId: number): Promise<LogicTestAnswer[]> {
  try {
    const query = 'SELECT * FROM logic_test_answers WHERE question_id = ? ORDER BY created_at DESC'
    return await executeQuery<LogicTestAnswer>(query, [questionId])
  } catch (error) {
    console.error('獲取問題答案失敗:', error)
    return []
  }
}

// 刪除測試結果的所有答案
export async function deleteLogicTestAnswersByTestResultId(testResultId: string): Promise<boolean> {
  try {
    const query = 'DELETE FROM logic_test_answers WHERE test_result_id = ?'
    await executeQuery(query, [testResultId])
    return true
  } catch (error) {
    console.error('刪除測試結果答案失敗:', error)
    return false
  }
}

// 刪除邏輯測驗答案
export async function deleteLogicTestAnswer(id: string): Promise<boolean> {
  try {
    const query = 'DELETE FROM logic_test_answers WHERE id = ?'
    await executeQuery(query, [id])
    return true
  } catch (error) {
    console.error('刪除邏輯測驗答案失敗:', error)
    return false
  }
}
