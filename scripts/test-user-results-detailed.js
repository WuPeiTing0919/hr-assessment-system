const https = require('https')
const http = require('http')

const testUserResultsAPI = async () => {
  console.log('🧪 測試用戶測試結果 API (詳細版)')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'
  const url = `http://localhost:3000/api/user/test-results?userId=${userId}`

  try {
    console.log(`\n📊 測試用戶ID: ${userId}`)
    console.log(`🔗 API URL: ${url}`)
    
    const response = await new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    console.log('📊 響應狀態:', response.status)
    
    if (response.status === 200) {
      const result = JSON.parse(response.data)
      console.log('\n✅ API 測試成功!')
      
      console.log(`\n📈 統計數據:`)
      console.log(`- 總測試次數: ${result.data.stats.totalTests}`)
      console.log(`- 平均分數: ${result.data.stats.averageScore}`)
      console.log(`- 最高分數: ${result.data.stats.bestScore}`)
      console.log(`- 最近測試: ${result.data.stats.lastTestDate}`)
      console.log(`- 邏輯測驗次數: ${result.data.stats.testCounts.logic}`)
      console.log(`- 創意測驗次數: ${result.data.stats.testCounts.creative}`)
      console.log(`- 綜合測驗次數: ${result.data.stats.testCounts.combined}`)
      
      console.log(`\n📋 測試結果 (${result.data.results.length} 個):`)
      result.data.results.forEach((testResult, index) => {
        console.log(`${index + 1}. ${testResult.type} - 分數: ${testResult.score}, 測驗次數: ${testResult.testCount || 1}`)
        console.log(`   完成時間: ${testResult.completedAt}`)
      })
    } else {
      console.log('❌ API 響應失敗，狀態碼:', response.status)
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
