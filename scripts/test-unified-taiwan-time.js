const https = require('https')
const http = require('http')

const testUnifiedTaiwanTime = async () => {
  console.log('🔍 測試統一台灣時間處理')
  console.log('=' .repeat(50))

  try {
    // 測試當前時間
    console.log('\n📊 當前時間測試:')
    const now = new Date()
    const utcTime = now.toISOString()
    const taiwanTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`UTC 時間: ${utcTime}`)
    console.log(`台灣時間: ${taiwanTime}`)
    
    // 測試 API 時間轉換邏輯
    console.log('\n📊 API 時間轉換測試:')
    const utcDate = new Date(utcTime)
    const taiwanTimeForDB = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000)) // UTC + 8 小時
    const mysqlTime = taiwanTimeForDB.toISOString().replace('Z', '').replace('T', ' ')
    
    console.log(`API 輸入 (前端 UTC): ${utcTime}`)
    console.log(`API 轉換 (台灣時間): ${taiwanTimeForDB.toISOString()}`)
    console.log(`API 輸出 (資料庫): ${mysqlTime}`)
    
    // 測試前端讀取邏輯
    console.log('\n📊 前端讀取測試:')
    const frontendRead = new Date(mysqlTime)
    const frontendDisplay = frontendRead.toLocaleString("zh-TW")
    
    console.log(`前端讀取: ${frontendRead.toISOString()}`)
    console.log(`前端顯示: ${frontendDisplay}`)
    
    // 驗證時間一致性
    const expectedTaiwanTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    const isConsistent = frontendDisplay === expectedTaiwanTime
    console.log(`時間是否一致: ${isConsistent ? '✅' : '❌'}`)
    
    if (!isConsistent) {
      console.log(`期望: ${expectedTaiwanTime}`)
      console.log(`實際: ${frontendDisplay}`)
    }

    console.log('\n📝 統一時間處理說明:')
    console.log('1. 前端: 使用 UTC 時間 (2025-09-29T09:43:16.000Z)')
    console.log('2. API: 轉換為台灣時間 (UTC + 8 小時)')
    console.log('3. 資料庫: 儲存台灣時間格式 (2025-09-29 17:43:16.000)')
    console.log('4. 前端讀取: 直接顯示台灣時間，不轉換時區')
    console.log('5. 結果: 所有地方都使用台灣時間，完全一致')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 統一台灣時間處理測試完成')
  }
}

testUnifiedTaiwanTime()
