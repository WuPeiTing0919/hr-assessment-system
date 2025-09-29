const https = require('https')
const http = require('http')

const checkUserPassword = async () => {
  console.log('🔍 檢查用戶密碼格式')
  console.log('=' .repeat(50))

  const testUserId = 'user-1759073326705-m06y3wacd'

  try {
    // 檢查用戶資料
    console.log('\n📊 檢查用戶資料...')
    const response = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/user/profile?userId=${testUserId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (response.status === 200) {
      const data = JSON.parse(response.data)
      if (data.success) {
        console.log('✅ 用戶資料:')
        console.log(`   ID: ${data.data.id}`)
        console.log(`   姓名: ${data.data.name}`)
        console.log(`   電子郵件: ${data.data.email}`)
        console.log(`   部門: ${data.data.department}`)
        console.log(`   角色: ${data.data.role}`)
        console.log(`   密碼: ${data.data.password ? '已隱藏' : '未返回'}`)
      }
    }

    // 測試不同的密碼
    console.log('\n📊 測試密碼更新...')
    const testPasswords = ['password123', 'test123', '123456', 'admin123']
    
    for (const password of testPasswords) {
      console.log(`\n測試密碼: ${password}`)
      
      const updateData = {
        userId: testUserId,
        currentPassword: password,
        newPassword: 'newpassword123'
      }

      const updateResponse = await new Promise((resolve, reject) => {
        const postData = JSON.stringify(updateData)
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/user/profile',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }

        const req = http.request(options, (res) => {
          let data = ''
          res.on('data', chunk => data += chunk)
          res.on('end', () => resolve({ status: res.statusCode, data }))
        })
        req.on('error', reject)
        req.write(postData)
        req.end()
      })

      if (updateResponse.status === 200) {
        const updateResult = JSON.parse(updateResponse.data)
        if (updateResult.success) {
          console.log(`✅ 密碼 ${password} 正確，更新成功`)
          break
        } else {
          console.log(`❌ 密碼 ${password} 錯誤: ${updateResult.error}`)
        }
      } else {
        console.log(`❌ API 請求失敗: ${updateResponse.status}`)
      }
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 用戶密碼檢查完成')
  }
}

checkUserPassword()
