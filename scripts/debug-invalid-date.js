const https = require('https')
const http = require('http')

const debugInvalidDate = async () => {
  console.log('🔍 調試 Invalid Date 問題')
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
        console.log(`completed_at 類型: ${typeof latestResult.completed_at}`)
        
        // 測試不同的解析方式
        console.log('\n📊 測試時間解析:')
        
        // 方式1：直接解析
        const directParse = new Date(latestResult.completed_at)
        console.log(`直接解析: ${directParse.toISOString()} (${directParse.toString()})`)
        
        // 方式2：添加 Z 後解析
        const withZ = new Date(latestResult.completed_at + 'Z')
        console.log(`添加 Z 後解析: ${withZ.toISOString()} (${withZ.toString()})`)
        
        // 方式3：檢查是否為有效日期
        console.log(`直接解析是否有效: ${!isNaN(directParse.getTime())}`)
        console.log(`添加 Z 後是否有效: ${!isNaN(withZ.getTime())}`)
        
        // 測試台灣時間轉換
        if (!isNaN(withZ.getTime())) {
          const taiwanTime = withZ.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
          console.log(`台灣時間: ${taiwanTime}`)
        }
        
        // 檢查時間格式
        console.log('\n📊 時間格式分析:')
        console.log(`原始格式: "${latestResult.completed_at}"`)
        console.log(`長度: ${latestResult.completed_at.length}`)
        console.log(`包含 T: ${latestResult.completed_at.includes('T')}`)
        console.log(`包含 Z: ${latestResult.completed_at.includes('Z')}`)
        console.log(`包含空格: ${latestResult.completed_at.includes(' ')}`)
      }
    }

  } catch (error) {
    console.error('❌ 調試失敗:', error.message)
  } finally {
    console.log('\n✅ Invalid Date 問題調試完成')
  }
}

debugInvalidDate()
