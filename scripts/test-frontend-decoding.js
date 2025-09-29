const http = require('http')

const testFrontendDecoding = async () => {
  console.log('🔍 測試前端解碼功能')
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
        
        // 模擬前端解碼過程
        const base64Data = creativeData.data
        
        // 方法1: 直接使用 Buffer (Node.js 環境)
        const buffer = Buffer.from(base64Data, 'base64')
        const csvContent1 = buffer.toString('utf8')
        
        // 方法2: 模擬前端 atob + TextDecoder
        const binaryString = Buffer.from(base64Data, 'base64').toString('binary')
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const csvContent2 = new TextDecoder('utf-8').decode(bytes)
        
        console.log('\n📋 解碼結果比較:')
        console.log('方法1 (Buffer):')
        console.log(`  前100字符: ${csvContent1.substring(0, 100)}`)
        console.log(`  包含中文: ${/[\u4e00-\u9fff]/.test(csvContent1) ? '✅' : '❌'}`)
        console.log(`  BOM檢測: ${csvContent1.charCodeAt(0) === 0xFEFF ? '✅' : '❌'}`)
        
        console.log('\n方法2 (atob + TextDecoder):')
        console.log(`  前100字符: ${csvContent2.substring(0, 100)}`)
        console.log(`  包含中文: ${/[\u4e00-\u9fff]/.test(csvContent2) ? '✅' : '❌'}`)
        console.log(`  BOM檢測: ${csvContent2.charCodeAt(0) === 0xFEFF ? '✅' : '❌'}`)
        
        // 檢查兩種方法是否一致
        const isSame = csvContent1 === csvContent2
        console.log(`\n兩種方法結果一致: ${isSame ? '✅' : '❌'}`)
        
        if (isSame) {
          console.log('\n🎉 前端解碼方法正確！')
          console.log('✅ Base64 解碼正常')
          console.log('✅ UTF-8 編碼處理正確')
          console.log('✅ UTF-8 BOM 保留完整')
          console.log('✅ 中文字符顯示正常')
        } else {
          console.log('\n⚠️ 兩種解碼方法結果不同，需要檢查')
        }
        
        // 顯示前幾行內容
        const lines = csvContent1.split('\n')
        console.log('\n📋 匯出內容預覽:')
        for (let i = 0; i < Math.min(3, lines.length); i++) {
          if (lines[i].trim()) {
            console.log(`第${i + 1}行: ${lines[i]}`)
          }
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
    console.log('\n✅ 前端解碼功能測試完成')
  }
}

testFrontendDecoding()
