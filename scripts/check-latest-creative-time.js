const https = require('https')
const http = require('http')

const checkLatestCreativeTime = async () => {
  console.log('🔍 檢查最新創意測驗結果時間')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 檢查創意測試結果 API
    console.log('\n📊 檢查創意測試結果 API...')
    const response = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/creative?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (response.status === 200) {
      const data = JSON.parse(response.data)
      if (data.success && data.data.length > 0) {
        console.log(`找到 ${data.data.length} 筆創意測試結果:`)
        
        // 按創建時間排序，取最新的
        const sortedResults = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        const latestResult = sortedResults[0]
        
        console.log('\n📋 最新創意測試結果:')
        console.log(`ID: ${latestResult.id}`)
        console.log(`completed_at: ${latestResult.completed_at}`)
        console.log(`created_at: ${latestResult.created_at}`)
        
        const completedDate = new Date(latestResult.completed_at)
        const createdDate = new Date(latestResult.created_at)
        
        console.log(`completed_at 台灣時間: ${completedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
        console.log(`created_at 台灣時間: ${createdDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
        
        // 檢查時間差
        const timeDiff = createdDate.getTime() - completedDate.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        console.log(`時間差: ${hoursDiff.toFixed(2)} 小時`)
        
        // 檢查是否是今天
        const now = new Date()
        const isToday = now.toDateString() === completedDate.toDateString()
        console.log(`是否為今天: ${isToday}`)
        
        // 計算距離現在的時間
        const nowDiff = now.getTime() - completedDate.getTime()
        const nowHoursDiff = nowDiff / (1000 * 60 * 60)
        console.log(`距離現在: ${nowHoursDiff.toFixed(2)} 小時`)
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
    console.log('\n✅ 最新創意測驗結果時間檢查完成')
  }
}

checkLatestCreativeTime()
