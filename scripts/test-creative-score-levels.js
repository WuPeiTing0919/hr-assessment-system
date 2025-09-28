// 測試新的創意評分系統
const testScores = [0, 20, 40, 50, 60, 70, 80, 85, 90, 95, 100]

function getCreativityLevel(score) {
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

console.log('🎨 測試新的創意評分系統')
console.log('=' .repeat(80))

testScores.forEach(score => {
  const level = getCreativityLevel(score)
  console.log(`\n📊 分數: ${score}`)
  console.log(`🏆 等級: ${level.level}`)
  console.log(`📝 描述: ${level.description}`)
  console.log(`💡 建議: ${level.suggestion}`)
  console.log('-'.repeat(60))
})

console.log('\n✅ 創意評分系統測試完成')
console.log('\n📋 評分標準:')
console.log('- 90分以上: 創意巔峰者')
console.log('- 75-89分: 創意引領者')
console.log('- 55-74分: 創意實踐者')
console.log('- 35-54分: 創意開拓者')
console.log('- 35分以下: 創意萌芽者')
