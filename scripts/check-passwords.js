const mysql = require('mysql2/promise')

async function checkPasswords() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔄 正在檢查用戶密碼狀態...')

  try {
    const connection = await mysql.createConnection(config)
    
    const [rows] = await connection.execute('SELECT id, name, email, password FROM users ORDER BY created_at')
    
    console.log('\n📋 用戶密碼狀態:')
    console.log('=' .repeat(80))
    
    rows.forEach((user, index) => {
      const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$')
      const passwordStatus = isHashed ? '✅ 已雜湊' : '❌ 明文'
      const passwordPreview = isHashed ? user.password.substring(0, 20) + '...' : user.password
      
      console.log(`${index + 1}. ${user.name} (${user.email})`)
      console.log(`   密碼狀態: ${passwordStatus}`)
      console.log(`   密碼內容: ${passwordPreview}`)
      console.log('')
    })
    
    await connection.end()
    console.log('✅ 檢查完成')
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkPasswords()
