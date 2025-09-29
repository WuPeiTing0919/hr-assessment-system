const https = require('https')
const http = require('http')

const testUserProfileUpdate = async () => {
  console.log('🔍 測試個人資訊更新功能')
  console.log('=' .repeat(50))

  const testUserId = 'user-1759073326705-m06y3wacd'

  try {
    // 1. 獲取當前用戶資料
    console.log('\n📊 1. 獲取當前用戶資料...')
    const getResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/user/profile?userId=${testUserId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (getResponse.status === 200) {
      const getData = JSON.parse(getResponse.data)
      if (getData.success) {
        console.log('✅ 用戶資料獲取成功:')
        console.log(`   ID: ${getData.data.id}`)
        console.log(`   姓名: ${getData.data.name}`)
        console.log(`   電子郵件: ${getData.data.email}`)
        console.log(`   部門: ${getData.data.department}`)
        console.log(`   角色: ${getData.data.role}`)
      }
    }

    // 2. 測試更新個人資料
    console.log('\n📊 2. 測試更新個人資料...')
    const updateData = {
      userId: testUserId,
      name: '測試用戶更新',
      email: 'test.updated@company.com',
      department: '研發部'
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
        console.log('✅ 個人資料更新成功:')
        console.log(`   姓名: ${updateResult.data.name}`)
        console.log(`   電子郵件: ${updateResult.data.email}`)
        console.log(`   部門: ${updateResult.data.department}`)
      } else {
        console.log('❌ 個人資料更新失敗:', updateResult.error)
      }
    }

    // 3. 驗證更新結果
    console.log('\n📊 3. 驗證更新結果...')
    const verifyResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/user/profile?userId=${testUserId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (verifyResponse.status === 200) {
      const verifyData = JSON.parse(verifyResponse.data)
      if (verifyData.success) {
        console.log('✅ 更新後用戶資料:')
        console.log(`   姓名: ${verifyData.data.name}`)
        console.log(`   電子郵件: ${verifyData.data.email}`)
        console.log(`   部門: ${verifyData.data.department}`)
        
        // 檢查更新是否成功
        const isUpdated = verifyData.data.name === '測試用戶更新' && 
                         verifyData.data.email === 'test.updated@company.com' &&
                         verifyData.data.department === '研發部'
        console.log(`更新是否成功: ${isUpdated ? '✅' : '❌'}`)
      }
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 個人資訊更新功能測試完成')
  }
}

testUserProfileUpdate()
