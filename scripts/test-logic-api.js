const testLogicAPI = async () => {
  console.log('🧪 測試邏輯測驗 API')
  console.log('=' .repeat(50))

  // 模擬測試數據
  const testData = {
    userId: 'test_user_123',
    answers: ['A', 'B', 'C', 'D', 'E', 'A', 'B', 'C', 'D', 'E'], // 10個答案
    completedAt: new Date().toISOString()
  }

  console.log('\n📝 測試數據:')
  console.log('用戶ID:', testData.userId)
  console.log('答案數量:', testData.answers.length)
  console.log('完成時間:', testData.completedAt)

  try {
    console.log('\n🔄 發送 POST 請求到 /api/test-results/logic...')
    
    const response = await fetch('http://localhost:3000/api/test-results/logic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('📊 響應狀態:', response.status)
    console.log('📊 響應狀態文字:', response.statusText)

    const result = await response.json()
    console.log('📊 響應內容:', JSON.stringify(result, null, 2))

    if (result.success) {
      console.log('\n✅ API 測試成功!')
      console.log('測試結果ID:', result.data.testResult.id)
      console.log('答案記錄數量:', result.data.answerCount)
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
      console.log('3. 檢查防火牆設定')
    }
  }

  console.log('\n🔍 檢查要點:')
  console.log('1. 開發伺服器是否運行')
  console.log('2. API 路由是否正確')
  console.log('3. 資料庫連接是否正常')
  console.log('4. 用戶認證是否有效')
  console.log('5. 資料庫表是否存在')

  console.log('\n✅ 邏輯測驗 API 測試完成')
}

testLogicAPI()
