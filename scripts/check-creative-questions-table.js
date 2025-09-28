const mysql = require('mysql2/promise')

async function checkCreativeQuestionsTable() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔍 檢查 creative_questions 表結構...')

  let connection
  try {
    connection = await mysql.createConnection(config)

    // 檢查表結構
    const [columns] = await connection.execute("DESCRIBE creative_questions")
    console.log('\n📊 creative_questions 表結構:')
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`)
    })

    // 檢查表內容
    const [rows] = await connection.execute("SELECT * FROM creative_questions LIMIT 3")
    console.log('\n📝 creative_questions 表內容 (前3筆):')
    if (rows.length > 0) {
      rows.forEach((row, index) => {
        console.log(`${index + 1}. ID: ${row.id}`)
        console.log(`   題目: ${row.statement}`)
        console.log(`   類別: ${row.category}`)
        console.log(`   是否反向: ${row.is_reverse}`)
        console.log('')
      })
    } else {
      console.log('❌ 沒有找到創意題目數據')
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

checkCreativeQuestionsTable()
