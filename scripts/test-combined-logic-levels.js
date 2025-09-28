const testCombinedLogicLevels = () => {
  console.log('🧠 綜合能力測試邏輯思維評語功能測試')
  console.log('=' .repeat(50))

  // 模擬邏輯思維評語函數
  const getLogicLevel = (score) => {
    if (score >= 100) return {
      level: "邏輯巔峰者",
      color: "bg-purple-600",
      description: "近乎完美的邏輯典範！你像一台「推理引擎」，嚴謹又高效，幾乎不受陷阱干擾。",
      suggestion: "多和他人分享你的思考路徑，能幫助團隊整體邏輯力提升。"
    }
    if (score >= 80) return {
      level: "邏輯大師",
      color: "bg-blue-500",
      description: "你的思維如同精密儀器，能快速抓住題目關鍵，並做出有效推理。常常是團隊中「冷靜的分析者」。",
      suggestion: "挑戰更高層次的難題，讓你的邏輯力更加精進。"
    }
    if (score >= 60) return {
      level: "邏輯高手",
      color: "bg-green-500",
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

  console.log('\n📊 測試案例:')
  
  // 測試各個分數區間
  const testScores = [0, 15, 25, 45, 65, 85, 95, 100]
  
  testScores.forEach(score => {
    const level = getLogicLevel(score)
    console.log(`\n分數: ${score}分`)
    console.log(`等級: ${level.level}`)
    console.log(`顏色: ${level.color}`)
    console.log(`描述: ${level.description}`)
    console.log(`建議: ${level.suggestion}`)
  })

  console.log('\n🎯 評語等級對應:')
  console.log('100分: 邏輯巔峰者 (紫色)')
  console.log('80-99分: 邏輯大師 (藍色)')
  console.log('60-79分: 邏輯高手 (綠色)')
  console.log('30-59分: 邏輯學徒 (黃色)')
  console.log('0-29分: 邏輯探險新手 (紅色)')

  console.log('\n🎨 UI設計特色:')
  console.log('- 等級標示: 彩色圓點 + 等級名稱')
  console.log('- 描述文字: 生動有趣的比喻和描述')
  console.log('- 建議區塊: 淺色背景，包含👉圖示')
  console.log('- 響應式設計: 適配手機和桌面版')

  console.log('\n📝 評語內容特色:')
  console.log('- 使用生動的比喻 (推理引擎、精密儀器、拼拼圖)')
  console.log('- 提供具體的改進建議')
  console.log('- 鼓勵性的語言風格')
  console.log('- 符合不同能力水平的描述')

  console.log('\n🔍 測試要點:')
  console.log('1. 各分數區間顯示正確的等級')
  console.log('2. 顏色標示與等級匹配')
  console.log('3. 描述文字生動有趣')
  console.log('4. 建議內容實用具體')
  console.log('5. UI佈局美觀整齊')

  console.log('\n✅ 綜合能力測試邏輯思維評語功能測試完成')
}

testCombinedLogicLevels()
