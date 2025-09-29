const https = require('https')
const http = require('http')

const testTimeIssueAnalysis = async () => {
  console.log('🔍 分析時間問題')
  console.log('=' .repeat(50))

  try {
    // 測試當前時間
    console.log('\n📊 當前時間分析:')
    const now = new Date()
    const utcTime = now.toISOString()
    const taiwanTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`當前 UTC 時間: ${utcTime}`)
    console.log(`當前台灣時間: ${taiwanTime}`)
    
    // 測試 API 時間轉換
    console.log('\n📊 API 時間轉換測試:')
    const apiInput = utcTime // 前端傳入的 UTC 時間
    const apiOutput = apiInput.replace('Z', '').replace('T', ' ') // API 轉換後
    
    console.log(`API 輸入 (前端): ${apiInput}`)
    console.log(`API 輸出 (資料庫): ${apiOutput}`)
    
    // 測試前端讀取
    console.log('\n📊 前端讀取測試:')
    const frontendRead = new Date(apiOutput)
    const frontendDisplay = frontendRead.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`前端讀取: ${frontendRead.toISOString()}`)
    console.log(`前端顯示: ${frontendDisplay}`)
    
    // 分析問題
    console.log('\n📊 問題分析:')
    console.log('1. 前端傳入: UTC 時間 (2025-09-29T09:34:08.000Z)')
    console.log('2. API 轉換: 移除 Z 和 T (2025-09-29 09:34:08.000)')
    console.log('3. 資料庫儲存: 當作本地時間儲存')
    console.log('4. 前端讀取: 當作本地時間解析，然後轉換為台灣時間')
    
    console.log('\n📝 問題根源:')
    console.log('- API 將 UTC 時間轉換為本地時間格式')
    console.log('- 資料庫將其當作本地時間儲存')
    console.log('- 前端讀取時又當作本地時間解析')
    console.log('- 造成時間顯示錯誤')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 時間問題分析完成')
  }
}

testTimeIssueAnalysis()
