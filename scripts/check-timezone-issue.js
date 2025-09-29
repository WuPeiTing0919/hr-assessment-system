const https = require('https')
const http = require('http')

const checkTimezoneIssue = async () => {
  console.log('🔍 檢查時區問題')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 1. 檢查用戶測試結果 API 返回的時間
    console.log('\n📊 1. 檢查用戶測試結果 API 返回的時間...')
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
      if (data.success && data.data.results.length > 0) {
        console.log('📋 測試結果時間:')
        data.data.results.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.type}:`)
          console.log(`   原始時間: ${result.completedAt}`)
          
          // 測試不同的時間格式化方式
          const date = new Date(result.completedAt)
          console.log(`   UTC 時間: ${date.toISOString()}`)
          console.log(`   本地時間: ${date.toLocaleString()}`)
          console.log(`   台灣時間: ${date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
          console.log(`   台灣時間 (en): ${date.toLocaleString("en-US", { timeZone: "Asia/Taipei" })}`)
        })
      }
    }

    // 2. 檢查當前時間
    console.log('\n📊 2. 檢查當前時間...')
    const now = new Date()
    console.log(`當前 UTC 時間: ${now.toISOString()}`)
    console.log(`當前本地時間: ${now.toLocaleString()}`)
    console.log(`當前台灣時間: ${now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)

    // 3. 測試時間轉換
    console.log('\n📊 3. 測試時間轉換...')
    const testTimes = [
      '2025-09-29T01:07:00.000Z',  // 從 API 返回的時間
      '2025-09-29T09:08:17.000Z',  // 可能的另一個時間
    ]
    
    testTimes.forEach((timeStr, index) => {
      console.log(`\n測試時間 ${index + 1}: ${timeStr}`)
      const testDate = new Date(timeStr)
      console.log(`  UTC: ${testDate.toISOString()}`)
      console.log(`  台灣時間: ${testDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    })

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 時區問題檢查完成')
  }
}

checkTimezoneIssue()
