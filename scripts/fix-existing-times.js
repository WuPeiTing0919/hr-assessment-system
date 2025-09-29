const https = require('https')
const http = require('http')

const fixExistingTimes = async () => {
  console.log('🔍 修正現有測試結果的時間')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 檢查現有的測試結果
    console.log('\n📊 檢查現有測試結果...')
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
        console.log('發現需要修正的測試結果:')
        
        data.data.results.forEach((result, index) => {
          console.log(`\n${index + 1}. ${result.type} 測試:`)
          console.log(`   原始時間: ${result.completedAt}`)
          
          const date = new Date(result.completedAt)
          const taiwanTime = date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
          console.log(`   台灣時間: ${taiwanTime}`)
          
          // 檢查時間是否合理
          const now = new Date()
          const timeDiff = now.getTime() - date.getTime()
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
          
          if (hoursDiff > 24) {
            console.log(`   ⚠️  時間可能不正確 (${hoursDiff} 小時前)`)
          } else {
            console.log(`   ✅ 時間看起來正確 (${hoursDiff} 小時前)`)
          }
        })
      }
    }

    console.log('\n📝 建議:')
    console.log('1. 時間格式已修正，新的測試結果會使用正確的 UTC 時間')
    console.log('2. 現有的錯誤時間數據可能需要手動修正或重新測試')
    console.log('3. 建議重新進行一次測試來驗證修正效果')

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 現有時間檢查完成')
  }
}

fixExistingTimes()
