const http = require('http')

const testFixedDecoding = async () => {
  console.log('🔍 測試修正後的解碼功能')
  console.log('=' .repeat(30))

  try {
    // 獲取創意題目匯出資料
    console.log('\n📊 獲取創意題目匯出資料...')
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
        console.log('✅ 創意題目資料獲取成功')
        
        // 模擬修正後的前端解碼過程
        const base64Data = creativeData.data
        
        // 模擬 atob + TextDecoder 過程
        const binaryString = Buffer.from(base64Data, 'base64').toString('binary')
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        // 使用 ignoreBOM: false 確保保留 BOM
        const csvContent = new TextDecoder('utf-8', { ignoreBOM: false }).decode(bytes)
        
        console.log('\n📋 修正後的解碼結果:')
        console.log(`前100字符: ${csvContent.substring(0, 100)}`)
        console.log(`包含中文: ${/[\u4e00-\u9fff]/.test(csvContent) ? '✅' : '❌'}`)
        console.log(`BOM檢測: ${csvContent.charCodeAt(0) === 0xFEFF ? '✅' : '❌'}`)
        
        // 顯示前幾行內容
        const lines = csvContent.split('\n')
        console.log('\n📋 匯出內容預覽:')
        for (let i = 0; i < Math.min(3, lines.length); i++) {
          if (lines[i].trim()) {
            console.log(`第${i + 1}行: ${lines[i]}`)
          }
        }
        
        if (csvContent.charCodeAt(0) === 0xFEFF && /[\u4e00-\u9fff]/.test(csvContent)) {
          console.log('\n🎉 修正成功！')
          console.log('✅ UTF-8 BOM 保留完整')
          console.log('✅ 中文字符顯示正常')
          console.log('✅ Excel 應該能正確識別編碼')
        } else {
          console.log('\n⚠️ 仍有問題需要進一步修正')
        }
        
      } else {
        console.log('❌ 創意題目資料獲取失敗:', creativeData.message)
      }
    } else {
      console.log('❌ 創意題目資料獲取失敗，狀態碼:', creativeResponse.status)
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後的解碼功能測試完成')
  }
}

testFixedDecoding()
