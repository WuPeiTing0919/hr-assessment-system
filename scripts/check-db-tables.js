const mysql = require('mysql2/promise')

async function checkDatabaseTables() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔍 檢查資料庫表結構...')

  try {
    const connection = await mysql.createConnection(config)
    
    // 檢查所有表
    console.log('\n📋 所有資料表:')
    const [tables] = await connection.execute("SHOW TABLES")
    tables.forEach(table => {
      const tableName = Object.values(table)[0]
      console.log(`- ${tableName}`)
    })

    // 檢查 test_results 表結構
    console.log('\n📊 test_results 表結構:')
    try {
      const [columns] = await connection.execute("DESCRIBE test_results")
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`)
      })
    } catch (error) {
      console.log('❌ test_results 表不存在')
    }

    // 檢查 logic_test_answers 表結構
    console.log('\n📝 logic_test_answers 表結構:')
    try {
      const [columns] = await connection.execute("DESCRIBE logic_test_answers")
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`)
      })
    } catch (error) {
      console.log('❌ logic_test_answers 表不存在')
    }

    // 檢查 users 表結構
    console.log('\n👥 users 表結構:')
    try {
      const [columns] = await connection.execute("DESCRIBE users")
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`)
      })
    } catch (error) {
      console.log('❌ users 表不存在')
    }

    // 檢查 logic_questions 表結構
    console.log('\n🧠 logic_questions 表結構:')
    try {
      const [columns] = await connection.execute("DESCRIBE logic_questions")
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`)
      })
    } catch (error) {
      console.log('❌ logic_questions 表不存在')
    }

    await connection.end()
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkDatabaseTables()
