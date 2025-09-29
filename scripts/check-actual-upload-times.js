const https = require('https')
const http = require('http')

const checkActualUploadTimes = async () => {
  console.log('🔍 檢查實際上傳時間')
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
        console.log('邏輯測試結果 (按創建時間排序):')
        logicData.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .forEach((result, index) => {
            console.log(`\n${index + 1}. 邏輯測試:`)
            console.log(`   ID: ${result.id}`)
            console.log(`   completed_at: ${result.completed_at}`)
            console.log(`   created_at: ${result.created_at}`)
            
            const completedDate = new Date(result.completed_at)
            const createdDate = new Date(result.created_at)
            
            console.log(`   completed_at 台灣時間: ${completedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
            console.log(`   created_at 台灣時間: ${createdDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
            
            // 計算時間差
            const timeDiff = createdDate.getTime() - completedDate.getTime()
            const hoursDiff = timeDiff / (1000 * 60 * 60)
            console.log(`   時間差: ${hoursDiff.toFixed(2)} 小時`)
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
        console.log('創意測試結果 (按創建時間排序):')
        creativeData.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .forEach((result, index) => {
            console.log(`\n${index + 1}. 創意測試:`)
            console.log(`   ID: ${result.id}`)
            console.log(`   completed_at: ${result.completed_at}`)
            console.log(`   created_at: ${result.created_at}`)
            
            const completedDate = new Date(result.completed_at)
            const createdDate = new Date(result.created_at)
            
            console.log(`   completed_at 台灣時間: ${completedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
            console.log(`   created_at 台灣時間: ${createdDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
            
            // 計算時間差
            const timeDiff = createdDate.getTime() - completedDate.getTime()
            const hoursDiff = timeDiff / (1000 * 60 * 60)
            console.log(`   時間差: ${hoursDiff.toFixed(2)} 小時`)
          })
      }
    }

    // 檢查綜合測試結果
    console.log('\n📊 檢查綜合測試結果...')
    const combinedResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/combined?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (combinedResponse.status === 200) {
      const combinedData = JSON.parse(combinedResponse.data)
      if (combinedData.success && combinedData.data.length > 0) {
        console.log('綜合測試結果 (按創建時間排序):')
        combinedData.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .forEach((result, index) => {
            console.log(`\n${index + 1}. 綜合測試:`)
            console.log(`   ID: ${result.id}`)
            console.log(`   completed_at: ${result.completed_at}`)
            console.log(`   created_at: ${result.created_at}`)
            
            const completedDate = new Date(result.completed_at)
            const createdDate = new Date(result.created_at)
            
            console.log(`   completed_at 台灣時間: ${completedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
            console.log(`   created_at 台灣時間: ${createdDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
            
            // 計算時間差
            const timeDiff = createdDate.getTime() - completedDate.getTime()
            const hoursDiff = timeDiff / (1000 * 60 * 60)
            console.log(`   時間差: ${hoursDiff.toFixed(2)} 小時`)
          })
      }
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 實際上傳時間檢查完成')
  }
}

checkActualUploadTimes()
