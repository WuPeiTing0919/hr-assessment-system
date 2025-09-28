const fetch = require('node-fetch')

async function testLogin() {
  console.log('🔄 正在測試登入功能...')
  
  const testUsers = [
    { email: 'admin@company.com', password: 'admin123' },
    { email: 'user@company.com', password: 'user123' },
    { email: 'manager@company.com', password: 'manager123' },
    { email: 'test@company.com', password: 'test123' }
  ]
  
  for (const user of testUsers) {
    try {
      console.log(`\n測試用戶: ${user.email}`)
      
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ 登入成功: ${data.user.name}`)
        console.log(`   Role: ${data.user.role}`)
        console.log(`   Token: ${data.accessToken ? '已生成' : '未生成'}`)
      } else {
        console.log(`❌ 登入失敗: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ 請求失敗: ${error.message}`)
    }
  }
}

// 如果直接執行此檔案，則執行測試
if (require.main === module) {
  testLogin().catch(console.error)
}
