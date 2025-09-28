const testDBModels = async () => {
  console.log('🧪 測試資料庫模型')
  console.log('=' .repeat(50))

  try {
    // 動態導入 ES 模組
    const testResultModule = await import('../lib/database/models/test_result.ts')
    const logicAnswerModule = await import('../lib/database/models/logic_test_answer.ts')
    const logicQuestionModule = await import('../lib/database/models/logic_question.ts')

    console.log('✅ 成功導入資料庫模型')
    console.log('testResultModule exports:', Object.keys(testResultModule))
    console.log('logicAnswerModule exports:', Object.keys(logicAnswerModule))
    console.log('logicQuestionModule exports:', Object.keys(logicQuestionModule))

    const { createTestResult } = testResultModule
    const { createLogicTestAnswers } = logicAnswerModule
    const { getAllLogicQuestions } = logicQuestionModule

    // 測試獲取邏輯題目
    console.log('\n📝 測試獲取邏輯題目...')
    const questions = await getAllLogicQuestions()
    console.log(`找到 ${questions.length} 題邏輯題目`)

    if (questions.length > 0) {
      console.log('第一題:', {
        id: questions[0].id,
        question: questions[0].question.substring(0, 50) + '...',
        correct_answer: questions[0].correct_answer
      })
    }

    // 測試建立測試結果
    console.log('\n📊 測試建立測試結果...')
    const testResultData = {
      user_id: 'test_user_123',
      test_type: 'logic',
      score: 80,
      total_questions: 10,
      correct_answers: 8,
      completed_at: new Date().toISOString()
    }

    const testResult = await createTestResult(testResultData)
    if (testResult) {
      console.log('✅ 測試結果建立成功:', testResult.id)
      
      // 測試建立答案記錄
      console.log('\n📝 測試建立答案記錄...')
      const answerData = [
        {
          test_result_id: testResult.id,
          question_id: questions[0].id,
          user_answer: 'A',
          is_correct: true
        }
      ]

      const answers = await createLogicTestAnswers(answerData)
      console.log(`✅ 答案記錄建立成功: ${answers.length} 筆`)
    } else {
      console.log('❌ 測試結果建立失敗')
    }

  } catch (error) {
    console.log('❌ 測試失敗:', error.message)
    console.log('錯誤詳情:', error.stack)
  }

  console.log('\n✅ 資料庫模型測試完成')
}

testDBModels()
