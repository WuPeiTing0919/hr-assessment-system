const https = require('https')
const http = require('http')

const testTimeFix = async () => {
  console.log('🔍 測試時間修正效果')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 測試當前時間
    console.log('\n📊 當前時間測試:')
    const now = new Date()
    console.log(`本地時間: ${now.toLocaleString()}`)
    console.log(`UTC 時間: ${now.toISOString()}`)
    console.log(`台灣時間: ${now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    
    // 測試時間轉換
    console.log('\n📊 時間轉換測試:')
    const testTimes = [
      '2025-09-29T09:16:50.637Z',  // 修正後的格式
      '2025-09-29 09:16:50.637',   // 舊的格式
    ]
    
    testTimes.forEach((timeStr, index) => {
      console.log(`\n測試 ${index + 1}: ${timeStr}`)
      const date = new Date(timeStr)
      console.log(`  轉換為 Date 物件: ${date.toISOString()}`)
      console.log(`  台灣時間: ${date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    })

    // 檢查現有的測試結果
    console.log('\n📊 檢查現有測試結果:')
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
        data.data.results.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.type} 測試:`)
          console.log(`   原始時間: ${result.completedAt}`)
          
          const date = new Date(result.completedAt)
          console.log(`   台灣時間: ${date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 時間修正測試完成')
  }
}

testTimeFix()
