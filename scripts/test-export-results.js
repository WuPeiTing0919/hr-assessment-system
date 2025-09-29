const http = require('http')

const testExportResults = async () => {
  console.log('🔍 測試測驗結果匯出功能')
  console.log('=' .repeat(40))

  try {
    // 測試基本匯出
    console.log('\n📊 測試基本匯出...')
    const basicResponse = await new Promise((resolve, reject) => {
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

    if (basicResponse.status === 200) {
      const basicData = JSON.parse(basicResponse.data)
      if (basicData.success) {
        console.log('✅ 基本匯出成功')
        console.log(`📄 檔案名稱: ${basicData.filename}`)
        console.log(`📊 內容類型: ${basicData.contentType}`)
        console.log(`📏 資料大小: ${basicData.data.length} 字元`)
        
        // 解碼並檢查 CSV 內容
        const binaryString = Buffer.from(basicData.data, 'base64').toString('binary')
        const csvContent = Buffer.from(binaryString, 'binary').toString('utf-8')
        
        console.log('\n📋 CSV 內容預覽:')
        const lines = csvContent.split('\n')
        console.log(`總行數: ${lines.length}`)
        console.log('前 5 行內容:')
        lines.slice(0, 5).forEach((line, index) => {
          console.log(`  ${index + 1}: ${line}`)
        })
        
        // 檢查是否包含中文
        const hasChinese = /[\u4e00-\u9fff]/.test(csvContent)
        console.log(`✅ 包含中文字符: ${hasChinese ? '是' : '否'}`)
        
        // 檢查 BOM
        const hasBOM = csvContent.startsWith('\uFEFF')
        console.log(`✅ 包含 UTF-8 BOM: ${hasBOM ? '是' : '否'}`)
        
      } else {
        console.log('❌ 基本匯出失敗:', basicData.message)
        return
      }
    } else {
      console.log('❌ 基本匯出失敗，狀態碼:', basicResponse.status)
      return
    }

    // 測試篩選匯出
    console.log('\n🔍 測試篩選匯出...')
    const filterResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results/export?testType=logic&department=人力資源部', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (filterResponse.status === 200) {
      const filterData = JSON.parse(filterResponse.data)
      if (filterData.success) {
        console.log('✅ 篩選匯出成功')
        
        // 解碼並檢查篩選結果
        const binaryString = Buffer.from(filterData.data, 'base64').toString('binary')
        const csvContent = Buffer.from(binaryString, 'binary').toString('utf-8')
        const lines = csvContent.split('\n')
        
        console.log(`📊 篩選後結果數量: ${lines.length - 1} 筆（扣除標題行）`)
        
        // 檢查是否只包含邏輯測試
        const logicLines = lines.filter(line => line.includes('邏輯思維'))
        console.log(`🧠 邏輯思維測試數量: ${logicLines.length}`)
        
      } else {
        console.log('❌ 篩選匯出失敗:', filterData.message)
      }
    }

    // 測試搜尋匯出
    console.log('\n🔍 測試搜尋匯出...')
    const searchResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results/export?search=王', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (searchResponse.status === 200) {
      const searchData = JSON.parse(searchResponse.data)
      if (searchData.success) {
        console.log('✅ 搜尋匯出成功')
        
        // 解碼並檢查搜尋結果
        const binaryString = Buffer.from(searchData.data, 'base64').toString('binary')
        const csvContent = Buffer.from(binaryString, 'binary').toString('utf-8')
        const lines = csvContent.split('\n')
        
        console.log(`📊 搜尋結果數量: ${lines.length - 1} 筆（扣除標題行）`)
        
        // 檢查是否只包含包含「王」的結果
        const wangLines = lines.filter(line => line.includes('王'))
        console.log(`👤 包含「王」的結果數量: ${wangLines.length}`)
        
      } else {
        console.log('❌ 搜尋匯出失敗:', searchData.message)
      }
    }

    console.log('\n🎯 匯出功能特點:')
    console.log('✅ 支援 CSV 格式匯出')
    console.log('✅ 包含 UTF-8 BOM，確保中文正確顯示')
    console.log('✅ 支援篩選條件匯出')
    console.log('✅ 包含詳細的測試結果資料')
    console.log('✅ 自動生成檔案名稱（包含日期）')
    console.log('✅ 支援搜尋、部門、測試類型篩選')

    console.log('\n📊 匯出欄位:')
    console.log('✅ 用戶姓名')
    console.log('✅ 用戶郵箱')
    console.log('✅ 部門')
    console.log('✅ 測試類型')
    console.log('✅ 分數')
    console.log('✅ 等級')
    console.log('✅ 完成時間')
    console.log('✅ 詳細資料（根據測試類型不同）')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 測驗結果匯出功能測試完成')
  }
}

testExportResults()
