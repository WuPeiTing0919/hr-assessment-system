const https = require('https')
const http = require('http')

const testUserResultsWithCombined = async () => {
  console.log('🧪 測試包含綜合測試結果的用戶測試結果 API')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 測試用戶測試結果 API
    console.log('\n📊 測試用戶測試結果 API...')
    const response = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/user/test-results?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (response.status === 200) {
      const data = JSON.parse(response.data)
      console.log('✅ API 測試成功!')
      console.log('📡 響應內容:', JSON.stringify(data, null, 2))
      
      if (data.success) {
        console.log('\n📈 測試結果詳情:')
        console.log(`- 總測試數: ${data.data.stats.totalTests}`)
        console.log(`- 平均分數: ${data.data.stats.averageScore}`)
        console.log(`- 最高分數: ${data.data.stats.bestScore}`)
        console.log(`- 最近測試: ${data.data.stats.lastTestDate}`)
        console.log(`- 測試次數:`, data.data.stats.testCounts)
        
        console.log('\n📋 測試結果列表:')
        data.data.results.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.type}:`)
          console.log(`   分數: ${result.score}`)
          console.log(`   完成時間: ${result.completedAt}`)
          console.log(`   測試次數: ${result.testCount}`)
          console.log(`   詳細資訊:`, result.details)
        })
      }
    } else {
      console.log('❌ API 響應失敗，狀態碼:', response.status)
      console.log('響應內容:', response.data)
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 包含綜合測試結果的用戶測試結果 API 測試完成')
  }
}

testUserResultsWithCombined()
