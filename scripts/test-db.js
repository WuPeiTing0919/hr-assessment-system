const mysql = require('mysql2/promise')

async function testDatabaseConnection() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔄 正在測試資料庫連接...')
  console.log('連接資訊:', {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database
  })

  try {
    const connection = await mysql.createConnection(config)
    await connection.ping()
    console.log('✅ 資料庫連接成功！')
    
    // 測試查詢
    const [rows] = await connection.execute('SELECT 1 as test')
    console.log('✅ 查詢測試成功:', rows)
    
    await connection.end()
  } catch (error) {
    console.error('❌ 資料庫連接失敗:', error.message)
    process.exit(1)
  }
}

testDatabaseConnection()
