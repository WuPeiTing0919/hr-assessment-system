const { executeQuery } = require('../lib/database/connection')

const checkDbFields = async () => {
  console.log('🔍 檢查資料庫欄位名稱')
  console.log('=' .repeat(40))

  try {
    // 檢查表結構
    console.log('\n📊 檢查 combined_test_results 表結構...')
    const structureQuery = 'DESCRIBE combined_test_results'
    const structure = await executeQuery(structureQuery)
    
    console.log('📋 表欄位:')
    structure.forEach(field => {
      console.log(`  ${field.Field}: ${field.Type}`)
    })
    
    // 檢查實際資料
    console.log('\n📊 檢查實際資料...')
    const dataQuery = 'SELECT id, user_id, logic_score, creativity_score, balance_score, overall_score FROM combined_test_results LIMIT 2'
    const data = await executeQuery(dataQuery)
    
    console.log('📋 實際資料:')
    data.forEach((row, index) => {
      console.log(`\n  記錄 ${index + 1}:`)
      console.log(`    id: ${row.id}`)
      console.log(`    user_id: ${row.user_id}`)
      console.log(`    logic_score: ${row.logic_score}`)
      console.log(`    creativity_score: ${row.creativity_score}`)
      console.log(`    balance_score: ${row.balance_score}`)
      console.log(`    overall_score: ${row.overall_score}`)
    })

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 資料庫欄位檢查完成')
  }
}

checkDbFields()
