const http = require('http')

const checkCombinedTestData = async () => {
  console.log('🔍 檢查綜合測試資料結構')
  console.log('=' .repeat(40))

  try {
    // 獲取所有測試結果
    const response = await new Promise((resolve, reject) => {
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

    if (response.status === 200) {
      const data = JSON.parse(response.data)
      if (data.success) {
        console.log('✅ 成功獲取測試結果')
        
        // 找出綜合測試結果
        const combinedResults = data.data.results.filter(result => result.type === 'combined')
        console.log(`📊 綜合測試結果數量: ${combinedResults.length}`)
        
        combinedResults.forEach((result, index) => {
          console.log(`\n📋 綜合測試 ${index + 1}:`)
          console.log(`  用戶: ${result.userName}`)
          console.log(`  分數: ${result.score}`)
          console.log(`  完成時間: ${result.completedAt}`)
          console.log(`  詳細資料:`, JSON.stringify(result.details, null, 2))
        })
        
      } else {
        console.log('❌ 獲取資料失敗:', data.message)
      }
    } else {
      console.log('❌ 獲取資料失敗，狀態碼:', response.status)
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message)
  } finally {
    console.log('\n✅ 綜合測試資料檢查完成')
  }
}

checkCombinedTestData()
