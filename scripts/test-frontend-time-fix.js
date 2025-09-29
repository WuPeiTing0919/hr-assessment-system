const https = require('https')
const http = require('http')

const testFrontendTimeFix = async () => {
  console.log('🔍 測試前端時間顯示修正')
  console.log('=' .repeat(50))

  try {
    // 測試時間格式轉換
    console.log('\n📊 測試前端時間轉換:')
    
    // 模擬資料庫中的時間格式
    const dbTime = '2025-09-29 17:34:08'
    console.log(`資料庫時間: ${dbTime}`)
    
    // 舊的轉換方式（錯誤）
    const oldWay = new Date(dbTime)
    const oldTaiwanTime = oldWay.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    console.log(`舊方式轉換: ${oldTaiwanTime}`)
    
    // 新的轉換方式（正確）
    const newWay = new Date(dbTime + 'Z')
    const newTaiwanTime = newWay.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    console.log(`新方式轉換: ${newTaiwanTime}`)
    
    // 驗證轉換是否正確
    const expectedTime = '2025/9/29 下午5:34:08'
    const isCorrect = newTaiwanTime === expectedTime
    console.log(`轉換是否正確: ${isCorrect ? '✅' : '❌'}`)
    
    if (!isCorrect) {
      console.log(`期望時間: ${expectedTime}`)
      console.log(`實際時間: ${newTaiwanTime}`)
    }

    console.log('\n📝 修正說明:')
    console.log('1. 資料庫儲存: 2025-09-29 17:34:08 (UTC 時間)')
    console.log('2. 舊方式: new Date("2025-09-29 17:34:08") → 當作本地時間')
    console.log('3. 新方式: new Date("2025-09-29 17:34:08Z") → 當作 UTC 時間')
    console.log('4. 前端顯示: 正確轉換為台灣時間 (UTC+8)')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 前端時間顯示修正測試完成')
  }
}

testFrontendTimeFix()
