const http = require('http')

const testExportDetails = async () => {
  console.log('🔍 測試匯出詳細資料')
  console.log('=' .repeat(40))

  try {
    // 測試匯出 API
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
        
        console.log('\n📋 所有綜合測試的詳細資料:')
        lines.forEach((line, index) => {
          if (index === 0) return // 跳過標題行
          
          const columns = line.split(',')
          if (columns.length >= 8) {
            const testType = columns[3].replace(/"/g, '')
            const details = columns[7].replace(/"/g, '')
            
            if (testType === '綜合能力') {
              console.log(`  第 ${index} 行: ${details}`)
            }
          }
        })
        
        // 檢查原始資料
        console.log('\n🔍 檢查原始 API 資料...')
        const apiResponse = await new Promise((resolve, reject) => {
          const req = http.get('http://localhost:3000/api/admin/test-results', (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => resolve({ 
              status: res.statusCode, 
              data: data
            }))
          })
          req.on('error', reject)
        })
        
        if (apiResponse.status === 200) {
          const apiData = JSON.parse(apiResponse.data)
          if (apiData.success) {
            const combinedResults = apiData.data.results.filter(result => result.type === 'combined')
            console.log(`\n📊 API 中的綜合測試結果 (${combinedResults.length} 筆):`)
            
            combinedResults.forEach((result, index) => {
              console.log(`\n  結果 ${index + 1}:`)
              console.log(`    用戶: ${result.userName}`)
              console.log(`    分數: ${result.score}`)
              console.log(`    詳細資料:`, JSON.stringify(result.details, null, 2))
            })
          }
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
    console.log('\n✅ 匯出詳細資料測試完成')
  }
}

testExportDetails()
