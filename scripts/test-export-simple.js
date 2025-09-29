const http = require('http')

const testExportSimple = async () => {
  console.log('🔍 簡單測試匯出功能')
  console.log('=' .repeat(30))

  try {
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
        
        // 只顯示前幾行
        const lines = csvContent.split('\n')
        console.log('\n📋 CSV 前 10 行:')
        lines.slice(0, 10).forEach((line, index) => {
          console.log(`${index + 1}: ${line}`)
        })
        
        // 檢查是否有「創意」和「平衡」字樣
        const hasCreative = csvContent.includes('創意')
        const hasBalance = csvContent.includes('平衡')
        console.log(`\n🔍 檢查結果:`)
        console.log(`  包含「創意」: ${hasCreative ? '是' : '否'}`)
        console.log(`  包含「平衡」: ${hasBalance ? '是' : '否'}`)
        
        if (hasCreative && hasBalance) {
          console.log('✅ 修復成功！')
        } else {
          console.log('❌ 仍有問題')
        }
        
      } else {
        console.log('❌ 匯出失敗:', data.message)
      }
    } else {
      console.log('❌ 匯出失敗，狀態碼:', response.status)
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  }
}

testExportSimple()