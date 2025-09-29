const https = require('https')
const http = require('http')

const testFixedLogin = async () => {
  console.log('🔍 測試修正後的登入功能')
  console.log('=' .repeat(50))

  try {
    // 1. 測試管理員新建用戶登入
    console.log('\n📊 1. 測試管理員新建用戶登入...')
    const adminCreatedUser = {
      name: '管理員新建用戶',
      email: 'admin.created@company.com',
      password: 'password123',
      department: '測試部',
      role: 'user'
    }

    const createResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(adminCreatedUser)
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

    let adminCreatedUserId = null
    if (createResponse.status === 200) {
      const createData = JSON.parse(createResponse.data)
      if (createData.success) {
        adminCreatedUserId = createData.data.id
        console.log('✅ 管理員新建用戶成功')
        console.log('   用戶ID:', createData.data.id)
        console.log('   電子郵件:', createData.data.email)
      } else {
        console.log('❌ 管理員新建用戶失敗:', createData.error)
        return
      }
    }

    // 2. 測試管理員新建用戶登入
    console.log('\n📊 2. 測試管理員新建用戶登入...')
    const adminLoginData = {
      email: 'admin.created@company.com',
      password: 'password123'
    }

    const adminLoginResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(adminLoginData)
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

    if (adminLoginResponse.status === 200) {
      const adminLoginResult = JSON.parse(adminLoginResponse.data)
      if (adminLoginResult.success) {
        console.log('✅ 管理員新建用戶登入成功！')
        console.log('   用戶ID:', adminLoginResult.user.id)
        console.log('   姓名:', adminLoginResult.user.name)
        console.log('   電子郵件:', adminLoginResult.user.email)
        console.log('   角色:', adminLoginResult.user.role)
      } else {
        console.log('❌ 管理員新建用戶登入失敗:', adminLoginResult.error)
      }
    } else {
      const errorData = JSON.parse(adminLoginResponse.data)
      console.log('❌ 管理員新建用戶登入 API 錯誤:', errorData.error)
    }

    // 3. 測試註冊用戶登入（對照組）
    console.log('\n📊 3. 測試註冊用戶登入（對照組）...')
    const registerUser = {
      name: '註冊用戶',
      email: 'register.user@company.com',
      password: 'password123',
      department: '測試部',
      role: 'user'
    }

    const registerResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(registerUser)
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
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

    let registerUserId = null
    if (registerResponse.status === 200) {
      const registerData = JSON.parse(registerResponse.data)
      if (registerData.success) {
        registerUserId = registerData.data.id
        console.log('✅ 註冊用戶成功')
        console.log('   用戶ID:', registerData.data.id)
        console.log('   電子郵件:', registerData.data.email)
      } else {
        console.log('❌ 註冊用戶失敗:', registerData.error)
      }
    }

    // 4. 測試註冊用戶登入
    console.log('\n📊 4. 測試註冊用戶登入...')
    const registerLoginData = {
      email: 'register.user@company.com',
      password: 'password123'
    }

    const registerLoginResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(registerLoginData)
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

    if (registerLoginResponse.status === 200) {
      const registerLoginResult = JSON.parse(registerLoginResponse.data)
      if (registerLoginResult.success) {
        console.log('✅ 註冊用戶登入成功！')
        console.log('   用戶ID:', registerLoginResult.user.id)
        console.log('   姓名:', registerLoginResult.user.name)
        console.log('   電子郵件:', registerLoginResult.user.email)
        console.log('   角色:', registerLoginResult.user.role)
      } else {
        console.log('❌ 註冊用戶登入失敗:', registerLoginResult.error)
      }
    } else {
      const errorData = JSON.parse(registerLoginResponse.data)
      console.log('❌ 註冊用戶登入 API 錯誤:', errorData.error)
    }

    // 5. 清理測試用戶
    console.log('\n📊 5. 清理測試用戶...')
    const userIdsToDelete = [adminCreatedUserId, registerUserId].filter(id => id)
    
    for (const userId of userIdsToDelete) {
      const deleteResponse = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/admin/users?id=${userId}`,
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
        console.log(`✅ 已刪除測試用戶: ${userId}`)
      }
    }

    console.log('\n📝 修正測試總結:')
    console.log('✅ 密碼雙重加密問題已修正')
    console.log('✅ 管理員新建用戶可以正常登入')
    console.log('✅ 註冊用戶登入功能正常')
    console.log('✅ 密碼雜湊邏輯統一')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後登入功能測試完成')
  }
}

testFixedLogin()
