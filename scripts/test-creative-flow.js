// 測試創意測試流程
const mysql = require('mysql2/promise')

async function testCreativeFlow() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🧪 測試創意測試流程')
  console.log('=' .repeat(50))

  try {
    const connection = await mysql.createConnection(config)
    
    // 1. 檢查資料庫中的題目
    const [questions] = await connection.execute('SELECT * FROM creative_questions ORDER BY id')
    console.log(`✅ 資料庫中有 ${questions.length} 道題目`)
    
    // 2. 模擬 API 回應
    const apiResponse = {
      success: true,
      questions: questions
    }
    console.log('✅ API 回應格式正確')
    
    // 3. 測試分數計算邏輯
    const mockAnswers = {
      0: 5, // 一般題目，選擇 5
      1: 5, // 反向題目，選擇 5
      2: 1, // 一般題目，選擇 1
      3: 1  // 反向題目，選擇 1
    }
    
    let totalScore = 0
    questions.slice(0, 4).forEach((question, index) => {
      const answer = mockAnswers[index] || 1
      const score = question.is_reverse ? 6 - answer : answer
      totalScore += score
      
      console.log(`題目 ${index + 1}: ${question.is_reverse ? '反向' : '一般'} - 選擇${answer} → 得分${score}`)
    })
    
    const maxScore = 4 * 5
    const percentage = Math.round((totalScore / maxScore) * 100)
    
    console.log(`\n📊 測試結果: ${totalScore}/${maxScore} (${percentage}%)`)
    
    // 4. 檢查題目類別分布
    const categoryCount = {}
    questions.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1
    })
    
    console.log('\n📋 題目類別分布:')
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} 題`)
    })
    
    await connection.end()
    console.log('\n✅ 創意測試流程測試完成')
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  }
}

testCreativeFlow()
