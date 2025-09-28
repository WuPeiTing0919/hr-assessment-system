const mysql = require('mysql2/promise')

async function checkUserExists() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('👤 檢查用戶是否存在')
  console.log('=' .repeat(50))

  try {
    const connection = await mysql.createConnection(config)
    
    const userId = 'user-1759073326705-m06y3wacd'
    console.log('檢查用戶ID:', userId)
    
    // 檢查用戶是否存在
    const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId])
    
    if (users.length > 0) {
      console.log('✅ 用戶存在:')
      console.log('ID:', users[0].id)
      console.log('姓名:', users[0].name)
      console.log('郵箱:', users[0].email)
      console.log('部門:', users[0].department)
      console.log('角色:', users[0].role)
    } else {
      console.log('❌ 用戶不存在')
      
      // 列出所有用戶
      console.log('\n📋 所有用戶列表:')
      const [allUsers] = await connection.execute('SELECT id, name, email FROM users LIMIT 10')
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}, 姓名: ${user.name}, 郵箱: ${user.email}`)
      })
    }
    
    await connection.end()
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkUserExists()
