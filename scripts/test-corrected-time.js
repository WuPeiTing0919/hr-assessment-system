const https = require('https')
const http = require('http')

const testCorrectedTime = async () => {
  console.log('🔍 測試修正後的時間格式')
  console.log('=' .repeat(50))

  try {
    // 測試當前時間
    console.log('\n📊 當前時間測試:')
    const now = new Date()
    const utcTime = now.toISOString()
    const taiwanTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`當前 UTC 時間: ${utcTime}`)
    console.log(`當前台灣時間: ${taiwanTime}`)
    
    // 模擬舊格式和新格式的差異
    console.log('\n📊 格式比較:')
    const oldFormat = now.toISOString().replace('Z', '').replace('T', ' ')
    const newFormat = now.toISOString()
    
    console.log(`舊格式: ${oldFormat}`)
    console.log(`新格式: ${newFormat}`)
    
    // 測試兩種格式的轉換
    const oldDate = new Date(oldFormat)
    const newDate = new Date(newFormat)
    
    console.log(`\n舊格式轉換:`)
    console.log(`  UTC: ${oldDate.toISOString()}`)
    console.log(`  台灣時間: ${oldDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    
    console.log(`\n新格式轉換:`)
    console.log(`  UTC: ${newDate.toISOString()}`)
    console.log(`  台灣時間: ${newDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    
    // 驗證新格式是否正確
    const isCorrect = newDate.toISOString() === utcTime
    console.log(`\n新格式是否正確: ${isCorrect ? '✅' : '❌'}`)

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後時間格式測試完成')
  }
}

testCorrectedTime()
