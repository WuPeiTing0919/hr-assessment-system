const mysql = require('mysql2/promise')

async function fixLogicAnswersTable() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔧 修正 logic_test_answers 表結構...')

  try {
    const connection = await mysql.createConnection(config)
    
    // 檢查當前的 user_answer 欄位定義
    console.log('\n📊 檢查當前 user_answer 欄位定義:')
    const [columns] = await connection.execute("SHOW COLUMNS FROM logic_test_answers LIKE 'user_answer'")
    console.log('當前定義:', columns[0])

    // 更新 user_answer 欄位以支援 E 選項
    console.log('\n🔧 更新 user_answer 欄位以支援 E 選項...')
    await connection.execute("ALTER TABLE logic_test_answers MODIFY COLUMN user_answer ENUM('A', 'B', 'C', 'D', 'E') NOT NULL")
    
    console.log('✅ user_answer 欄位更新成功')

    // 驗證更新結果
    console.log('\n📊 驗證更新結果:')
    const [updatedColumns] = await connection.execute("SHOW COLUMNS FROM logic_test_answers LIKE 'user_answer'")
    console.log('更新後定義:', updatedColumns[0])

    await connection.end()
    console.log('\n✅ logic_test_answers 表修正完成')
  } catch (error) {
    console.error('❌ 修正失敗:', error.message)
  }
}

fixLogicAnswersTable()
