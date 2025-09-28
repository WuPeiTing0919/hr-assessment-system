const mysql = require('mysql2/promise')

async function checkCreativeTestResults() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔍 檢查創意測驗結果...')

  let connection
  try {
    connection = await mysql.createConnection(config)

    // 檢查 test_results 表中的創意測驗結果
    const [creativeResults] = await connection.execute(
      `SELECT tr.*, u.name as user_name
       FROM test_results tr
       JOIN users u ON tr.user_id = u.id
       WHERE tr.test_type = 'creative'
       ORDER BY tr.completed_at DESC`
    )

    console.log('\n📊 test_results 表中的創意測驗結果:')
    if (creativeResults.length > 0) {
      console.log(`找到 ${creativeResults.length} 筆創意測驗結果:`)
      creativeResults.forEach((result, index) => {
        console.log(`${index + 1}. ID: ${result.id}`)
        console.log(`   用戶ID: ${result.user_id}`)
        console.log(`   用戶名稱: ${result.user_name}`)
        console.log(`   分數: ${result.score}`)
        console.log(`   總分數: ${result.correct_answers}`)
        console.log(`   總題數: ${result.total_questions}`)
        console.log(`   完成時間: ${new Date(result.completed_at)}`)
        console.log(`   建立時間: ${new Date(result.created_at)}`)
        console.log('')
      })
    } else {
      console.log('❌ 沒有找到創意測驗結果')
    }

    // 檢查 creative_test_answers 表中的答案記錄
    const [answerRecords] = await connection.execute(
      `SELECT cta.*, u.id as user_id, cq.statement as question_text, cq.is_reverse
       FROM creative_test_answers cta
       JOIN test_results tr ON cta.test_result_id = tr.id
       JOIN users u ON tr.user_id = u.id
       JOIN creative_questions cq ON cta.question_id = cq.id
       ORDER BY cta.created_at ASC
       LIMIT 10`
    )

    console.log('\n📝 creative_test_answers 表中的答案記錄 (前10筆):')
    if (answerRecords.length > 0) {
      console.log(`找到 ${answerRecords.length} 筆答案記錄:`)
      answerRecords.forEach((record, index) => {
        console.log(`${index + 1}. 答案ID: ${record.id}`)
        console.log(`   測試結果ID: ${record.test_result_id}`)
        console.log(`   用戶ID: ${record.user_id}`)
        console.log(`   題目ID: ${record.question_id}`)
        console.log(`   題目: ${record.question_text}`)
        console.log(`   用戶答案: ${record.user_answer}`)
        console.log(`   計算分數: ${record.score}`)
        console.log(`   是否反向題: ${record.is_reverse ? '是' : '否'}`)
        console.log(`   建立時間: ${new Date(record.created_at)}`)
        console.log('')
      })
    } else {
      console.log('❌ 沒有找到答案記錄')
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

checkCreativeTestResults()
