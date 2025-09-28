const mysql = require('mysql2/promise')

async function checkTableStructure() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔄 正在檢查資料庫表結構...')

  try {
    const connection = await mysql.createConnection(config)
    
    // 檢查 logic_questions 表是否存在
    const [tables] = await connection.execute("SHOW TABLES LIKE 'logic_questions'")
    
    if (tables.length === 0) {
      console.log('❌ logic_questions 表不存在')
    } else {
      console.log('✅ logic_questions 表存在')
      
      // 檢查表結構
      const [columns] = await connection.execute("DESCRIBE logic_questions")
      console.log('\n📋 logic_questions 表結構:')
      columns.forEach(col => {
        console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? col.Key : ''}`)
      })
    }
    
    await connection.end()
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkTableStructure()
