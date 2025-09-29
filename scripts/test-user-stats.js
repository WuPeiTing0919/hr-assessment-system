const https = require('https')
const http = require('http')

const testUserStats = async () => {
  console.log('🔍 測試用戶管理統計功能')
  console.log('=' .repeat(50))

  try {
    // 獲取用戶列表
    console.log('\n📊 獲取用戶列表...')
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/users', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (response.status === 200) {
      const data = JSON.parse(response.data)
      if (data.success) {
        const users = data.data
        
        // 計算統計數據
        const totalUsers = users.length
        const adminUsers = users.filter(user => user.role === 'admin').length
        const regularUsers = users.filter(user => user.role === 'user').length
        
        console.log('✅ 用戶統計數據:')
        console.log(`   總用戶數: ${totalUsers}`)
        console.log(`   管理員: ${adminUsers}`)
        console.log(`   一般用戶: ${regularUsers}`)
        
        // 顯示用戶詳細資訊
        console.log('\n📋 用戶詳細列表:')
        users.forEach((user, index) => {
          console.log(`\n${index + 1}. ${user.name}:`)
          console.log(`   ID: ${user.id}`)
          console.log(`   電子郵件: ${user.email}`)
          console.log(`   部門: ${user.department}`)
          console.log(`   角色: ${user.role}`)
          console.log(`   建立時間: ${user.created_at}`)
          console.log(`   更新時間: ${user.updated_at}`)
        })
        
        // 驗證統計數據
        const isStatsCorrect = totalUsers === (adminUsers + regularUsers)
        console.log(`\n統計數據是否正確: ${isStatsCorrect ? '✅' : '❌'}`)
        
        // 檢查部門分布
        console.log('\n📊 部門分布:')
        const departmentStats = {}
        users.forEach(user => {
          departmentStats[user.department] = (departmentStats[user.department] || 0) + 1
        })
        
        Object.entries(departmentStats).forEach(([dept, count]) => {
          console.log(`   ${dept}: ${count} 人`)
        })
        
      } else {
        console.log('❌ 獲取用戶列表失敗:', data.error)
      }
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 用戶管理統計功能測試完成')
  }
}

testUserStats()
