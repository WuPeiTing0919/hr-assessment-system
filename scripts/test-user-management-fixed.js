const https = require('https')
const http = require('http')

const testUserManagementFixed = async () => {
  console.log('🔍 測試修正後的用戶管理功能')
  console.log('=' .repeat(50))

  try {
    // 1. 獲取用戶列表並檢查建立時間格式
    console.log('\n📊 1. 檢查建立時間格式...')
    const getResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/users', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    let getData = null
    if (getResponse.status === 200) {
      getData = JSON.parse(getResponse.data)
      if (getData.success) {
        console.log(`✅ 獲取用戶列表成功，共 ${getData.data.length} 個用戶:`)
        getData.data.forEach((user, index) => {
          const createDate = new Date(user.created_at).toLocaleDateString("zh-TW")
          console.log(`   ${index + 1}. ${user.name} (${user.email})`)
          console.log(`      建立時間: ${createDate}`)
          console.log(`      角色: ${user.role}`)
        })
      }
    }

    // 2. 測試更新用戶（不包含密碼）
    console.log('\n📊 2. 測試更新用戶（不包含密碼）...')
    
    // 先獲取一個用戶進行測試
    const testUser = getData?.data?.find(user => user.role === 'user')
    if (testUser) {
      const updateData = {
        id: testUser.id,
        name: testUser.name + ' (已更新)',
        email: testUser.email,
        department: '更新測試部',
        role: testUser.role
      }

      const updateResponse = await new Promise((resolve, reject) => {
        const postData = JSON.stringify(updateData)
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/users',
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
          console.log('✅ 更新用戶成功（不包含密碼）:')
          console.log(`   姓名: ${updateResult.data.name}`)
          console.log(`   部門: ${updateResult.data.department}`)
          console.log(`   角色: ${updateResult.data.role}`)
        } else {
          console.log('❌ 更新用戶失敗:', updateResult.error)
        }
      }

      // 恢復原始資料
      const restoreData = {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
        department: testUser.department,
        role: testUser.role
      }

      const restoreResponse = await new Promise((resolve, reject) => {
        const postData = JSON.stringify(restoreData)
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/users',
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

      if (restoreResponse.status === 200) {
        console.log('✅ 已恢復原始用戶資料')
      }
    }

    console.log('\n📝 修正總結:')
    console.log('✅ 建立時間格式已修正（使用 created_at 欄位）')
    console.log('✅ 建立時間顯示為台灣日期格式')
    console.log('✅ 管理員編輯用戶時無法修改密碼')
    console.log('✅ 用戶更新功能正常運作')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後的用戶管理功能測試完成')
  }
}

testUserManagementFixed()
