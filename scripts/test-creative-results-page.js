const https = require('https')
const http = require('http')

const testCreativeResultsPage = async () => {
  console.log('🧪 測試創意測驗結果頁面數據獲取')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 1. 測試用戶測試結果 API
    console.log('\n📊 1. 測試用戶測試結果 API...')
    const userResultsResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/user/test-results?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (userResultsResponse.status === 200) {
      const userResultsData = JSON.parse(userResultsResponse.data)
      console.log('用戶測試結果:', JSON.stringify(userResultsData, null, 2))
    }

    // 2. 測試創意測驗結果 API
    console.log('\n📊 2. 測試創意測驗結果 API...')
    const creativeResultsResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/creative?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (creativeResultsResponse.status === 200) {
      const creativeResultsData = JSON.parse(creativeResultsResponse.data)
      console.log('創意測驗結果:', JSON.stringify(creativeResultsData, null, 2))
    }

    // 3. 測試創意測驗答案 API
    console.log('\n📊 3. 測試創意測驗答案 API...')
    const testResultId = 'test_1759086508812_xv2pof6lk'
    const answersResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/creative-test-answers?testResultId=${testResultId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (answersResponse.status === 200) {
      const answersData = JSON.parse(answersResponse.data)
      console.log('創意測驗答案數量:', answersData.data.length)
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 創意測驗結果頁面數據獲取測試完成')
  }
}

testCreativeResultsPage()
