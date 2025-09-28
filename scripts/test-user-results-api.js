const fetch = require('node-fetch')

const testUserResultsAPI = async () => {
  console.log('🧪 測試用戶測試結果 API')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd' // 使用現有用戶ID

  try {
    console.log(`\n📊 測試用戶ID: ${userId}`)
    
    const response = await fetch(`http://localhost:3000/api/user/test-results?userId=${userId}`)
    
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
      console.log(`📈 統計數據:`)
      console.log(`- 總測試次數: ${result.data.stats.totalTests}`)
      console.log(`- 平均分數: ${result.data.stats.averageScore}`)
      console.log(`- 最高分數: ${result.data.stats.bestScore}`)
      console.log(`- 最近測試: ${result.data.stats.lastTestDate}`)
      console.log(`- 邏輯測驗次數: ${result.data.stats.testCounts.logic}`)
      console.log(`- 創意測驗次數: ${result.data.stats.testCounts.creative}`)
      console.log(`- 綜合測驗次數: ${result.data.stats.testCounts.combined}`)
      
      console.log(`\n📋 測試結果 (${result.data.results.length} 個):`)
      result.data.results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.type} - 分數: ${result.score}, 測驗次數: ${result.testCount || 1}`)
      })
    } else {
      console.log('\n❌ API 測試失敗!')
      console.log('錯誤訊息:', result.error)
    }

  } catch (error) {
    console.error('\n❌ 請求失敗:')
    console.error('錯誤類型:', error.name)
    console.error('錯誤訊息:', error.message)
  } finally {
    console.log('\n✅ 用戶測試結果 API 測試完成')
  }
}

testUserResultsAPI()
