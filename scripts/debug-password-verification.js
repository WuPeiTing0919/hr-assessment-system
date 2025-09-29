const https = require('https')
const http = require('http')

const debugPasswordVerification = async () => {
  console.log('🔍 調試密碼驗證問題')
  console.log('=' .repeat(50))

  try {
    // 1. 創建一個測試用戶
    console.log('\n📊 1. 創建測試用戶...')
    const testUser = {
      name: '密碼調試用戶',
      email: 'debug.password@company.com',
      password: 'password123',
      department: '測試部',
      role: 'user'
    }

    const createResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(testUser)
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/users',
        method: 'POST',
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

    let testUserId = null
    if (createResponse.status === 200) {
      const createData = JSON.parse(createResponse.data)
      if (createData.success) {
        testUserId = createData.data.id
        console.log('✅ 測試用戶創建成功')
      } else {
        console.log('❌ 創建測試用戶失敗:', createData.error)
        return
      }
    }

    // 2. 直接查詢資料庫中的密碼雜湊
    console.log('\n📊 2. 檢查資料庫中的密碼雜湊...')
    
    // 這裡我們需要直接查詢資料庫來看看密碼是如何儲存的
    // 由於我們無法直接訪問資料庫，我們可以通過 API 來檢查
    
    // 3. 測試不同的密碼組合
    console.log('\n📊 3. 測試不同的密碼組合...')
    
    const testPasswords = [
      'password123',  // 原始密碼
      'Password123',  // 大寫開頭
      'PASSWORD123',  // 全大寫
      'password',     // 沒有數字
      '123456',       // 只有數字
    ]

    for (const testPassword of testPasswords) {
      console.log(`\n   測試密碼: "${testPassword}"`)
      
      const loginData = {
        email: 'debug.password@company.com',
        password: testPassword
      }

      const loginResponse = await new Promise((resolve, reject) => {
        const postData = JSON.stringify(loginData)
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/auth/login',
          method: 'POST',
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

      if (loginResponse.status === 200) {
        const loginResult = JSON.parse(loginResponse.data)
        if (loginResult.success) {
          console.log(`   ✅ 登入成功！正確密碼是: "${testPassword}"`)
          break
        } else {
          console.log(`   ❌ 登入失敗: ${loginResult.error}`)
        }
      } else {
        const errorData = JSON.parse(loginResponse.data)
        console.log(`   ❌ 登入失敗: ${errorData.error}`)
      }
    }

    // 4. 檢查現有用戶的登入情況
    console.log('\n📊 4. 檢查現有用戶的登入情況...')
    
    const existingUsers = [
      { email: 'admin@company.com', password: 'admin123' },
      { email: 'user@company.com', password: 'user123' },
      { email: 'test@company.com', password: 'password123' }
    ]

    for (const user of existingUsers) {
      console.log(`\n   測試現有用戶: ${user.email}`)
      
      const loginData = {
        email: user.email,
        password: user.password
      }

      const loginResponse = await new Promise((resolve, reject) => {
        const postData = JSON.stringify(loginData)
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/auth/login',
          method: 'POST',
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

      if (loginResponse.status === 200) {
        const loginResult = JSON.parse(loginResponse.data)
        if (loginResult.success) {
          console.log(`   ✅ 登入成功`)
        } else {
          console.log(`   ❌ 登入失敗: ${loginResult.error}`)
        }
      } else {
        const errorData = JSON.parse(loginResponse.data)
        console.log(`   ❌ 登入失敗: ${errorData.error}`)
      }
    }

    // 5. 清理測試用戶
    console.log('\n📊 5. 清理測試用戶...')
    if (testUserId) {
      const deleteResponse = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/admin/users?id=${testUserId}`,
          method: 'DELETE'
        }

        const req = http.request(options, (res) => {
          let data = ''
          res.on('data', chunk => data += chunk)
          res.on('end', () => resolve({ status: res.statusCode, data }))
        })
        req.on('error', reject)
        req.end()
      })

      if (deleteResponse.status === 200) {
        console.log(`✅ 已刪除測試用戶: ${testUserId}`)
      }
    }

    console.log('\n📝 調試總結:')
    console.log('🔍 請檢查以上測試結果，找出密碼驗證問題的原因')

  } catch (error) {
    console.error('❌ 調試失敗:', error.message)
  } finally {
    console.log('\n✅ 密碼驗證調試完成')
  }
}

debugPasswordVerification()
