const mysql = require('mysql2/promise')

const checkDbTimeFormat = async () => {
  console.log('🔍 檢查資料庫中的時間格式')
  console.log('=' .repeat(50))

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hr_assessment'
  })

  try {
    // 檢查 test_results 表的時間格式
    console.log('\n📊 檢查 test_results 表的時間格式...')
    const [testResults] = await connection.execute(`
      SELECT id, test_type, completed_at, created_at 
      FROM test_results 
      WHERE user_id = 'user-1759073326705-m06y3wacd'
      ORDER BY completed_at DESC
    `)

    testResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.test_type} 測試:`)
      console.log(`   ID: ${result.id}`)
      console.log(`   completed_at (原始): ${result.completed_at}`)
      console.log(`   completed_at (類型): ${typeof result.completed_at}`)
      console.log(`   created_at (原始): ${result.created_at}`)
      console.log(`   created_at (類型): ${typeof result.created_at}`)
      
      // 測試時間轉換
      const completedDate = new Date(result.completed_at)
      const createdDate = new Date(result.created_at)
      
      console.log(`   completed_at 轉換: ${completedDate.toISOString()}`)
      console.log(`   completed_at 台灣時間: ${completedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
      console.log(`   created_at 轉換: ${createdDate.toISOString()}`)
      console.log(`   created_at 台灣時間: ${createdDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    })

    // 檢查 combined_test_results 表的時間格式
    console.log('\n📊 檢查 combined_test_results 表的時間格式...')
    const [combinedResults] = await connection.execute(`
      SELECT id, completed_at, created_at 
      FROM combined_test_results 
      WHERE user_id = 'user-1759073326705-m06y3wacd'
      ORDER BY completed_at DESC
    `)

    combinedResults.forEach((result, index) => {
      console.log(`\n${index + 1}. 綜合測試:`)
      console.log(`   ID: ${result.id}`)
      console.log(`   completed_at (原始): ${result.completed_at}`)
      console.log(`   completed_at (類型): ${typeof result.completed_at}`)
      console.log(`   created_at (原始): ${result.created_at}`)
      console.log(`   created_at (類型): ${typeof result.created_at}`)
      
      // 測試時間轉換
      const completedDate = new Date(result.completed_at)
      const createdDate = new Date(result.created_at)
      
      console.log(`   completed_at 轉換: ${completedDate.toISOString()}`)
      console.log(`   completed_at 台灣時間: ${completedDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
      console.log(`   created_at 轉換: ${createdDate.toISOString()}`)
      console.log(`   created_at 台灣時間: ${createdDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    })

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    await connection.end()
    console.log('\n✅ 資料庫時間格式檢查完成')
  }
}

checkDbTimeFormat()
