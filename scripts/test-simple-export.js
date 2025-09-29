const http = require('http')

const testSimpleExport = async () => {
  console.log('🔍 測試簡化匯出功能')
  console.log('=' .repeat(30))

  try {
    // 測試邏輯題目匯出
    console.log('\n📊 測試邏輯題目匯出...')
    const logicResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/questions/export?type=logic', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          headers: res.headers,
          dataLength: data.length,
          contentType: res.headers['content-type']
        }))
      })
      req.on('error', reject)
    })

    console.log(`狀態碼: ${logicResponse.status}`)
    console.log(`Content-Type: ${logicResponse.contentType}`)
    console.log(`資料長度: ${logicResponse.dataLength}`)

    if (logicResponse.status === 200) {
      console.log('✅ 邏輯題目匯出成功')
    } else {
      console.log('❌ 邏輯題目匯出失敗')
    }

    // 測試創意題目匯出
    console.log('\n📊 測試創意題目匯出...')
    const creativeResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/questions/export?type=creative', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          headers: res.headers,
          dataLength: data.length,
          contentType: res.headers['content-type']
        }))
      })
      req.on('error', reject)
    })

    console.log(`狀態碼: ${creativeResponse.status}`)
    console.log(`Content-Type: ${creativeResponse.contentType}`)
    console.log(`資料長度: ${creativeResponse.dataLength}`)

    if (creativeResponse.status === 200) {
      console.log('✅ 創意題目匯出成功')
    } else {
      console.log('❌ 創意題目匯出失敗')
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  }
}

testSimpleExport()
