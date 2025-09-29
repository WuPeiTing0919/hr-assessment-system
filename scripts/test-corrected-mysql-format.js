const https = require('https')
const http = require('http')

const testCorrectedMysqlFormat = async () => {
  console.log('🔍 測試修正後的 MySQL 時間格式')
  console.log('=' .repeat(50))

  try {
    // 測試時間格式轉換
    console.log('\n📊 測試時間格式轉換:')
    const now = new Date()
    const isoTime = now.toISOString()
    const mysqlTime = isoTime.replace('Z', '').replace('T', ' ')
    
    console.log(`ISO 8601 格式: ${isoTime}`)
    console.log(`MySQL 格式: ${mysqlTime}`)
    
    // 測試轉換後的時間解析
    const parsedTime = new Date(mysqlTime + 'Z') // 重新添加 Z 來正確解析
    const taiwanTime = parsedTime.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    
    console.log(`轉換後解析: ${parsedTime.toISOString()}`)
    console.log(`台灣時間: ${taiwanTime}`)
    
    // 驗證轉換是否正確
    const isCorrect = parsedTime.toISOString() === isoTime
    console.log(`轉換是否正確: ${isCorrect ? '✅' : '❌'}`)

    console.log('\n📝 修正說明:')
    console.log('1. 前端使用 ISO 8601 格式 (2025-09-29T09:30:00.000Z)')
    console.log('2. API 直接替換格式 (2025-09-29 09:30:00.000)')
    console.log('3. 資料庫儲存 UTC 時間')
    console.log('4. 前端讀取時正確轉換為台灣時間')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 修正後的 MySQL 時間格式測試完成')
  }
}

testCorrectedMysqlFormat()
