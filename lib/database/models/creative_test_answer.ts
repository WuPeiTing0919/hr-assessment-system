import { executeQuery } from '../connection'
import { v4 as uuidv4 } from 'uuid'

export interface CreativeTestAnswer {
  id: string
  test_result_id: string
  question_id: number
  user_answer: number // 1-5 Likert scale
  score: number // 計算後的分數（考慮反向題）
  created_at?: string
}

export interface CreateCreativeTestAnswerData {
  test_result_id: string
  question_id: number
  user_answer: number
  score: number
}

// 建立創意測驗答案表（如果不存在）
export async function createCreativeTestAnswersTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS creative_test_answers (
      id VARCHAR(50) PRIMARY KEY,
      test_result_id VARCHAR(50) NOT NULL,
      question_id INT NOT NULL,
      user_answer TINYINT NOT NULL,
      score INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_test_result_id (test_result_id),
      INDEX idx_question_id (question_id),
      FOREIGN KEY (test_result_id) REFERENCES test_results(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES creative_questions(id) ON DELETE CASCADE
    )
  `
  
  await executeQuery(createTableQuery)
  console.log('✅ 創意測驗答案表建立成功')
}

// 批量建立創意測驗答案
export async function createCreativeTestAnswers(answers: CreateCreativeTestAnswerData[]): Promise<CreativeTestAnswer[]> {
  if (answers.length === 0) {
    return []
  }

  const placeholders = answers.map(() => '(?, ?, ?, ?, ?)').join(', ')
  const values: any[] = []

  answers.forEach(answer => {
    values.push(
      `answer_${Date.now()}_${uuidv4().substring(0, 9)}`, // Generate unique ID for each answer
      answer.test_result_id,
      answer.question_id,
      answer.user_answer,
      answer.score
    )
  })

  const insertQuery = `
    INSERT INTO creative_test_answers (id, test_result_id, question_id, user_answer, score)
    VALUES ${placeholders}
  `

  try {
    await executeQuery(insertQuery, values)
    // For simplicity, we're not fetching each inserted answer.
    // In a real app, you might fetch them or return a success status.
    return answers.map(ans => ({ ...ans, id: `answer_${Date.now()}_${uuidv4().substring(0, 9)}` })) // Dummy IDs for return
  } catch (error) {
    console.error('建立創意測驗答案失敗:', error)
    throw error
  }
}

// 根據測試結果ID獲取所有答案
export async function getCreativeTestAnswersByTestResultId(testResultId: string): Promise<CreativeTestAnswer[]> {
  try {
    const query = 'SELECT * FROM creative_test_answers WHERE test_result_id = ? ORDER BY created_at ASC'
    return await executeQuery<CreativeTestAnswer>(query, [testResultId])
  } catch (error) {
    console.error('獲取創意測驗答案失敗:', error)
    return []
  }
}

// 清空所有創意測驗答案
export async function clearCreativeTestAnswers(): Promise<void> {
  await executeQuery('DELETE FROM creative_test_answers')
  console.log('✅ 已清空所有創意測驗答案')
}
