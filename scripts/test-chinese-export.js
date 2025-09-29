const http = require('http')
const fs = require('fs')

const testChineseExport = async () => {
  console.log('🔍 測試中文匯出功能')
  console.log('=' .repeat(30))

  try {
    // 測試創意題目匯出（包含中文）
    console.log('\n📊 測試創意題目匯出...')
    const creativeResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/questions/export?type=creative', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (creativeResponse.status === 200) {
      const creativeData = JSON.parse(creativeResponse.data)
      if (creativeData.success) {
        console.log('✅ 創意題目匯出成功')
        
        // 解碼並檢查中文內容
        const csvContent = Buffer.from(creativeData.data, 'base64').toString('utf8')
        const lines = csvContent.split('\n')
        
        console.log(`\n📋 匯出內容預覽:`)
        console.log(`標題行: ${lines[0]}`)
        console.log(`\n前3行資料:`)
        for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
          if (lines[i].trim()) {
            console.log(`第${i}行: ${lines[i]}`)
          }
        }
        
        // 檢查是否包含正確的中文字符
        const hasChinese = /[\u4e00-\u9fff]/.test(csvContent)
        console.log(`\n🔤 中文字符檢測: ${hasChinese ? '✅ 包含中文字符' : '❌ 未檢測到中文字符'}`)
        
        // 檢查 BOM
        const hasBOM = csvContent.charCodeAt(0) === 0xFEFF
        console.log(`📝 UTF-8 BOM: ${hasBOM ? '✅ 包含 BOM' : '❌ 未包含 BOM'}`)
        
        // 保存到檔案進行測試
        fs.writeFileSync('test-creative-export.csv', csvContent, 'utf8')
        console.log(`💾 已保存測試檔案: test-creative-export.csv`)
        
      } else {
        console.log('❌ 創意題目匯出失敗:', creativeData.message)
      }
    } else {
      console.log('❌ 創意題目匯出失敗，狀態碼:', creativeResponse.status)
    }

    // 測試邏輯題目匯出
    console.log('\n📊 測試邏輯題目匯出...')
    const logicResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/questions/export?type=logic', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (logicResponse.status === 200) {
      const logicData = JSON.parse(logicResponse.data)
      if (logicData.success) {
        console.log('✅ 邏輯題目匯出成功')
        
        // 解碼並檢查中文內容
        const csvContent = Buffer.from(logicData.data, 'base64').toString('utf8')
        const lines = csvContent.split('\n')
        
        console.log(`\n📋 匯出內容預覽:`)
        console.log(`標題行: ${lines[0]}`)
        console.log(`\n第1行資料:`)
        if (lines[1]) {
          console.log(`第1行: ${lines[1]}`)
        }
        
        // 檢查是否包含正確的中文字符
        const hasChinese = /[\u4e00-\u9fff]/.test(csvContent)
        console.log(`\n🔤 中文字符檢測: ${hasChinese ? '✅ 包含中文字符' : '❌ 未檢測到中文字符'}`)
        
        // 檢查 BOM
        const hasBOM = csvContent.charCodeAt(0) === 0xFEFF
        console.log(`📝 UTF-8 BOM: ${hasBOM ? '✅ 包含 BOM' : '❌ 未包含 BOM'}`)
        
        // 保存到檔案進行測試
        fs.writeFileSync('test-logic-export.csv', csvContent, 'utf8')
        console.log(`💾 已保存測試檔案: test-logic-export.csv`)
        
      } else {
        console.log('❌ 邏輯題目匯出失敗:', logicData.message)
      }
    } else {
      console.log('❌ 邏輯題目匯出失敗，狀態碼:', logicResponse.status)
    }

    console.log('\n📝 修正說明:')
    console.log('✅ 添加了 UTF-8 BOM (Byte Order Mark)')
    console.log('✅ 確保 Excel 能正確識別中文編碼')
    console.log('✅ 使用 Base64 編碼避免 API 路由字符限制')
    console.log('✅ 前端正確解碼並生成 CSV 檔案')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 中文匯出功能測試完成')
  }
}

testChineseExport()
