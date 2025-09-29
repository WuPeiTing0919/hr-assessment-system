const https = require('https')
const http = require('http')

const checkAllTestTimes = async () => {
  console.log('🔍 檢查所有測試結果的時間顯示')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 檢查用戶測試結果 API
    console.log('\n📊 檢查用戶測試結果 API...')
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
        console.log(`找到 ${data.data.results.length} 筆測試結果:`)
        
        data.data.results.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.type} 測試:`)
          console.log(`   原始時間: ${result.completedAt}`)
          
          const date = new Date(result.completedAt)
          console.log(`   UTC 時間: ${date.toISOString()}`)
          console.log(`   台灣時間: ${date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
          console.log(`   台灣時間 (詳細): ${date.toLocaleString("zh-TW", { 
            timeZone: "Asia/Taipei",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}`)
          
          // 檢查是否是今天
          const now = new Date()
          const testDate = new Date(result.completedAt)
          const isToday = now.toDateString() === testDate.toDateString()
          console.log(`   是否為今天: ${isToday}`)
          
          // 計算時間差
          const timeDiff = now.getTime() - testDate.getTime()
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
          const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
          console.log(`   距離現在: ${hoursDiff} 小時 ${minutesDiff} 分鐘`)
        })
      }
    }

    // 檢查當前時間
    console.log('\n📊 當前時間:')
    const now = new Date()
    console.log(`UTC 時間: ${now.toISOString()}`)
    console.log(`台灣時間: ${now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 所有測試結果時間檢查完成')
  }
}

checkAllTestTimes()
