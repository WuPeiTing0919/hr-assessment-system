const https = require('https')
const http = require('http')

const checkLatestTestResults = async () => {
  console.log('🔍 檢查最新的測試結果')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 檢查所有測試結果
    console.log('\n📊 檢查所有測試結果...')
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
          console.log(`   completedAt: ${result.completedAt}`)
          
          const date = new Date(result.completedAt)
          const isValid = !isNaN(date.getTime())
          console.log(`   解析是否有效: ${isValid ? '✅' : '❌'}`)
          
          if (isValid) {
            const taiwanTime = date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
            console.log(`   台灣時間: ${taiwanTime}`)
          }
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
    console.log('\n✅ 最新測試結果檢查完成')
  }
}

checkLatestTestResults()
