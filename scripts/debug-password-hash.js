const https = require('https')
const http = require('http')

const debugPasswordHash = async () => {
  console.log('🔍 調試密碼雜湊問題')
  console.log('=' .repeat(50))

  try {
    // 1. 創建一個測試用戶並記錄詳細資訊
    console.log('\n📊 1. 創建測試用戶並記錄詳細資訊...')
    const testUser = {
      name: '密碼雜湊調試用戶',
      email: 'hash.debug@company.com',
      password: 'password123',
      department: '測試部',
      role: 'user'
    }

    console.log('   原始密碼:', testUser.password)

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
        console.log('   用戶ID:', createData.data.id)
        console.log('   電子郵件:', createData.data.email)
      } else {
        console.log('❌ 創建測試用戶失敗:', createData.error)
        return
      }
    } else {
      console.log('❌ 創建用戶 API 回應錯誤:', createResponse.status)
      console.log('   回應內容:', createResponse.data)
      return
    }

    // 2. 嘗試登入並記錄詳細錯誤
    console.log('\n📊 2. 嘗試登入並記錄詳細錯誤...')
    const loginData = {
      email: 'hash.debug@company.com',
      password: 'password123'
    }

    console.log('   登入嘗試 - 電子郵件:', loginData.email)
    console.log('   登入嘗試 - 密碼:', loginData.password)

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

    console.log('   登入回應狀態碼:', loginResponse.status)
    console.log('   登入回應內容:', loginResponse.data)

    if (loginResponse.status === 200) {
      const loginResult = JSON.parse(loginResponse.data)
      if (loginResult.success) {
        console.log('✅ 登入成功！')
      } else {
        console.log('❌ 登入失敗:', loginResult.error)
      }
    } else {
      const errorData = JSON.parse(loginResponse.data)
      console.log('❌ 登入 API 錯誤:', errorData.error)
    }

    // 3. 檢查資料庫中的用戶資料
    console.log('\n📊 3. 檢查資料庫中的用戶資料...')
    const getUsersResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/users', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (getUsersResponse.status === 200) {
      const usersData = JSON.parse(getUsersResponse.data)
      if (usersData.success) {
        const testUserInDB = usersData.data.find(user => user.id === testUserId)
        if (testUserInDB) {
          console.log('✅ 資料庫中的用戶資料:')
          console.log('   ID:', testUserInDB.id)
          console.log('   姓名:', testUserInDB.name)
          console.log('   電子郵件:', testUserInDB.email)
          console.log('   部門:', testUserInDB.department)
          console.log('   角色:', testUserInDB.role)
          console.log('   建立時間:', testUserInDB.created_at)
          console.log('   更新時間:', testUserInDB.updated_at)
          // 注意：密碼欄位不會在 API 回應中返回，這是正常的
        } else {
          console.log('❌ 在資料庫中找不到測試用戶')
        }
      }
    }

    // 4. 測試現有用戶的登入（作為對照）
    console.log('\n📊 4. 測試現有用戶的登入（作為對照）...')
    const existingUserLogin = {
      email: 'admin@company.com',
      password: 'admin123'
    }

    const existingLoginResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(existingUserLogin)
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

    if (existingLoginResponse.status === 200) {
      const existingLoginResult = JSON.parse(existingLoginResponse.data)
      if (existingLoginResult.success) {
        console.log('✅ 現有用戶登入成功（對照組）')
      } else {
        console.log('❌ 現有用戶登入失敗:', existingLoginResult.error)
      }
    } else {
      const errorData = JSON.parse(existingLoginResponse.data)
      console.log('❌ 現有用戶登入 API 錯誤:', errorData.error)
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
    console.log('🔍 請檢查以上詳細資訊，找出密碼雜湊和驗證的問題')

  } catch (error) {
    console.error('❌ 調試失敗:', error.message)
  } finally {
    console.log('\n✅ 密碼雜湊調試完成')
  }
}

debugPasswordHash()
