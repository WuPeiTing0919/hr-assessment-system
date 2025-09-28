import { executeQuery, executeQueryOne } from '../connection'

export interface LogicQuestion {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation?: string
  created_at: string
}

export interface CreateLogicQuestionData {
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation?: string
}

// 建立邏輯思維題目表（如果不存在）
export async function createLogicQuestionsTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logic_questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      option_a VARCHAR(500) NOT NULL,
      option_b VARCHAR(500) NOT NULL,
      option_c VARCHAR(500) NOT NULL,
      option_d VARCHAR(500) NOT NULL,
      option_e VARCHAR(500) NOT NULL,
      correct_answer ENUM('A', 'B', 'C', 'D', 'E') NOT NULL,
      explanation TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  
  await executeQuery(createTableQuery)
  console.log('✅ 邏輯思維題目表建立成功')
}

// 建立新題目
export async function createLogicQuestion(questionData: CreateLogicQuestionData): Promise<LogicQuestion | null> {
  const query = `
    INSERT INTO logic_questions (question, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
  
  const { question, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation } = questionData
  
  try {
    const result = await executeQuery(query, [
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      correct_answer,
      explanation || null
    ])
    
    // 獲取插入的 ID
    const insertId = (result as any).insertId
    return await findLogicQuestionById(insertId)
  } catch (error) {
    console.error('建立邏輯思維題目失敗:', error)
    return null
  }
}

// 根據 ID 查找題目
export async function findLogicQuestionById(id: number): Promise<LogicQuestion | null> {
  const query = 'SELECT * FROM logic_questions WHERE id = ?'
  return await executeQueryOne<LogicQuestion>(query, [id])
}

// 獲取所有題目
export async function getAllLogicQuestions(): Promise<LogicQuestion[]> {
  const query = 'SELECT * FROM logic_questions ORDER BY created_at'
  return await executeQuery<LogicQuestion>(query)
}

// 獲取隨機題目
export async function getRandomLogicQuestions(limit: number = 10): Promise<LogicQuestion[]> {
  const query = 'SELECT * FROM logic_questions ORDER BY RAND() LIMIT ?'
  return await executeQuery<LogicQuestion>(query, [limit])
}

// 清空所有題目
export async function clearLogicQuestions(): Promise<void> {
  await executeQuery('DELETE FROM logic_questions')
  console.log('✅ 已清空所有邏輯思維題目')
}

// 批量建立題目
export async function createMultipleLogicQuestions(questions: CreateLogicQuestionData[]): Promise<LogicQuestion[]> {
  const createdQuestions: LogicQuestion[] = []
  
  for (const questionData of questions) {
    const question = await createLogicQuestion(questionData)
    if (question) {
      createdQuestions.push(question)
    }
  }
  
  return createdQuestions
}
