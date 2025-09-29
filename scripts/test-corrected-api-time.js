const https = require('https')
const http = require('http')

const testCorrectedApiTime = async () => {
  console.log('🔍 測試修正後的 API 時間處理')
  console.log('=' .repeat(50))

  try {
    // 測試當前時間
    console.log('\n📊 當前時間:')
    const now = new Date()
    const utcTime = now.toISOString()
    const taiwanTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`UTC 時間: ${utcTime}`)
    console.log(`台灣時間: ${taiwanTime}`)
    
    // 測試修正後的 API 時間轉換
    console.log('\n📊 修正後的 API 時間轉換:')
    const apiInput = utcTime // 前端傳入的 UTC 時間
    const utcDate = new Date(apiInput)
    const apiOutput = utcDate.toISOString().replace('Z', '').replace('T', ' ')
    
    console.log(`API 輸入 (前端): ${apiInput}`)
    console.log(`API 輸出 (資料庫): ${apiOutput}`)
    
    // 測試前端讀取
    console.log('\n📊 前端讀取測試:')
    const frontendRead = new Date(apiOutput + 'Z') // 重新添加 Z 來正確解析
    const frontendDisplay = frontendRead.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`前端讀取: ${frontendRead.toISOString()}`)
    console.log(`前端顯示: ${frontendDisplay}`)
    
    // 驗證轉換是否正確
    const isCorrect = frontendRead.toISOString() === utcTime
    console.log(`轉換是否正確: ${isCorrect ? '✅' : '❌'}`)
    
    if (!isCorrect) {
      console.log(`期望: ${utcTime}`)
      console.log(`實際: ${frontendRead.toISOString()}`)
    }

    console.log('\n📝 修正說明:')
    console.log('1. 前端傳入: UTC 時間 (2025-09-29T09:37:40.867Z)')
    console.log('2. API 轉換: 先解析為 Date，再轉換為 MySQL 格式')
    console.log('3. 資料庫儲存: UTC 時間格式 (2025-09-29 09:37:40.867)')
    console.log('4. 前端讀取: 添加 Z 後解析，正確轉換為台灣時間')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後的 API 時間處理測試完成')
  }
}

testCorrectedApiTime()
