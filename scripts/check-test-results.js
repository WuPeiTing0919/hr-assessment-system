const mysql = require('mysql2/promise')

async function checkTestResults() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔍 檢查資料庫中的測試結果...')

  try {
    const connection = await mysql.createConnection(config)
    
    // 檢查 test_results 表中的邏輯測驗結果
    console.log('\n📊 test_results 表中的邏輯測驗結果:')
    const [testResults] = await connection.execute(`
      SELECT id, user_id, test_type, score, total_questions, correct_answers, completed_at, created_at 
      FROM test_results 
      WHERE test_type = 'logic' 
      ORDER BY completed_at DESC 
      LIMIT 10
    `)
    
    if (testResults.length > 0) {
      console.log(`找到 ${testResults.length} 筆邏輯測驗結果:`)
      testResults.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`)
        console.log(`   用戶ID: ${result.user_id}`)
        console.log(`   分數: ${result.score}`)
        console.log(`   答對題數: ${result.correct_answers}/${result.total_questions}`)
        console.log(`   完成時間: ${result.completed_at}`)
        console.log(`   建立時間: ${result.created_at}`)
        console.log('')
      })
    } else {
      console.log('❌ 沒有找到邏輯測驗結果')
    }

    // 檢查 logic_test_answers 表中的答案記錄
    console.log('\n📝 logic_test_answers 表中的答案記錄:')
    const [answerResults] = await connection.execute(`
      SELECT lta.id, lta.test_result_id, lta.question_id, lta.user_answer, lta.is_correct, lta.created_at,
             tr.user_id, tr.score
      FROM logic_test_answers lta
      JOIN test_results tr ON lta.test_result_id = tr.id
      WHERE tr.test_type = 'logic'
      ORDER BY lta.created_at DESC
      LIMIT 20
    `)
    
    if (answerResults.length > 0) {
      console.log(`找到 ${answerResults.length} 筆答案記錄:`)
      answerResults.forEach((answer, index) => {
        console.log(`${index + 1}. 答案ID: ${answer.id}`)
        console.log(`   測試結果ID: ${answer.test_result_id}`)
        console.log(`   用戶ID: ${answer.user_id}`)
        console.log(`   題目ID: ${answer.question_id}`)
        console.log(`   用戶答案: ${answer.user_answer}`)
        console.log(`   是否正確: ${answer.is_correct ? '是' : '否'}`)
        console.log(`   建立時間: ${answer.created_at}`)
        console.log('')
      })
    } else {
      console.log('❌ 沒有找到答案記錄')
    }

    // 檢查最近的測試結果統計
    console.log('\n📈 測試結果統計:')
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_tests,
        AVG(score) as avg_score,
        MAX(score) as max_score,
        MIN(score) as min_score,
        COUNT(CASE WHEN score >= 80 THEN 1 END) as high_scores,
        COUNT(CASE WHEN score < 60 THEN 1 END) as low_scores
      FROM test_results 
      WHERE test_type = 'logic'
    `)
    
    if (stats[0].total_tests > 0) {
      const stat = stats[0]
      console.log(`總測試次數: ${stat.total_tests}`)
      console.log(`平均分數: ${Math.round(stat.avg_score)}`)
      console.log(`最高分數: ${stat.max_score}`)
      console.log(`最低分數: ${stat.min_score}`)
      console.log(`高分數 (≥80): ${stat.high_scores}`)
      console.log(`低分數 (<60): ${stat.low_scores}`)
    } else {
      console.log('❌ 沒有測試結果統計')
    }

    await connection.end()
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkTestResults()
