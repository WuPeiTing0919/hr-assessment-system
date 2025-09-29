const https = require('https')
const http = require('http')

const testNewTimeFormat = async () => {
  console.log('🔍 測試新的時間格式')
  console.log('=' .repeat(50))

  try {
    // 測試當前時間格式
    console.log('\n📊 測試當前時間格式:')
    const now = new Date()
    const utcTime = now.toISOString()
    const taiwanTime = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`當前 UTC 時間: ${utcTime}`)
    console.log(`當前台灣時間: ${taiwanTime}`)
    
    // 測試時間轉換
    console.log('\n📊 測試時間轉換:')
    const testDate = new Date(utcTime)
    const convertedTaiwanTime = testDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    console.log(`轉換後的台灣時間: ${convertedTaiwanTime}`)
    
    // 驗證轉換是否正確
    const isCorrect = taiwanTime === convertedTaiwanTime
    console.log(`轉換是否正確: ${isCorrect ? '✅' : '❌'}`)
    
    // 測試不同的時間格式
    console.log('\n📊 測試不同時間格式:')
    const formats = [
      { name: 'UTC 格式 (修正後)', time: now.toISOString() },
      { name: '舊格式 (有問題)', time: now.toISOString().replace('Z', '').replace('T', ' ') }
    ]
    
    formats.forEach(format => {
      console.log(`\n${format.name}: ${format.time}`)
      const date = new Date(format.time)
      const taiwan = date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
      console.log(`  轉換為台灣時間: ${taiwan}`)
    })

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 新時間格式測試完成')
  }
}

testNewTimeFormat()
