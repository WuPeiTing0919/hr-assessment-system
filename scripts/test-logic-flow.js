const fetch = require('node-fetch').default || require('node-fetch')

async function testLogicFlow() {
  console.log('🔄 正在測試邏輯思維測試完整流程...')
  
  try {
    // 1. 測試獲取題目 API
    console.log('\n1. 測試獲取題目 API...')
    const questionsResponse = await fetch('http://localhost:3000/api/logic-questions')
    const questionsData = await questionsResponse.json()
    
    if (questionsData.success) {
      console.log(`✅ 成功獲取 ${questionsData.questions.length} 道題目`)
      
      // 檢查第一道題目是否包含 E 選項
      const firstQuestion = questionsData.questions[0]
      if (firstQuestion.option_e) {
        console.log('✅ 題目包含 E 選項')
        console.log(`   範例：${firstQuestion.question.substring(0, 30)}...`)
        console.log(`   E 選項：${firstQuestion.option_e}`)
      } else {
        console.log('❌ 題目缺少 E 選項')
      }
    } else {
      console.log('❌ 獲取題目失敗:', questionsData.error)
    }
    
    // 2. 模擬測試結果
    console.log('\n2. 模擬測試結果...')
    const mockResults = {
      type: "logic",
      score: 60,
      correctAnswers: 6,
      totalQuestions: 10,
      answers: {
        0: "C",
        1: "C", 
        2: "B",
        3: "B",
        4: "E",
        5: "B",
        6: "E",
        7: "A",
        8: "C",
        9: "D"
      },
      completedAt: new Date().toISOString()
    }
    
    console.log('✅ 模擬測試結果已準備')
    console.log(`   答對題數：${mockResults.correctAnswers}/${mockResults.totalQuestions}`)
    console.log(`   正確率：${mockResults.score}%`)
    
    // 3. 檢查結果頁面需要的數據結構
    console.log('\n3. 檢查數據結構...')
    const hasAllRequiredFields = questionsData.questions.every(q => 
      q.question && 
      q.option_a && 
      q.option_b && 
      q.option_c && 
      q.option_d && 
      q.option_e && 
      q.correct_answer && 
      q.explanation
    )
    
    if (hasAllRequiredFields) {
      console.log('✅ 所有題目都包含完整字段')
    } else {
      console.log('❌ 部分題目缺少必要字段')
    }
    
    console.log('\n✅ 邏輯思維測試流程驗證完成')
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  }
}

testLogicFlow()
