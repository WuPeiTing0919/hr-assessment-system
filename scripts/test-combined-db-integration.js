const https = require('https')
const http = require('http')

const testCombinedDBIntegration = async () => {
  console.log('🧪 測試綜合測試結果資料庫整合功能')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 1. 測試綜合測試結果上傳 API
    console.log('\n📊 1. 測試綜合測試結果上傳 API...')
    
    const testData = {
      userId: userId,
      logicScore: 10,
      creativityScore: 78,
      overallScore: 48,
      level: '待提升',
      description: '綜合能力有待提升,建議系統性訓練邏輯思維和創意能力',
      logicBreakdown: {
        correct: 1,
        total: 10,
        answers: { 0: 'A', 1: 'B', 2: 'C' }
      },
      creativityBreakdown: {
        total: 70,
        maxScore: 90,
        answers: { 0: 5, 1: 4, 2: 3 }
      },
      balanceScore: 66,
      completedAt: new Date().toISOString().replace('Z', '').replace('T', ' ')
    }

    console.log('測試數據:', JSON.stringify(testData, null, 2))

    const uploadResponse = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/test-results/combined',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
      req.write(JSON.stringify(testData))
      req.end()
    })

    console.log('📊 上傳響應狀態:', uploadResponse.status)
    
    if (uploadResponse.status === 200) {
      const uploadResult = JSON.parse(uploadResponse.data)
      console.log('✅ 上傳成功!')
      console.log('📡 響應內容:', JSON.stringify(uploadResult, null, 2))
      
      if (uploadResult.success) {
        console.log('測試結果ID:', uploadResult.data.testResult.id)
      }
    } else {
      console.log('❌ 上傳失敗，狀態碼:', uploadResponse.status)
      console.log('響應內容:', uploadResponse.data)
    }

    // 2. 測試綜合測試結果獲取 API
    console.log('\n📊 2. 測試綜合測試結果獲取 API...')
    
    const getResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/combined?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    console.log('📊 獲取響應狀態:', getResponse.status)
    
    if (getResponse.status === 200) {
      const getResult = JSON.parse(getResponse.data)
      console.log('✅ 獲取成功!')
      console.log('📡 響應內容:', JSON.stringify(getResult, null, 2))
      
      if (getResult.success && getResult.data.length > 0) {
        console.log(`找到 ${getResult.data.length} 筆綜合測試結果`)
        getResult.data.forEach((result, index) => {
          console.log(`\n結果 ${index + 1}:`)
          console.log(`  ID: ${result.id}`)
          console.log(`  邏輯分數: ${result.logic_score}`)
          console.log(`  創意分數: ${result.creativity_score}`)
          console.log(`  總分: ${result.overall_score}`)
          console.log(`  等級: ${result.level}`)
          console.log(`  完成時間: ${result.completed_at}`)
        })
      }
    } else {
      console.log('❌ 獲取失敗，狀態碼:', getResponse.status)
      console.log('響應內容:', getResponse.data)
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 綜合測試結果資料庫整合功能測試完成')
  }
}

testCombinedDBIntegration()
