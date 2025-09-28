const mysql = require('mysql2/promise')

async function checkLogicQuestions() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔄 正在檢查邏輯思維題目...')

  try {
    const connection = await mysql.createConnection(config)
    
    const [rows] = await connection.execute('SELECT * FROM logic_questions ORDER BY id')
    
    console.log(`\n📋 共找到 ${rows.length} 道邏輯思維題目:`)
    console.log('=' .repeat(80))
    
    rows.forEach((question, index) => {
      console.log(`\n${index + 1}. ID: ${question.id}`)
      console.log(`   題目: ${question.question}`)
      console.log(`   A. ${question.option_a}`)
      console.log(`   B. ${question.option_b}`)
      console.log(`   C. ${question.option_c}`)
      console.log(`   D. ${question.option_d}`)
      if (question.option_e) {
        console.log(`   E. ${question.option_e}`)
      }
      console.log(`   正確答案: ${question.correct_answer}`)
      if (question.explanation) {
        console.log(`   解說: ${question.explanation}`)
      }
    })
    
    await connection.end()
    console.log('\n✅ 檢查完成')
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkLogicQuestions()
