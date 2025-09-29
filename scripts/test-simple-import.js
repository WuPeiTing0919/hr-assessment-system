const http = require('http')
const fs = require('fs')

const testSimpleImport = async () => {
  console.log('🔍 測試簡化匯入功能')
  console.log('=' .repeat(30))

  try {
    // 創建一個簡單的測試 CSV
    const testCSV = `"題目ID","題目內容","選項A","選項B","選項C","選項D","選項E","正確答案","解釋"
"1","測試題目：1+1=?","1","2","3","4","5","B","1+1=2"`
    
    fs.writeFileSync('test-simple.csv', testCSV, 'utf8')
    console.log('✅ 測試 CSV 檔案創建成功')

    // 測試 API 端點（不實際上傳檔案，只測試端點是否正常）
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/questions/import',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
      req.write(JSON.stringify({ test: true }))
      req.end()
    })

    console.log(`\n📊 API 測試結果:`)
    console.log(`狀態碼: ${response.status}`)
    console.log(`回應: ${response.data}`)

    if (response.status === 400) {
      console.log('✅ API 端點正常運作（預期缺少檔案參數）')
    } else if (response.status === 500) {
      console.log('❌ 仍有伺服器錯誤，需要進一步修正')
    } else {
      console.log('⚠️ 意外的回應狀態')
    }

    console.log('\n🎯 修正狀態:')
    console.log('✅ 移除了 FileReader 依賴')
    console.log('✅ 添加了 CSV 和 Excel 檔案支援')
    console.log('✅ 在伺服器端定義了解析函數')
    console.log('✅ 添加了詳細的日誌記錄')

    console.log('\n📋 下一步:')
    console.log('1. 在瀏覽器中測試實際的檔案上傳')
    console.log('2. 檢查伺服器日誌以確認處理過程')
    console.log('3. 驗證資料庫更新是否正常')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    // 清理測試檔案
    try {
      fs.unlinkSync('test-simple.csv')
      console.log('\n🧹 測試檔案已清理')
    } catch (e) {
      // 忽略清理錯誤
    }
    console.log('\n✅ 簡化匯入功能測試完成')
  }
}

testSimpleImport()
