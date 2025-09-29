const { executeQuery } = require('../lib/database/connection')

async function checkCombinedTestResultsTable() {
  console.log('🔍 檢查 combined_test_results 表結構...')
  console.log('=' .repeat(50))

  try {
    // 檢查表結構
    console.log('\n📊 combined_test_results 表結構:')
    const columns = await executeQuery('DESCRIBE combined_test_results')
    columns.forEach(column => {
      console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Key ? `(${column.Key})` : ''}`)
    })

    // 檢查表數據
    console.log('\n📋 combined_test_results 表數據:')
    const rows = await executeQuery('SELECT * FROM combined_test_results LIMIT 5')
    if (rows.length > 0) {
      console.log(`找到 ${rows.length} 筆記錄:`)
      rows.forEach((row, index) => {
        console.log(`\n記錄 ${index + 1}:`)
        Object.entries(row).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`)
        })
      })
    } else {
      console.log('表中沒有數據')
    }

    // 檢查表索引
    console.log('\n🔍 表索引:')
    const indexes = await executeQuery('SHOW INDEX FROM combined_test_results')
    indexes.forEach(index => {
      console.log(`- ${index.Key_name}: ${index.Column_name} (${index.Index_type})`)
    })

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  }
}

checkCombinedTestResultsTable()