const { executeQuery } = require('../lib/database/connection')

const checkDatabasePassword = async () => {
  console.log('🔍 檢查資料庫中的密碼')
  console.log('=' .repeat(50))

  try {
    // 1. 創建一個測試用戶
    console.log('\n📊 1. 創建測試用戶...')
    const testUser = {
      name: '資料庫密碼檢查用戶',
      email: 'db.password@company.com',
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

      const req = require('http').request(options, (res) => {
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

    // 2. 直接查詢資料庫
    console.log('\n📊 2. 直接查詢資料庫...')
    try {
      const query = 'SELECT id, name, email, password, department, role, created_at FROM users WHERE email = ?'
      const result = await executeQuery(query, ['db.password@company.com'])
      
      if (result && result.length > 0) {
        const user = result[0]
        console.log('✅ 資料庫查詢成功:')
        console.log('   ID:', user.id)
        console.log('   姓名:', user.name)
        console.log('   電子郵件:', user.email)
        console.log('   部門:', user.department)
        console.log('   角色:', user.role)
        console.log('   建立時間:', user.created_at)
        console.log('   密碼長度:', user.password ? user.password.length : 'null')
        console.log('   密碼前綴:', user.password ? user.password.substring(0, 20) + '...' : 'null')
        console.log('   密碼是否為 bcrypt 格式:', user.password ? user.password.startsWith('$2b$') : false)
      } else {
        console.log('❌ 在資料庫中找不到用戶')
      }
    } catch (dbError) {
      console.log('❌ 資料庫查詢失敗:', dbError.message)
    }

    // 3. 測試密碼驗證
    console.log('\n📊 3. 測試密碼驗證...')
    try {
      const bcrypt = require('bcryptjs')
      const query = 'SELECT password FROM users WHERE email = ?'
      const result = await executeQuery(query, ['db.password@company.com'])
      
      if (result && result.length > 0) {
        const hashedPassword = result[0].password
        const testPassword = 'password123'
        
        console.log('   測試密碼:', testPassword)
        console.log('   資料庫密碼雜湊:', hashedPassword.substring(0, 20) + '...')
        
        const isValid = await bcrypt.compare(testPassword, hashedPassword)
        console.log('   密碼驗證結果:', isValid ? '✅ 成功' : '❌ 失敗')
        
        if (!isValid) {
          // 測試其他可能的密碼
          const testPasswords = ['Password123', 'PASSWORD123', 'password', '123456']
          for (const pwd of testPasswords) {
            const testResult = await bcrypt.compare(pwd, hashedPassword)
            console.log(`   測試密碼 "${pwd}":`, testResult ? '✅ 成功' : '❌ 失敗')
            if (testResult) break
          }
        }
      }
    } catch (verifyError) {
      console.log('❌ 密碼驗證測試失敗:', verifyError.message)
    }

    // 4. 清理測試用戶
    console.log('\n📊 4. 清理測試用戶...')
    if (testUserId) {
      const deleteResponse = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/admin/users?id=${testUserId}`,
          method: 'DELETE'
        }

        const req = require('http').request(options, (res) => {
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

    console.log('\n📝 資料庫密碼檢查總結:')
    console.log('🔍 請查看以上詳細資訊，找出密碼問題')

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 資料庫密碼檢查完成')
  }
}

checkDatabasePassword()
