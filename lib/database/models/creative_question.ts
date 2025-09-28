import { executeQuery, executeQueryOne } from '../connection'

export interface CreativeQuestion {
  id: number
  statement: string
  category: 'innovation' | 'imagination' | 'flexibility' | 'originality'
  is_reverse: boolean
  created_at: string
}

export interface CreateCreativeQuestionData {
  statement: string
  category: 'innovation' | 'imagination' | 'flexibility' | 'originality'
  is_reverse: boolean
}

// 建立創意能力測試題目表（如果不存在）
export async function createCreativeQuestionsTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS creative_questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      statement TEXT NOT NULL,
      category ENUM('innovation', 'imagination', 'flexibility', 'originality') NOT NULL,
      is_reverse BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  
  await executeQuery(createTableQuery)
  console.log('✅ 創意能力測試題目表建立成功')
}

// 建立新題目
export async function createCreativeQuestion(questionData: CreateCreativeQuestionData): Promise<CreativeQuestion | null> {
  const query = `
    INSERT INTO creative_questions (statement, category, is_reverse)
    VALUES (?, ?, ?)
  `
  
  const { statement, category, is_reverse } = questionData
  
  try {
    const result = await executeQuery(query, [statement, category, is_reverse])
    
    // 獲取插入的 ID
    const insertId = (result as any).insertId
    return await findCreativeQuestionById(insertId)
  } catch (error) {
    console.error('建立創意能力測試題目失敗:', error)
    return null
  }
}

// 根據 ID 查找題目
export async function findCreativeQuestionById(id: number): Promise<CreativeQuestion | null> {
  const query = 'SELECT * FROM creative_questions WHERE id = ?'
  return await executeQueryOne<CreativeQuestion>(query, [id])
}

// 獲取所有題目
export async function getAllCreativeQuestions(): Promise<CreativeQuestion[]> {
  const query = 'SELECT * FROM creative_questions ORDER BY created_at'
  return await executeQuery<CreativeQuestion>(query)
}

// 清空所有題目
export async function clearCreativeQuestions(): Promise<void> {
  await executeQuery('DELETE FROM creative_questions')
  console.log('✅ 已清空所有創意能力測試題目')
}

// 建立多個題目
export async function createMultipleCreativeQuestions(questionsData: CreateCreativeQuestionData[]): Promise<CreativeQuestion[]> {
  const createdQuestions: CreativeQuestion[] = []
  for (const questionData of questionsData) {
    const createdQuestion = await createCreativeQuestion(questionData)
    if (createdQuestion) {
      createdQuestions.push(createdQuestion)
    }
  }
  return createdQuestions
}
