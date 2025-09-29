const https = require('https')
const http = require('http')

const checkRawTestData = async () => {
  console.log('🔍 檢查原始測試數據')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 檢查邏輯測試結果
    console.log('\n📊 檢查邏輯測試結果...')
    const logicResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/logic?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (logicResponse.status === 200) {
      const logicData = JSON.parse(logicResponse.data)
      if (logicData.success && logicData.data.length > 0) {
        console.log('邏輯測試結果:')
        logicData.data.forEach((result, index) => {
          console.log(`\n${index + 1}. 邏輯測試:`)
          console.log(`   ID: ${result.id}`)
          console.log(`   原始時間: ${result.completed_at}`)
          console.log(`   創建時間: ${result.created_at}`)
          
          const date = new Date(result.completed_at)
          console.log(`   台灣時間: ${date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
        })
      }
    }

    // 檢查創意測試結果
    console.log('\n📊 檢查創意測試結果...')
    const creativeResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/creative?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (creativeResponse.status === 200) {
      const creativeData = JSON.parse(creativeResponse.data)
      if (creativeData.success && creativeData.data.length > 0) {
        console.log('創意測試結果:')
        creativeData.data.forEach((result, index) => {
          console.log(`\n${index + 1}. 創意測試:`)
          console.log(`   ID: ${result.id}`)
          console.log(`   原始時間: ${result.completed_at}`)
          console.log(`   創建時間: ${result.created_at}`)
          
          const date = new Date(result.completed_at)
          console.log(`   台灣時間: ${date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 原始測試數據檢查完成')
  }
}

checkRawTestData()
