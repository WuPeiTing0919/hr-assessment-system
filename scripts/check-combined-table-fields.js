const { executeQuery } = require('../lib/database/connection')

const checkCombinedTableFields = async () => {
  console.log('🔍 檢查 combined_test_results 表的實際欄位')
  console.log('=' .repeat(50))

  try {
    // 檢查表結構
    console.log('\n📊 檢查表結構...')
    const structureQuery = 'DESCRIBE combined_test_results'
    const structure = await executeQuery(structureQuery)
    
    console.log('📋 表欄位:')
    structure.forEach(field => {
      console.log(`  ${field.Field}: ${field.Type} ${field.Null === 'YES' ? '(可為空)' : '(不可為空)'}`)
    })
    
    // 檢查實際資料
    console.log('\n📊 檢查實際資料...')
    const dataQuery = 'SELECT * FROM combined_test_results LIMIT 2'
    const data = await executeQuery(dataQuery)
    
    console.log('📋 實際資料:')
    data.forEach((row, index) => {
      console.log(`\n  記錄 ${index + 1}:`)
      Object.keys(row).forEach(key => {
        console.log(`    ${key}: ${row[key]}`)
      })
    })

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 資料庫欄位檢查完成')
  }
}

checkCombinedTableFields()
