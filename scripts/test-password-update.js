const https = require('https')
const http = require('http')

const testPasswordUpdate = async () => {
  console.log('🔍 測試密碼更新功能')
  console.log('=' .repeat(50))

  const testUserId = 'user-1759073326705-m06y3wacd'
  const testPassword = 'newpassword123'

  try {
    // 1. 測試密碼更新
    console.log('\n📊 1. 測試密碼更新...')
    const updateData = {
      userId: testUserId,
      currentPassword: 'password123', // 假設當前密碼
      newPassword: testPassword
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
        console.log('✅ 密碼更新成功')
      } else {
        console.log('❌ 密碼更新失敗:', updateResult.error)
      }
    } else {
      console.log('❌ API 請求失敗:', updateResponse.status)
    }

    // 2. 測試錯誤的當前密碼
    console.log('\n📊 2. 測試錯誤的當前密碼...')
    const wrongPasswordData = {
      userId: testUserId,
      currentPassword: 'wrongpassword',
      newPassword: 'anotherpassword123'
    }

    const wrongResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(wrongPasswordData)
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

    if (wrongResponse.status === 200) {
      const wrongResult = JSON.parse(wrongResponse.data)
      if (!wrongResult.success) {
        console.log('✅ 錯誤密碼驗證成功:', wrongResult.error)
      } else {
        console.log('❌ 錯誤密碼驗證失敗，應該被拒絕')
      }
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 密碼更新功能測試完成')
  }
}

testPasswordUpdate()
