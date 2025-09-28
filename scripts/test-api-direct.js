const testAPIDirect = async () => {
  console.log('🧪 直接測試 API 路由')
  console.log('=' .repeat(50))

  // 模擬測試數據
  const testData = {
    userId: 'user-1759073326705-m06y3wacd',
    answers: ['A', 'B', 'C', 'D', 'E', 'A', 'B', 'C', 'D', 'E'], // 10個答案
    completedAt: new Date().toISOString().replace('Z', '').replace('T', ' ')
  }

  console.log('\n📝 測試數據:')
  console.log(JSON.stringify(testData, null, 2))

  try {
    console.log('\n🔄 測試 API 路由...')
    
    // 先測試資料庫連接
    console.log('1. 測試資料庫連接...')
    const dbTestResponse = await fetch('http://localhost:3000/api/test-db')
    if (dbTestResponse.ok) {
      console.log('✅ 資料庫連接正常')
    } else {
      console.log('❌ 資料庫連接失敗')
    }

    // 測試邏輯測驗 API
    console.log('\n2. 測試邏輯測驗 API...')
    const response = await fetch('http://localhost:3000/api/test-results/logic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('📊 響應狀態:', response.status)
    console.log('📊 響應狀態文字:', response.statusText)

    let result
    try {
      const text = await response.text()
      console.log('📊 原始響應:', text)
      result = JSON.parse(text)
      console.log('📊 解析後響應:', JSON.stringify(result, null, 2))
    } catch (parseError) {
      console.log('❌ JSON 解析失敗:', parseError.message)
      return
    }

    if (result.success) {
      console.log('\n✅ API 測試成功!')
    } else {
      console.log('\n❌ API 測試失敗!')
      console.log('錯誤訊息:', result.error)
    }

  } catch (error) {
    console.log('\n❌ 請求失敗:')
    console.log('錯誤類型:', error.name)
    console.log('錯誤訊息:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 建議:')
      console.log('1. 確保開發伺服器正在運行 (npm run dev)')
      console.log('2. 檢查端口 3000 是否可用')
    }
  }

  console.log('\n✅ API 直接測試完成')
}

testAPIDirect()
