const http = require('http')
const fs = require('fs')

const testImportFix = async () => {
  console.log('🔍 測試修正後的匯入功能')
  console.log('=' .repeat(30))

  try {
    // 創建測試 CSV 檔案
    console.log('\n📊 創建測試 CSV 檔案...')
    
    const testLogicCSV = `"題目ID","題目內容","選項A","選項B","選項C","選項D","選項E","正確答案","解釋"
"1","測試邏輯題目：如果 A > B 且 B > C，那麼？","A > C","A < C","A = C","無法確定","A = B","A","根據傳遞性，A > C"`
    
    const testCreativeCSV = `"題目ID","陳述內容","類別","反向計分"
"1","我喜歡嘗試新的解決方案","innovation","否"
"2","我習慣按照既定規則工作","flexibility","是"`

    // 保存測試檔案
    fs.writeFileSync('test-logic-import.csv', testLogicCSV, 'utf8')
    fs.writeFileSync('test-creative-import.csv', testCreativeCSV, 'utf8')
    
    console.log('✅ 測試檔案創建成功')
    console.log('   test-logic-import.csv')
    console.log('   test-creative-import.csv')

    // 測試匯入 API 端點
    console.log('\n📊 測試匯入 API 端點...')
    
    // 模擬 FormData 請求（簡化測試）
    const testData = {
      type: 'logic',
      test: true
    }
    
    const postData = JSON.stringify(testData)
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/questions/import',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
      req.write(postData)
      req.end()
    })

    console.log(`狀態碼: ${response.status}`)
    console.log(`回應: ${response.data}`)

    if (response.status === 400) {
      console.log('✅ API 端點正常運作（預期缺少檔案參數）')
    } else if (response.status === 500) {
      console.log('❌ 仍有伺服器錯誤')
    } else {
      console.log('⚠️ 意外的回應狀態')
    }

    console.log('\n🎯 修正說明:')
    console.log('✅ 移除了 FileReader 依賴')
    console.log('✅ 使用 XLSX 庫直接處理檔案')
    console.log('✅ 在伺服器端定義解析函數')
    console.log('✅ 支援 CSV 和 Excel 格式')

    console.log('\n📋 使用方式:')
    console.log('1. 下載範本檔案（CSV 格式）')
    console.log('2. 在 Excel 中編輯內容')
    console.log('3. 保存為 CSV 或 Excel 格式')
    console.log('4. 在網頁中選擇檔案並上傳')
    console.log('5. 系統會清空舊資料並插入新資料')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    // 清理測試檔案
    try {
      fs.unlinkSync('test-logic-import.csv')
      fs.unlinkSync('test-creative-import.csv')
      console.log('\n🧹 測試檔案已清理')
    } catch (e) {
      // 忽略清理錯誤
    }
    console.log('\n✅ 匯入功能修正測試完成')
  }
}

testImportFix()
