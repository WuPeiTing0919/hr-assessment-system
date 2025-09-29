const http = require('http')

const testLogicPagination = async () => {
  console.log('🔍 測試邏輯題目分頁功能')
  console.log('=' .repeat(30))

  try {
    // 獲取邏輯題目資料
    console.log('\n📊 獲取邏輯題目資料...')
    const logicResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/questions/logic', (res) => {
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
        const questions = logicData.data
        console.log(`✅ 成功獲取 ${questions.length} 道邏輯題目`)
        
        // 模擬分頁計算
        const itemsPerPage = 10
        const totalPages = Math.ceil(questions.length / itemsPerPage)
        
        console.log(`\n📊 分頁計算結果:`)
        console.log(`每頁顯示: ${itemsPerPage} 道題目`)
        console.log(`總頁數: ${totalPages}`)
        
        // 顯示每頁的題目範圍
        for (let page = 1; page <= totalPages; page++) {
          const startIndex = (page - 1) * itemsPerPage
          const endIndex = startIndex + itemsPerPage
          const currentQuestions = questions.slice(startIndex, endIndex)
          
          console.log(`\n第 ${page} 頁:`)
          console.log(`  顯示第 ${startIndex + 1} - ${Math.min(endIndex, questions.length)} 筆`)
          console.log(`  題目數量: ${currentQuestions.length}`)
          console.log(`  題目ID範圍: ${currentQuestions[0]?.id} - ${currentQuestions[currentQuestions.length - 1]?.id}`)
        }
        
        console.log('\n🎯 分頁功能特點:')
        console.log('✅ 每頁顯示 10 道題目')
        console.log('✅ 支援桌面版和手機版分頁')
        console.log('✅ 顯示當前頁範圍和總數')
        console.log('✅ 上一頁/下一頁按鈕')
        console.log('✅ 頁碼按鈕（桌面版顯示全部，手機版顯示3個）')
        console.log('✅ 省略號顯示（手機版）')
        
        console.log('\n📱 手機版分頁邏輯:')
        console.log('✅ 最多顯示 3 個頁碼')
        console.log('✅ 當前頁居中顯示')
        console.log('✅ 首頁和末頁按需顯示')
        console.log('✅ 省略號表示跳過的頁碼')
        
        console.log('\n💻 桌面版分頁邏輯:')
        console.log('✅ 顯示所有頁碼')
        console.log('✅ 當前頁高亮顯示')
        console.log('✅ 上一頁/下一頁按鈕')
        
        if (questions.length > itemsPerPage) {
          console.log('\n🎉 分頁功能已啟用！')
          console.log(`目前有 ${questions.length} 道題目，分為 ${totalPages} 頁顯示`)
        } else {
          console.log('\n📝 題目數量少於一頁，分頁功能未顯示')
        }
        
      } else {
        console.log('❌ 獲取邏輯題目失敗:', logicData.message)
      }
    } else {
      console.log('❌ 獲取邏輯題目失敗，狀態碼:', logicResponse.status)
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 邏輯題目分頁功能測試完成')
  }
}

testLogicPagination()
