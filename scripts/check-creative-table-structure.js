const mysql = require('mysql2/promise')

async function checkCreativeTableStructure() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔄 正在檢查 creative_questions 表結構...')

  try {
    const connection = await mysql.createConnection(config)
    
    // 檢查表是否存在
    const [tables] = await connection.execute("SHOW TABLES LIKE 'creative_questions'")
    
    if (tables.length === 0) {
      console.log('❌ creative_questions 表不存在')
    } else {
      console.log('✅ creative_questions 表存在')
      
      // 檢查表結構
      const [columns] = await connection.execute("DESCRIBE creative_questions")
      
      console.log('\n📋 表結構:')
      columns.forEach(col => {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''} ${col.Default ? `DEFAULT ${col.Default}` : ''}`)
      })
    }
    
    await connection.end()
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkCreativeTableStructure()
