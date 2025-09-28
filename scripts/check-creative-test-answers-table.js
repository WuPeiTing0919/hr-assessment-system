const mysql = require('mysql2/promise')

async function checkCreativeTestAnswersTable() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔍 檢查 creative_test_answers 表結構...')

  let connection
  try {
    connection = await mysql.createConnection(config)

    // 檢查表是否存在
    const [tables] = await connection.execute("SHOW TABLES LIKE 'creative_test_answers'")
    if (tables.length === 0) {
      console.log('❌ creative_test_answers 表不存在')
      return
    }

    // 檢查表結構
    const [columns] = await connection.execute("DESCRIBE creative_test_answers")
    console.log('\n📊 creative_test_answers 表結構:')
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`)
    })

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

checkCreativeTestAnswersTable()
