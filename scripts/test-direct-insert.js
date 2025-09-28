const mysql = require('mysql2/promise')

async function testDirectInsert() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🧪 直接測試資料庫插入')
  console.log('=' .repeat(50))

  try {
    const connection = await mysql.createConnection(config)
    
    // 測試插入 test_results
    console.log('\n📊 測試插入 test_results...')
    const testResultId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const insertTestResultQuery = `
      INSERT INTO test_results (
        id, user_id, test_type, score, total_questions, 
        correct_answers, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    
    const testResultData = [
      testResultId,
      'test_user_123',
      'logic',
      80,
      10,
      8,
      new Date().toISOString()
    ]
    
    console.log('插入數據:', testResultData)
    
    await connection.execute(insertTestResultQuery, testResultData)
    console.log('✅ test_results 插入成功')
    
    // 測試插入 logic_test_answers
    console.log('\n📝 測試插入 logic_test_answers...')
    
    // 先獲取一個題目ID
    const [questions] = await connection.execute('SELECT id FROM logic_questions LIMIT 1')
    if (questions.length === 0) {
      console.log('❌ 沒有找到邏輯題目')
      return
    }
    
    const questionId = questions[0].id
    console.log('使用題目ID:', questionId)
    
    const answerId = `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const insertAnswerQuery = `
      INSERT INTO logic_test_answers (
        id, test_result_id, question_id, user_answer, is_correct
      ) VALUES (?, ?, ?, ?, ?)
    `
    
    const answerData = [
      answerId,
      testResultId,
      questionId,
      'A',
      1
    ]
    
    console.log('插入答案數據:', answerData)
    
    await connection.execute(insertAnswerQuery, answerData)
    console.log('✅ logic_test_answers 插入成功')
    
    // 驗證插入結果
    console.log('\n🔍 驗證插入結果...')
    const [testResults] = await connection.execute('SELECT * FROM test_results WHERE id = ?', [testResultId])
    console.log('test_results 記錄:', testResults[0])
    
    const [answers] = await connection.execute('SELECT * FROM logic_test_answers WHERE id = ?', [answerId])
    console.log('logic_test_answers 記錄:', answers[0])
    
    // 清理測試數據
    console.log('\n🧹 清理測試數據...')
    await connection.execute('DELETE FROM logic_test_answers WHERE id = ?', [answerId])
    await connection.execute('DELETE FROM test_results WHERE id = ?', [testResultId])
    console.log('✅ 測試數據已清理')
    
    await connection.end()
    console.log('\n✅ 直接插入測試成功')
    
  } catch (error) {
    console.error('❌ 插入測試失敗:', error.message)
    console.error('錯誤詳情:', error)
  }
}

testDirectInsert()
