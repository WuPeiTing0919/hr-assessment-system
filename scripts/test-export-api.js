const http = require('http')

const testExportAPI = async () => {
  console.log('🔍 測試匯出 API')
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
          data: data.substring(0, 200) // 只顯示前200字符
        }))
      })
      req.on('error', reject)
    })

    console.log(`狀態碼: ${logicResponse.status}`)
    console.log(`Content-Type: ${logicResponse.headers['content-type']}`)
    console.log(`Content-Disposition: ${logicResponse.headers['content-disposition']}`)
    console.log(`資料預覽: ${logicResponse.data}`)

    if (logicResponse.status === 500) {
      console.log('❌ 伺服器錯誤，可能是資料庫連接問題')
    } else if (logicResponse.status === 200) {
      console.log('✅ 匯出成功')
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  }
}

testExportAPI()
