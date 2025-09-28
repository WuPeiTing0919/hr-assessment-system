const mysql = require('mysql2/promise')

async function checkCreativeQuestions() {
  const config = {
    host: process.env.DB_HOST || 'mysql.theaken.com',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'hr_assessment',
    password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
    database: process.env.DB_NAME || 'db_hr_assessment',
  }

  console.log('🔄 正在檢查創意能力測試題目...')

  try {
    const connection = await mysql.createConnection(config)
    
    const [rows] = await connection.execute('SELECT * FROM creative_questions ORDER BY id')
    
    console.log(`\n📋 共找到 ${rows.length} 道創意能力測試題目:`)
    console.log('=' .repeat(80))
    
    rows.forEach((question, index) => {
      const reverseText = question.is_reverse ? ' (反向題)' : ''
      console.log(`\n${index + 1}. ID: ${question.id}`)
      console.log(`   題目: ${question.statement}`)
      console.log(`   類別: ${question.category}`)
      console.log(`   反向題: ${question.is_reverse ? '是' : '否'}${reverseText}`)
    })
    
    console.log('\n📊 統計:')
    const reverseCount = rows.filter(q => q.is_reverse).length
    const normalCount = rows.length - reverseCount
    const categoryCount = {}
    rows.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1
    })
    
    console.log(`- 一般題目: ${normalCount} 題`)
    console.log(`- 反向題目: ${reverseCount} 題`)
    console.log('- 類別分布:')
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} 題`)
    })
    
    await connection.end()
    console.log('\n✅ 檢查完成')
  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkCreativeQuestions()
