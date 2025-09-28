const testCombinedCreativityLevels = () => {
  console.log('💡 綜合能力測試創意能力評語功能測試')
  console.log('=' .repeat(50))

  // 模擬創意能力評語函數
  const getCreativityLevel = (score) => {
    if (score >= 90) return {
      level: "創意巔峰者",
      color: "bg-purple-600",
      description: "創意力近乎無窮，你是團隊裡的靈感源泉，總能帶來突破性的想法。",
      suggestion: "你不只創造靈感，更能影響他人。如果能結合執行力，你將成為真正的創新領袖。"
    }
    if (score >= 75) return {
      level: "創意引領者",
      color: "bg-blue-500",
      description: "你是靈感的推動者！總是能在團體中主動拋出新想法，激發別人跟進。",
      suggestion: "持續累積學習，讓你的靈感不僅是點子，而能帶動真正的行動。"
    }
    if (score >= 55) return {
      level: "創意實踐者",
      color: "bg-green-500",
      description: "靈感已經隨手可得，在團體中也常被認為是「有創意的人」。",
      suggestion: "再給自己一點勇氣，不要害怕挑戰慣例，你的創意將更有力量。"
    }
    if (score >= 35) return {
      level: "創意開拓者",
      color: "bg-yellow-500",
      description: "你其實有自己的想法，但有時習慣跟隨大多數人的步伐。",
      suggestion: "試著勇敢說出腦中天馬行空的念頭，你會發現，這些點子或許就是團隊需要的突破口。"
    }
    return {
      level: "創意萌芽者",
      color: "bg-red-500",
      description: "還在創意旅程的起點。雖然暫時表現平淡，但這正是無限潛力的開端！",
      suggestion: "觀察生活小事，或閱讀不同領域的內容，讓靈感一點一滴積累。"
    }
  }

  console.log('\n📊 測試案例:')
  
  // 測試各個分數區間
  const testScores = [0, 20, 30, 45, 60, 70, 80, 90, 95]
  
  testScores.forEach(score => {
    const level = getCreativityLevel(score)
    console.log(`\n分數: ${score}分`)
    console.log(`等級: ${level.level}`)
    console.log(`顏色: ${level.color}`)
    console.log(`描述: ${level.description}`)
    console.log(`建議: ${level.suggestion}`)
  })

  console.log('\n🎯 評語等級對應:')
  console.log('90分以上: 創意巔峰者 (紫色)')
  console.log('75-89分: 創意引領者 (藍色)')
  console.log('55-74分: 創意實踐者 (綠色)')
  console.log('35-54分: 創意開拓者 (黃色)')
  console.log('0-34分: 創意萌芽者 (紅色)')

  console.log('\n🎨 UI設計特色:')
  console.log('- 等級標示: 彩色圓點 + 等級名稱')
  console.log('- 描述文字: 生動有趣的比喻和描述')
  console.log('- 建議區塊: 淺色背景，包含👉圖示')
  console.log('- 響應式設計: 適配手機和桌面版')

  console.log('\n📝 評語內容特色:')
  console.log('- 使用生動的比喻 (靈感源泉、天馬行空、創新領袖)')
  console.log('- 提供具體的改進建議')
  console.log('- 鼓勵性的語言風格')
  console.log('- 符合不同能力水平的描述')

  console.log('\n🌟 創意能力評語亮點:')
  console.log('- 創意巔峰者: 強調影響力和領導力')
  console.log('- 創意引領者: 強調推動和激發他人')
  console.log('- 創意實踐者: 強調勇氣和挑戰慣例')
  console.log('- 創意開拓者: 強調勇敢表達想法')
  console.log('- 創意萌芽者: 強調潛力和積累')

  console.log('\n🔍 測試要點:')
  console.log('1. 各分數區間顯示正確的等級')
  console.log('2. 顏色標示與等級匹配')
  console.log('3. 描述文字生動有趣')
  console.log('4. 建議內容實用具體')
  console.log('5. UI佈局美觀整齊')
  console.log('6. 與邏輯思維評語風格一致')

  console.log('\n✅ 綜合能力測試創意能力評語功能測試完成')
}

testCombinedCreativityLevels()
