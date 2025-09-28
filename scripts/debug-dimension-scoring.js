const https = require('https')
const http = require('http')

const debugDimensionScoring = async () => {
  console.log('🔍 調試維度分數計算')
  console.log('=' .repeat(50))

  const testResultId = 'test_1759086508812_xv2pof6lk' // 使用最新的測試結果ID

  try {
    // 1. 獲取測試結果
    console.log('\n📊 1. 獲取測試結果...')
    const resultResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/creative?userId=user-1759073326705-m06y3wacd`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (resultResponse.status === 200) {
      const resultData = JSON.parse(resultResponse.data)
      if (resultData.success && resultData.data.length > 0) {
        const testResult = resultData.data[0]
        console.log('測試結果:', {
          id: testResult.id,
          score: testResult.score,
          total_questions: testResult.total_questions,
          correct_answers: testResult.correct_answers
        })
      }
    }

    // 2. 獲取題目資料
    console.log('\n📊 2. 獲取題目資料...')
    const questionsResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/creative-questions', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    let questions = []
    if (questionsResponse.status === 200) {
      const questionsData = JSON.parse(questionsResponse.data)
      if (questionsData.success) {
        questions = questionsData.questions
        console.log(`獲取到 ${questions.length} 個題目`)
      }
    }

    // 3. 獲取詳細答案
    console.log('\n📊 3. 獲取詳細答案...')
    const answersResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/creative-test-answers?testResultId=${testResultId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    if (answersResponse.status === 200) {
      const answersData = JSON.parse(answersResponse.data)
      if (answersData.success) {
        const answers = answersData.data
        console.log(`獲取到 ${answers.length} 個答案`)

        // 4. 按維度分組計算
        console.log('\n📊 4. 按維度分組計算...')
        const dimensionScores = {
          innovation: { total: 0, count: 0, answers: [] },
          imagination: { total: 0, count: 0, answers: [] },
          flexibility: { total: 0, count: 0, answers: [] },
          originality: { total: 0, count: 0, answers: [] }
        }

        answers.forEach((answer) => {
          const question = questions.find(q => q.id === answer.question_id)
          if (question && dimensionScores[question.category]) {
            dimensionScores[question.category].total += answer.score
            dimensionScores[question.category].count += 1
            dimensionScores[question.category].answers.push({
              question_id: answer.question_id,
              user_answer: answer.user_answer,
              score: answer.score,
              is_reverse: question.is_reverse
            })
          }
        })

        // 5. 顯示詳細計算過程
        console.log('\n📊 5. 詳細計算過程:')
        Object.keys(dimensionScores).forEach(category => {
          const { total, count, answers } = dimensionScores[category]
          const maxPossible = count * 5
          const percentage = count > 0 ? Math.round((total / maxPossible) * 100) : 0
          
          console.log(`\n${category}:`)
          console.log(`  題目數量: ${count}`)
          console.log(`  總分數: ${total}`)
          console.log(`  最大可能分數: ${maxPossible}`)
          console.log(`  百分比: ${percentage}%`)
          console.log(`  答案詳情:`)
          answers.forEach((ans, index) => {
            console.log(`    ${index + 1}. 題目${ans.question_id}: 用戶答案${ans.user_answer} → 計算分數${ans.score} (反向題: ${ans.is_reverse ? '是' : '否'})`)
          })
        })

        // 6. 總分驗證
        console.log('\n📊 6. 總分驗證:')
        const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
        const maxTotalScore = answers.length * 5
        const totalPercentage = Math.round((totalScore / maxTotalScore) * 100)
        console.log(`所有答案總分數: ${totalScore}`)
        console.log(`最大可能總分數: ${maxTotalScore}`)
        console.log(`總百分比: ${totalPercentage}%`)

      }
    }

  } catch (error) {
    console.error('❌ 調試失敗:', error.message)
  } finally {
    console.log('\n✅ 維度分數計算調試完成')
  }
}

debugDimensionScoring()
