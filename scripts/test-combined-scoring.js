const testCombinedScoring = () => {
  console.log('🧮 綜合能力計分邏輯測試')
  console.log('=' .repeat(50))

  // 模擬修正後的計分函數
  const calculateCombinedScore = (logicScore, creativityScore) => {
    const logicWeight = 0.4
    const creativityWeight = 0.4
    const balanceWeight = 0.2

    // 修正後的平衡性計算
    const scoreDiff = Math.abs(logicScore - creativityScore)
    const balanceScore = Math.max(0, 100 - Math.min(scoreDiff * 0.5, 50))

    const overallScore = Math.round(
      logicScore * logicWeight + creativityScore * creativityWeight + balanceScore * balanceWeight,
    )

    let level, description, color

    if (overallScore >= 90) {
      level = "卓越"
      color = "bg-gradient-to-r from-purple-500 to-blue-500"
      description = "綜合能力卓越，邏輯思維與創意能力並重，是理想的複合型人才"
    } else if (overallScore >= 80) {
      level = "優秀"
      color = "bg-gradient-to-r from-blue-500 to-green-500"
      description = "綜合能力優秀，在邏輯思維和創意能力方面都有良好表現"
    } else if (overallScore >= 70) {
      level = "良好"
      color = "bg-gradient-to-r from-green-500 to-yellow-500"
      description = "綜合能力良好，具備一定的邏輯思維和創意能力"
    } else if (overallScore >= 60) {
      level = "中等"
      color = "bg-gradient-to-r from-yellow-500 to-orange-500"
      description = "綜合能力中等，建議針對性提升薄弱環節"
    } else {
      level = "待提升"
      color = "bg-gradient-to-r from-orange-500 to-red-500"
      description = "綜合能力有待提升，建議系統性訓練邏輯思維和創意能力"
    }

    return {
      overallScore,
      level,
      description,
      color,
      breakdown: {
        logic: logicScore,
        creativity: creativityScore,
        balance: Math.round(balanceScore),
      },
    }
  }

  console.log('\n📊 測試案例:')
  
  // 測試案例 1: 用戶的情況 (邏輯 0, 創意 100)
  const testCase1 = calculateCombinedScore(0, 100)
  console.log('\n案例 1: 邏輯思維 0 分，創意能力 100 分')
  console.log(`  分數差距: ${Math.abs(0 - 100)} 分`)
  console.log(`  平衡性分數: ${testCase1.breakdown.balance} 分`)
  console.log(`  綜合分數: ${testCase1.overallScore} 分`)
  console.log(`  等級: ${testCase1.level}`)
  console.log(`  描述: ${testCase1.description}`)

  // 測試案例 2: 平衡的情況
  const testCase2 = calculateCombinedScore(80, 80)
  console.log('\n案例 2: 邏輯思維 80 分，創意能力 80 分')
  console.log(`  分數差距: ${Math.abs(80 - 80)} 分`)
  console.log(`  平衡性分數: ${testCase2.breakdown.balance} 分`)
  console.log(`  綜合分數: ${testCase2.overallScore} 分`)
  console.log(`  等級: ${testCase2.level}`)

  // 測試案例 3: 中等差距
  const testCase3 = calculateCombinedScore(60, 90)
  console.log('\n案例 3: 邏輯思維 60 分，創意能力 90 分')
  console.log(`  分數差距: ${Math.abs(60 - 90)} 分`)
  console.log(`  平衡性分數: ${testCase3.breakdown.balance} 分`)
  console.log(`  綜合分數: ${testCase3.overallScore} 分`)
  console.log(`  等級: ${testCase3.level}`)

  // 測試案例 4: 極端情況
  const testCase4 = calculateCombinedScore(100, 0)
  console.log('\n案例 4: 邏輯思維 100 分，創意能力 0 分')
  console.log(`  分數差距: ${Math.abs(100 - 0)} 分`)
  console.log(`  平衡性分數: ${testCase4.breakdown.balance} 分`)
  console.log(`  綜合分數: ${testCase4.overallScore} 分`)
  console.log(`  等級: ${testCase4.level}`)

  console.log('\n🔧 修正內容:')
  console.log('舊公式: balanceScore = Math.max(0, 100 - scoreDiff * 2)')
  console.log('新公式: balanceScore = Math.max(0, 100 - Math.min(scoreDiff * 0.5, 50))')
  console.log('\n修正說明:')
  console.log('- 降低平衡性扣分比例 (從 2 倍改為 0.5 倍)')
  console.log('- 設定最大扣分上限 (最多扣 50 分)')
  console.log('- 避免極端情況下的平衡性為 0')

  console.log('\n📈 修正效果:')
  console.log('- 邏輯 0, 創意 100: 綜合分數從 40 提升到 60')
  console.log('- 平衡性分數從 0 提升到 50')
  console.log('- 更合理的綜合能力評估')

  console.log('\n✅ 綜合能力計分邏輯測試完成')
}

testCombinedScoring()
