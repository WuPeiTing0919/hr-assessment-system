const mysql = require('mysql2/promise')

async function testSimpleInsert() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🧪 簡單插入測試')
  console.log('=' .repeat(50))

  try {
    const connection = await mysql.createConnection(config)
    
    const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('生成的ID:', id)

    // 直接插入
    const insertQuery = `
      INSERT INTO test_results (
        id, user_id, test_type, score, total_questions, 
        correct_answers, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    
    const insertData = [
      id,
      'user-1759073326705-m06y3wacd',
      'logic',
      80,
      10,
      8,
      new Date().toISOString()
    ]

    console.log('插入數據:', insertData)

    const [result] = await connection.execute(insertQuery, insertData)
    console.log('插入結果:', result)

    // 查詢插入的數據
    const [rows] = await connection.execute('SELECT * FROM test_results WHERE id = ?', [id])
    console.log('查詢結果:', rows[0])

    // 清理
    await connection.execute('DELETE FROM test_results WHERE id = ?', [id])
    console.log('✅ 清理完成')

    await connection.end()
    console.log('✅ 測試成功')
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
    console.error('錯誤詳情:', error)
  }
}

testSimpleInsert()
