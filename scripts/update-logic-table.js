const mysql = require('mysql2/promise')

async function updateLogicTable() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔄 正在更新 logic_questions 表結構...')

  try {
    const connection = await mysql.createConnection(config)
    
    // 檢查是否已有 option_e 欄位
    const [columns] = await connection.execute("SHOW COLUMNS FROM logic_questions LIKE 'option_e'")
    
    if (columns.length === 0) {
      console.log('📝 加入 option_e 欄位...')
      await connection.execute("ALTER TABLE logic_questions ADD COLUMN option_e VARCHAR(500) NOT NULL DEFAULT '' AFTER option_d")
      
      console.log('📝 更新 correct_answer 欄位以支援 E 選項...')
      await connection.execute("ALTER TABLE logic_questions MODIFY COLUMN correct_answer ENUM('A', 'B', 'C', 'D', 'E') NOT NULL")
      
      console.log('✅ 表結構更新完成')
    } else {
      console.log('✅ option_e 欄位已存在')
    }
    
    await connection.end()
  } catch (error) {
    console.error('❌ 更新失敗:', error.message)
  }
}

updateLogicTable()
