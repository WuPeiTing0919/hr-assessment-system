const https = require('https')
const http = require('http')

const testFixedDimensionDisplay = async () => {
  console.log('🧪 測試修正後的維度分數顯示')
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

        // 4. 模擬新的維度分數計算
        console.log('\n📊 4. 模擬新的維度分數計算...')
        
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

        // 計算新的維度分數結構
        const calculatedDimensionScores = {
          innovation: { percentage: 0, rawScore: 0, maxScore: 0 },
          imagination: { percentage: 0, rawScore: 0, maxScore: 0 },
          flexibility: { percentage: 0, rawScore: 0, maxScore: 0 },
          originality: { percentage: 0, rawScore: 0, maxScore: 0 }
        }
        
        Object.keys(dimensionScores).forEach(category => {
          const { total, count } = dimensionScores[category]
          const maxScore = count * 5
          const percentage = count > 0 ? Math.round((total / maxScore) * 100) : 0
          
          calculatedDimensionScores[category] = {
            percentage: percentage,
            rawScore: total,
            maxScore: maxScore
          }
        })

        console.log('\n📈 新的維度分數結構:')
        Object.entries(calculatedDimensionScores).forEach(([category, data]) => {
          console.log(`${category}:`)
          console.log(`  百分比: ${data.percentage}%`)
          console.log(`  原始分數: ${data.rawScore}`)
          console.log(`  滿分: ${data.maxScore}`)
          console.log(`  顯示: ${data.rawScore}/${data.maxScore} 分`)
        })

        // 5. 模擬 categoryResults 計算
        console.log('\n📊 5. 模擬 categoryResults 計算...')
        
        const dimensionNames = {
          innovation: '創新能力',
          imagination: '想像力',
          flexibility: '靈活性',
          originality: '原創性'
        }
        
        const categoryResults = Object.entries(calculatedDimensionScores).map(([key, data]) => ({
          category: key,
          name: dimensionNames[key],
          score: data.percentage,
          rawScore: data.rawScore,
          maxRawScore: data.maxScore
        }))

        console.log('\n📈 categoryResults:')
        categoryResults.forEach(category => {
          console.log(`${category.name}:`)
          console.log(`  分數: ${category.score}分`)
          console.log(`  顯示: ${category.rawScore}/${category.maxRawScore} 分`)
        })

      }
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後的維度分數顯示測試完成')
  }
}

testFixedDimensionDisplay()
