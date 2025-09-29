const http = require('http')

const testFixedExport = async () => {
  console.log('🔍 測試修復後的匯出功能')
  console.log('=' .repeat(40))

  try {
    // 測試基本匯出
    console.log('\n📊 測試修復後的匯出...')
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results/export', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (response.status === 200) {
      const data = JSON.parse(response.data)
      if (data.success) {
        console.log('✅ 匯出成功')
        
        // 解碼並檢查 CSV 內容
        const binaryString = Buffer.from(data.data, 'base64').toString('binary')
        const csvContent = Buffer.from(binaryString, 'binary').toString('utf-8')
        const lines = csvContent.split('\n')
        
        console.log(`📊 總行數: ${lines.length}`)
        console.log('\n📋 檢查詳細資料欄位:')
        
        let hasUndefined = false
        let combinedCount = 0
        let logicCount = 0
        let creativeCount = 0
        
        lines.forEach((line, index) => {
          if (index === 0) return // 跳過標題行
          
          const columns = line.split(',')
          if (columns.length >= 8) {
            const testType = columns[3].replace(/"/g, '')
            const details = columns[7].replace(/"/g, '')
            
            if (testType === '綜合能力') {
              combinedCount++
              console.log(`  綜合能力測試 ${combinedCount}: ${details}`)
              if (details.includes('undefined')) {
                hasUndefined = true
                console.log(`    ❌ 發現 undefined: ${details}`)
              } else {
                console.log(`    ✅ 無 undefined`)
              }
            } else if (testType === '邏輯思維') {
              logicCount++
              console.log(`  邏輯思維測試 ${logicCount}: ${details}`)
            } else if (testType === '創意能力') {
              creativeCount++
              console.log(`  創意能力測試 ${creativeCount}: ${details}`)
            }
          }
        })
        
        console.log('\n📊 統計:')
        console.log(`  綜合能力測試: ${combinedCount} 筆`)
        console.log(`  邏輯思維測試: ${logicCount} 筆`)
        console.log(`  創意能力測試: ${creativeCount} 筆`)
        
        if (hasUndefined) {
          console.log('\n❌ 仍然發現 undefined 值')
        } else {
          console.log('\n✅ 所有詳細資料欄位都沒有 undefined 值')
        }
        
        // 檢查特定修復
        console.log('\n🔧 檢查修復項目:')
        const hasUndefinedInCombined = csvContent.includes('undefined')
        const hasNoDataPlaceholder = csvContent.includes('無資料')
        
        console.log(`  包含 undefined: ${hasUndefinedInCombined ? '是' : '否'}`)
        console.log(`  包含「無資料」: ${hasNoDataPlaceholder ? '是' : '否'}`)
        
        if (!hasUndefinedInCombined && hasNoDataPlaceholder) {
          console.log('✅ 修復成功！undefined 已被替換為「無資料」')
        } else if (hasUndefinedInCombined) {
          console.log('❌ 修復失敗，仍有 undefined 值')
        }
        
      } else {
        console.log('❌ 匯出失敗:', data.message)
      }
    } else {
      console.log('❌ 匯出失敗，狀態碼:', response.status)
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修復後匯出功能測試完成')
  }
}

testFixedExport()
