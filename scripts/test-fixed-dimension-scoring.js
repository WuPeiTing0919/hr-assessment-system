const https = require('https')
const http = require('http')

const testFixedDimensionScoring = async () => {
  console.log('🧪 測試修正後的維度分數計算')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'
  const testResultId = 'test_1759086508812_xv2pof6lk'

  try {
    // 1. 獲取測試結果
    console.log('\n📊 1. 獲取測試結果...')
    const resultResponse = await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:3000/api/test-results/creative?userId=${userId}`, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      req.on('error', reject)
    })

    let testResult = null
    if (resultResponse.status === 200) {
      const resultData = JSON.parse(resultResponse.data)
      if (resultData.success && resultData.data.length > 0) {
        testResult = resultData.data[0]
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

        // 4. 模擬結果頁面的維度分數計算
        console.log('\n📊 4. 模擬結果頁面的維度分數計算...')
        
        // 計算各維度分數（模擬資料庫計算）
        const dimensionScores = {
          innovation: { total: 0, count: 0 },
          imagination: { total: 0, count: 0 },
          flexibility: { total: 0, count: 0 },
          originality: { total: 0, count: 0 }
        }

        answers.forEach((answer) => {
          const question = questions.find(q => q.id === answer.question_id)
          if (question && dimensionScores[question.category]) {
            dimensionScores[question.category].total += answer.score
            dimensionScores[question.category].count += 1
          }
        })

        // 計算百分比分數
        const calculatedDimensionScores = {
          innovation: 0,
          imagination: 0,
          flexibility: 0,
          originality: 0
        }
        
        Object.keys(dimensionScores).forEach(category => {
          const { total, count } = dimensionScores[category]
          calculatedDimensionScores[category] = 
            count > 0 ? Math.round((total / (count * 5)) * 100) : 0
        })

        console.log('\n📈 計算結果:')
        console.log('創新能力:', calculatedDimensionScores.innovation + '%')
        console.log('想像力:', calculatedDimensionScores.imagination + '%')
        console.log('靈活性:', calculatedDimensionScores.flexibility + '%')
        console.log('原創性:', calculatedDimensionScores.originality + '%')

        // 5. 模擬結果頁面的 categoryResults 計算
        console.log('\n📊 5. 模擬結果頁面的 categoryResults 計算...')
        
        const dimensionNames = {
          innovation: '創新能力',
          imagination: '想像力',
          flexibility: '靈活性',
          originality: '原創性'
        }
        
        const categoryResults = Object.entries(calculatedDimensionScores).map(([key, score]) => ({
          category: key,
          name: dimensionNames[key],
          score: score,
          rawScore: 0,
          maxRawScore: 0
        }))

        console.log('\n📈 categoryResults:')
        categoryResults.forEach(category => {
          console.log(`${category.name}: ${category.score}分`)
        })

        // 6. 驗證總分一致性
        console.log('\n📊 6. 驗證總分一致性...')
        const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
        const maxTotalScore = answers.length * 5
        const totalPercentage = Math.round((totalScore / maxTotalScore) * 100)
        
        console.log(`資料庫總分數: ${testResult.correct_answers}`)
        console.log(`計算總分數: ${totalScore}`)
        console.log(`資料庫百分比: ${testResult.score}%`)
        console.log(`計算百分比: ${totalPercentage}%`)
        console.log(`一致性: ${testResult.correct_answers === totalScore && testResult.score === totalPercentage ? '✅ 一致' : '❌ 不一致'}`)

      }
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後的維度分數計算測試完成')
  }
}

testFixedDimensionScoring()
