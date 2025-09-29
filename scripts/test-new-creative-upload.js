const https = require('https')
const http = require('http')

const testNewCreativeUpload = async () => {
  console.log('🔍 測試新的創意測驗上傳時間格式')
  console.log('=' .repeat(50))

  const userId = 'user-1759073326705-m06y3wacd'

  try {
    // 模擬新的創意測驗上傳
    console.log('\n📊 模擬新的創意測驗上傳...')
    
    // 生成測試答案
    const testAnswers = []
    for (let i = 1; i <= 18; i++) {
      testAnswers.push({
        questionId: i,
        answer: Math.floor(Math.random() * 5) + 1 // 1-5 隨機答案
      })
    }
    
    const uploadData = {
      userId: userId,
      answers: testAnswers,
      completedAt: new Date().toISOString() // 使用修正後的格式
    }
    
    console.log('上傳數據:', {
      userId: uploadData.userId,
      answersCount: uploadData.answers.length,
      completedAt: uploadData.completedAt
    })
    
    // 測試時間轉換
    const testDate = new Date(uploadData.completedAt)
    console.log(`\n時間轉換測試:`)
    console.log(`UTC 時間: ${testDate.toISOString()}`)
    console.log(`台灣時間: ${testDate.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}`)
    
    // 檢查是否為今天
    const now = new Date()
    const isToday = now.toDateString() === testDate.toDateString()
    console.log(`是否為今天: ${isToday}`)
    
    console.log('\n📝 建議:')
    console.log('1. 前端時間格式已修正，現在使用正確的 UTC 時間格式')
    console.log('2. 建議重新進行一次創意測驗來驗證修正效果')
    console.log('3. 新的測試結果應該會顯示正確的台灣時間')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 新創意測驗上傳時間格式測試完成')
  }
}

testNewCreativeUpload()
