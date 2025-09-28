const https = require('https')
const http = require('http')

const testCreativeDBUpload = async () => {
  console.log('🧪 測試創意測驗資料庫上傳功能')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd' // 使用現有用戶ID
  const url = 'http://localhost:3000/api/test-results/creative'

  // 模擬創意測驗答案（1-5分，包含反向題）
  const testAnswers = [
    5, 4, 3, 2, 1, // 前5題正常題
    1, 2, 3, 4, 5, // 中間5題反向題（會自動反轉）
    5, 4, 3, 2, 1, // 後8題正常題
    1, 2, 3, 4, 5
  ]

  const testData = {
    userId: userId,
    answers: testAnswers,
    completedAt: new Date().toISOString().replace('Z', '').replace('T', ' ')
  }

  console.log('\n📝 測試數據:')
  console.log('用戶ID:', testData.userId)
  console.log('答案數量:', testData.answers.length)
  console.log('答案內容:', testData.answers)
  console.log('完成時間:', testData.completedAt)

  try {
    console.log('\n🔄 測試創意測驗 API...')
    
    const response = await new Promise((resolve, reject) => {
      const req = http.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
      req.write(JSON.stringify(testData))
      req.end()
    })

    console.log('📊 響應狀態:', response.status)
    
    if (response.status === 200) {
      const result = JSON.parse(response.data)
      console.log('\n✅ API 測試成功!')
      console.log('📡 響應內容:', JSON.stringify(result, null, 2))
      
      if (result.success) {
        console.log('\n📈 測試結果詳情:')
        console.log('- 測試結果ID:', result.data.testResult.id)
        console.log('- 分數:', result.data.testResult.score)
        console.log('- 總題數:', result.data.testResult.total_questions)
        console.log('- 總分數:', result.data.testResult.correct_answers)
        console.log('- 答案記錄數量:', result.data.answerCount)
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
    console.log('\n✅ 創意測驗資料庫上傳測試完成')
  }
}

testCreativeDBUpload()
