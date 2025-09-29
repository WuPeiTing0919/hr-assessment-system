const https = require('https')
const http = require('http')

const checkAllCombinedTimes = async () => {
  console.log('🔍 檢查所有綜合測試結果時間')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 檢查綜合測試結果 API
    console.log('\n📊 檢查所有綜合測試結果...')
    const response = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/combined?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (response.status === 200) {
      const data = JSON.parse(response.data)
      if (data.success) {
        console.log(`找到 ${data.data.length} 筆綜合測試結果:`)
        
        data.data.forEach((result, index) => {
          console.log(`\n${index + 1}. 綜合測試結果:`)
          console.log(`   ID: ${result.id}`)
          console.log(`   原始時間: ${result.completed_at}`)
          
          const date = new Date(result.completed_at)
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
          const testDate = new Date(result.completed_at)
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

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 所有綜合測試結果時間檢查完成')
  }
}

checkAllCombinedTimes()
