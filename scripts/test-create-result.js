const mysql = require('mysql2/promise')

async function testCreateResult() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🧪 測試 createTestResult 函數')
  console.log('=' .repeat(50))

  try {
    const connection = await mysql.createConnection(config)
    
    // 模擬 createTestResult 函數的邏輯
    const testResultData = {
      user_id: 'user-1759073326705-m06y3wacd',
      test_type: 'logic',
      score: 80,
      total_questions: 10,
      correct_answers: 8,
      completed_at: new Date().toISOString()
    }

    console.log('測試數據:', testResultData)

    const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('生成的ID:', id)

    const insertQuery = `
      INSERT INTO test_results (
        id, user_id, test_type, score, total_questions, 
        correct_answers, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    
    const insertData = [
      id,
      testResultData.user_id,
      testResultData.test_type,
      testResultData.score,
      testResultData.total_questions,
      testResultData.correct_answers,
      testResultData.completed_at
    ]

    console.log('插入數據:', insertData)

    await connection.execute(insertQuery, insertData)
    console.log('✅ 插入成功')

    // 驗證插入結果
    const [results] = await connection.execute('SELECT * FROM test_results WHERE id = ?', [id])
    console.log('插入結果:', results[0])

    // 清理測試數據
    await connection.execute('DELETE FROM test_results WHERE id = ?', [id])
    console.log('✅ 測試數據已清理')

    await connection.end()
    console.log('\n✅ createTestResult 測試成功')
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
    console.error('錯誤詳情:', error)
  }
}

testCreateResult()
