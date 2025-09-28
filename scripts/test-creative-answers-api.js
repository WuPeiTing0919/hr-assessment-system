const https = require('https')
const http = require('http')

const testCreativeAnswersAPI = async () => {
  console.log('🧪 測試創意測驗答案 API')
  console.log('=' .repeat(50))

  const testResultId = 'test_1759086508812_xv2pof6lk' // 使用最新的測試結果ID
  const url = `http://localhost:3000/api/creative-test-answers?testResultId=${testResultId}`

  try {
    console.log(`\n📊 測試結果ID: ${testResultId}`)
    console.log(`🔗 API URL: ${url}`)
    
    const response = await new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    console.log('📊 響應狀態:', response.status)
    
    if (response.status === 200) {
      const result = JSON.parse(response.data)
      console.log('\n✅ API 測試成功!')
      console.log('📡 響應內容:', JSON.stringify(result, null, 2))
      
      if (result.success) {
        console.log(`\n📈 答案記錄詳情:`)
        console.log(`- 答案數量: ${result.data.length}`)
        
        // 按維度分組統計
        const dimensionStats = {
          innovation: { total: 0, count: 0 },
          imagination: { total: 0, count: 0 },
          flexibility: { total: 0, count: 0 },
          originality: { total: 0, count: 0 }
        }
        
        result.data.forEach((answer, index) => {
          console.log(`${index + 1}. 題目ID: ${answer.question_id}, 用戶答案: ${answer.user_answer}, 計算分數: ${answer.score}`)
        })
      }
    } else {
      console.log('❌ API 響應失敗，狀態碼:', response.status)
      console.log('響應內容:', response.data)
    }

  } catch (error) {
    console.error('\n❌ 請求失敗:')
    console.error('錯誤類型:', error.name)
    console.error('錯誤訊息:', error.message)
  } finally {
    console.log('\n✅ 創意測驗答案 API 測試完成')
  }
}

testCreativeAnswersAPI()
