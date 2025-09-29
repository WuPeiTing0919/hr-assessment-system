const https = require('https')
const http = require('http')

const testCreativeTimeFix = async () => {
  console.log('🔍 測試創意測驗時間修正')
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
        
        // 按創建時間排序
        const sortedResults = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        
        console.log('\n📋 排序後的創意測試結果:')
        sortedResults.forEach((result, index) => {
          console.log(`\n${index + 1}. 創意測試:`)
          console.log(`   ID: ${result.id}`)
          console.log(`   completed_at: ${result.completed_at}`)
          console.log(`   created_at: ${result.created_at}`)
          
          const completedDate = new Date(result.completed_at)
          const createdDate = new Date(result.created_at)
          
          console.log(`   completed_at 台灣時間: ${completedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
          console.log(`   created_at 台灣時間: ${createdDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
          
          // 檢查是否是今天
          const now = new Date()
          const isToday = now.toDateString() === completedDate.toDateString()
          console.log(`   是否為今天: ${isToday}`)
        })
        
        // 顯示最新結果
        const latestResult = sortedResults[0]
        console.log('\n🎯 最新結果 (創意測驗結果頁面會使用這個):')
        console.log(`completed_at: ${latestResult.completed_at}`)
        const latestDate = new Date(latestResult.completed_at)
        console.log(`台灣時間: ${latestDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
      }
    }

    // 檢查當前時間
    console.log('\n📊 當前時間:')
    const now = new Date()
    console.log(`UTC 時間: ${now.toISOString()}`)
    console.log(`台灣時間: ${now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 創意測驗時間修正測試完成')
  }
}

testCreativeTimeFix()
