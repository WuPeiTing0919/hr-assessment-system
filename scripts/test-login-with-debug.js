const https = require('https')
const http = require('http')

const testLoginWithDebug = async () => {
  console.log('🔍 測試登入並查看調試資訊')
  console.log('=' .repeat(50))

  try {
    // 1. 創建一個測試用戶
    console.log('\n📊 1. 創建測試用戶...')
    const testUser = {
      name: '調試登入用戶',
      email: 'debug.login@company.com',
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
        console.log('   用戶ID:', createData.data.id)
        console.log('   電子郵件:', createData.data.email)
      } else {
        console.log('❌ 創建測試用戶失敗:', createData.error)
        return
      }
    }

    // 2. 等待一下讓資料庫更新
    console.log('\n⏳ 等待資料庫更新...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 3. 嘗試登入
    console.log('\n📊 2. 嘗試登入（查看調試資訊）...')
    const loginData = {
      email: 'debug.login@company.com',
      password: 'password123'
    }

    console.log('   登入資料:', loginData)

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
        console.log('   用戶資料:', loginResult.user)
      } else {
        console.log('❌ 登入失敗:', loginResult.error)
      }
    } else {
      const errorData = JSON.parse(loginResponse.data)
      console.log('❌ 登入 API 錯誤:', errorData.error)
    }

    // 4. 清理測試用戶
    console.log('\n📊 3. 清理測試用戶...')
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

    console.log('\n📝 調試測試總結:')
    console.log('🔍 請查看伺服器控制台的調試資訊')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 登入調試測試完成')
  }
}

testLoginWithDebug()
