// 測試反向題分數計算邏輯
function testReverseScoring() {
  console.log('🧮 測試反向題分數計算邏輯')
  console.log('=' .repeat(50))

  // 模擬題目數據
  const questions = [
    { id: 1, statement: "一般題目", is_reverse: false },
    { id: 2, statement: "反向題目", is_reverse: true },
    { id: 3, statement: "一般題目", is_reverse: false },
    { id: 4, statement: "反向題目", is_reverse: true }
  ]

  // 模擬用戶答案
  const answers = {
    0: 5, // 一般題目，選擇 5
    1: 5, // 反向題目，選擇 5
    2: 1, // 一般題目，選擇 1
    3: 1  // 反向題目，選擇 1
  }

  console.log('\n📋 題目和答案:')
  questions.forEach((question, index) => {
    const answer = answers[index]
    const reverseText = question.is_reverse ? ' (反向題)' : ''
    console.log(`${index + 1}. ${question.statement}${reverseText} - 用戶選擇: ${answer}`)
  })

  console.log('\n🧮 分數計算:')
  let totalScore = 0
  
  questions.forEach((question, index) => {
    const answer = answers[index] || 1
    let score
    
    if (question.is_reverse) {
      // 反向題：選擇 5 得 1 分，選擇 1 得 5 分
      score = 6 - answer
    } else {
      // 一般題：選擇多少得多少分
      score = answer
    }
    
    totalScore += score
    
    console.log(`第${index + 1}題: ${question.is_reverse ? '反向' : '一般'} - 選擇${answer} → 得分${score}`)
  })

  const maxScore = questions.length * 5
  const percentage = Math.round((totalScore / maxScore) * 100)

  console.log('\n📊 結果:')
  console.log(`總分: ${totalScore} / ${maxScore}`)
  console.log(`百分比: ${percentage}%`)

  console.log('\n✅ 反向題分數計算邏輯測試完成')
  console.log('\n📝 說明:')
  console.log('- 一般題目：選擇 1-5 得 1-5 分')
  console.log('- 反向題目：選擇 1-5 得 5-1 分（分數相反）')
  console.log('- 這樣設計是為了確保高分代表高創意能力')
}

testReverseScoring()
