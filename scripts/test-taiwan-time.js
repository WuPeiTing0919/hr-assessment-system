// 測試台灣時間顯示
const testTime = "2025-09-28T10:35:12.000Z"

console.log('🧪 測試台灣時間顯示')
console.log('=' .repeat(50))

console.log('\n📅 原始時間 (UTC):', testTime)

// 測試不同的時間格式
const date = new Date(testTime)

console.log('\n🌏 台灣時間格式:')
console.log('1. 完整日期時間:', date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }))
console.log('2. 只有日期:', date.toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei" }))
console.log('3. 只有時間:', date.toLocaleTimeString("zh-TW", { timeZone: "Asia/Taipei" }))

console.log('\n📊 比較 (無時區 vs 台灣時區):')
console.log('無時區:', date.toLocaleString("zh-TW"))
console.log('台灣時區:', date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }))

console.log('\n✅ 測試完成')
