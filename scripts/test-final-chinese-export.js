const http = require('http')
const fs = require('fs')

const testFinalChineseExport = async () => {
  console.log('🎉 最終中文匯出功能測試')
  console.log('=' .repeat(40))

  try {
    // 測試創意題目匯出
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
        
        // 解碼 Base64 資料
        const binaryString = Buffer.from(creativeData.data, 'base64').toString('binary')
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        // 檢查 BOM
        const hasBOM = bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF
        console.log(`📝 UTF-8 BOM: ${hasBOM ? '✅' : '❌'}`)
        
        // 解碼為文字
        const csvContent = new TextDecoder('utf-8').decode(bytes)
        const hasChinese = /[\u4e00-\u9fff]/.test(csvContent)
        console.log(`🔤 中文字符: ${hasChinese ? '✅' : '❌'}`)
        
        // 顯示內容
        const lines = csvContent.split('\n')
        console.log(`📊 總行數: ${lines.length}`)
        console.log(`📋 標題: ${lines[0]}`)
        console.log(`📝 範例: ${lines[1]?.substring(0, 60)}...`)
        
        // 保存測試檔案
        fs.writeFileSync('test-final-creative.csv', csvContent, 'utf8')
        console.log(`💾 已保存測試檔案: test-final-creative.csv`)
        
        // 檢查檔案開頭
        const fileContent = fs.readFileSync('test-final-creative.csv', 'utf8')
        const fileHasBOM = fileContent.charCodeAt(0) === 0xFEFF
        console.log(`📁 檔案 BOM: ${fileHasBOM ? '✅' : '❌'}`)
        
        if (hasBOM && hasChinese && fileHasBOM) {
          console.log('\n🎉 完美！Excel 應該能正確顯示中文了！')
        } else {
          console.log('\n⚠️ 還有問題需要修正')
        }
      }
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
        
        // 解碼 Base64 資料
        const binaryString = Buffer.from(logicData.data, 'base64').toString('binary')
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        // 檢查 BOM
        const hasBOM = bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF
        console.log(`📝 UTF-8 BOM: ${hasBOM ? '✅' : '❌'}`)
        
        // 解碼為文字
        const csvContent = new TextDecoder('utf-8').decode(bytes)
        const hasChinese = /[\u4e00-\u9fff]/.test(csvContent)
        console.log(`🔤 中文字符: ${hasChinese ? '✅' : '❌'}`)
        
        // 顯示內容
        const lines = csvContent.split('\n')
        console.log(`📊 總行數: ${lines.length}`)
        console.log(`📋 標題: ${lines[0]}`)
        console.log(`📝 範例: ${lines[1]?.substring(0, 60)}...`)
        
        // 保存測試檔案
        fs.writeFileSync('test-final-logic.csv', csvContent, 'utf8')
        console.log(`💾 已保存測試檔案: test-final-logic.csv`)
      }
    }

    console.log('\n🎯 解決方案總結:')
    console.log('✅ 後端：使用 Uint8Array 處理 UTF-8 BOM')
    console.log('✅ 後端：使用 TextEncoder 編碼中文內容')
    console.log('✅ 後端：使用 Base64 編碼避免 API 路由限制')
    console.log('✅ 前端：使用 atob() 解碼 Base64')
    console.log('✅ 前端：使用 Uint8Array 保留原始字節')
    console.log('✅ 前端：使用 Blob 創建檔案，保留 BOM')

    console.log('\n📋 使用說明:')
    console.log('1. 點擊「邏輯思維範本」或「創意能力範本」按鈕')
    console.log('2. 下載的 CSV 檔案包含 UTF-8 BOM')
    console.log('3. 在 Excel 中打開，中文字符會正確顯示')
    console.log('4. 編輯後上傳，系統會覆蓋現有資料')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 最終中文匯出功能測試完成')
  }
}

testFinalChineseExport()
