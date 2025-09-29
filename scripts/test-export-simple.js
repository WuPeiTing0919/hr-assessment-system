const http = require('http')

const testExportSimple = async () => {
  console.log('🔍 測試簡化匯出功能')
  console.log('=' .repeat(30))

  try {
    // 先測試獲取題目資料
    console.log('\n📊 測試獲取邏輯題目資料...')
    const logicResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/questions/logic', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    console.log(`狀態碼: ${logicResponse.status}`)
    
    if (logicResponse.status === 200) {
      const logicData = JSON.parse(logicResponse.data)
      console.log(`成功獲取 ${logicData.data?.length || 0} 道邏輯題目`)
      
      if (logicData.data && logicData.data.length > 0) {
        const firstQuestion = logicData.data[0]
        console.log(`第一題: ${firstQuestion.question?.substring(0, 50)}...`)
        console.log(`選項A: ${firstQuestion.option_a}`)
        console.log(`正確答案: ${firstQuestion.correct_answer}`)
      }
    } else {
      console.log('❌ 獲取邏輯題目失敗')
    }

    // 測試創意題目
    console.log('\n📊 測試獲取創意題目資料...')
    const creativeResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/questions/creative', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    console.log(`狀態碼: ${creativeResponse.status}`)
    
    if (creativeResponse.status === 200) {
      const creativeData = JSON.parse(creativeResponse.data)
      console.log(`成功獲取 ${creativeData.data?.length || 0} 道創意題目`)
      
      if (creativeData.data && creativeData.data.length > 0) {
        const firstQuestion = creativeData.data[0]
        console.log(`第一題: ${firstQuestion.statement?.substring(0, 50)}...`)
        console.log(`類別: ${firstQuestion.category}`)
        console.log(`反向計分: ${firstQuestion.is_reverse}`)
      }
    } else {
      console.log('❌ 獲取創意題目失敗')
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  }
}

testExportSimple()
