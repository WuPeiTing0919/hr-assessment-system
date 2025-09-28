// 測試新的評分系統
const testScores = [0, 15, 25, 40, 55, 65, 75, 85, 95, 100]

function getScoreLevel(score) {
  if (score === 100) return { 
    level: "邏輯巔峰者", 
    color: "bg-purple-600", 
    description: "近乎完美的邏輯典範！你像一台「推理引擎」，嚴謹又高效，幾乎不受陷阱干擾。",
    suggestion: "多和他人分享你的思考路徑，能幫助團隊整體邏輯力提升。"
  }
  if (score >= 80) return { 
    level: "邏輯大師", 
    color: "bg-green-500", 
    description: "你的思維如同精密儀器，能快速抓住題目關鍵，並做出有效推理。常常是團隊中「冷靜的分析者」。",
    suggestion: "挑戰更高層次的難題，讓你的邏輯力更加精進。"
  }
  if (score >= 60) return { 
    level: "邏輯高手", 
    color: "bg-blue-500", 
    description: "邏輯清晰穩定，大部分情境都能正確判斷。偶爾會因粗心錯過陷阱。",
    suggestion: "在思維縝密之餘，更加留心細節，就能把錯誤率降到最低。"
  }
  if (score >= 30) return { 
    level: "邏輯學徒", 
    color: "bg-yellow-500", 
    description: "已經抓到一些邏輯規律，能解決中等難度的問題。遇到複雜情境時，仍可能卡關。",
    suggestion: "嘗試將問題拆解成小步驟，就像組裝樂高，每一塊拼好，答案就自然浮現。"
  }
  return { 
    level: "邏輯探險新手", 
    color: "bg-red-500", 
    description: "還在邏輯森林的入口徘徊。思考時可能忽略細節，或被陷阱誤導。",
    suggestion: "多練習經典邏輯題，像是在拼拼圖般，慢慢建立清晰的分析步驟。"
  }
}

console.log('🧪 測試新的評分系統')
console.log('=' .repeat(80))

testScores.forEach(score => {
  const level = getScoreLevel(score)
  console.log(`\n📊 分數: ${score}`)
  console.log(`🏆 等級: ${level.level}`)
  console.log(`📝 描述: ${level.description}`)
  console.log(`💡 建議: ${level.suggestion}`)
  console.log('-'.repeat(60))
})

console.log('\n✅ 評分系統測試完成')
