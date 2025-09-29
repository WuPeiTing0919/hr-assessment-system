const https = require('https')
const http = require('http')

const testFixedTimeParsing = async () => {
  console.log('🔍 測試修正後的時間解析')
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
        // 按創建時間排序，取最新的
        const sortedResults = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        const latestResult = sortedResults[0]
        
        console.log('\n📋 最新創意測試結果:')
        console.log(`completed_at: ${latestResult.completed_at}`)
        
        // 測試時間解析
        console.log('\n📊 測試時間解析:')
        const parsedDate = new Date(latestResult.completed_at)
        const isValid = !isNaN(parsedDate.getTime())
        
        console.log(`解析結果: ${parsedDate.toISOString()}`)
        console.log(`是否有效: ${isValid ? '✅' : '❌'}`)
        
        if (isValid) {
          const taiwanTime = parsedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
          console.log(`台灣時間: ${taiwanTime}`)
        }
        
        // 檢查所有結果的時間格式
        console.log('\n📊 所有結果的時間格式:')
        data.data.forEach((result, index) => {
          const date = new Date(result.completed_at)
          const isValid = !isNaN(date.getTime())
          console.log(`${index + 1}. ${result.completed_at} → ${isValid ? '✅' : '❌'}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後的時間解析測試完成')
  }
}

testFixedTimeParsing()
