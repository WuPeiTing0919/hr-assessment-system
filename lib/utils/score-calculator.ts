export interface TestScore {
  score: number
  level: string
  description: string
  color: string
}

export function calculateLogicScore(correctAnswers: number, totalQuestions: number): TestScore {
  const score = Math.round((correctAnswers / totalQuestions) * 100)

  if (score >= 90) {
    return {
      score,
      level: "優秀",
      color: "bg-green-500",
      description: "邏輯思維能力出色，具備卓越的分析和推理能力",
    }
  }
  if (score >= 80) {
    return {
      score,
      level: "良好",
      color: "bg-blue-500",
      description: "邏輯思維能力較強，能夠有效分析和解決問題",
    }
  }
  if (score >= 70) {
    return {
      score,
      level: "中等",
      color: "bg-yellow-500",
      description: "邏輯思維能力一般，有一定的分析能力",
    }
  }
  if (score >= 60) {
    return {
      score,
      level: "及格",
      color: "bg-orange-500",
      description: "邏輯思維能力需要提升，建議加強訓練",
    }
  }
  return {
    score,
    level: "不及格",
    color: "bg-red-500",
    description: "邏輯思維能力有待加強，需要系統性訓練",
  }
}

export function calculateCreativityScore(totalScore: number, maxScore: number): TestScore {
  const score = Math.round((totalScore / maxScore) * 100)

  if (score >= 85) {
    return {
      score,
      level: "極具創意",
      color: "bg-purple-500",
      description: "擁有卓越的創新思維和想像力，能夠產生獨特的解決方案",
    }
  }
  if (score >= 75) {
    return {
      score,
      level: "很有創意",
      color: "bg-blue-500",
      description: "具備較強的創造性思維能力，善於創新",
    }
  }
  if (score >= 65) {
    return {
      score,
      level: "有一定創意",
      color: "bg-green-500",
      description: "具有一定的創新潛力，可以進一步培養",
    }
  }
  if (score >= 50) {
    return {
      score,
      level: "創意一般",
      color: "bg-yellow-500",
      description: "創造性思維有待提升，建議多參與創新活動",
    }
  }
  return {
    score,
    level: "缺乏創意",
    color: "bg-red-500",
    description: "需要培養創新思維能力，建議接受創意思維訓練",
  }
}

export function calculateCombinedScore(
  logicScore: number,
  creativityScore: number,
): {
  overallScore: number
  level: string
  description: string
  color: string
  breakdown: {
    logic: number
    creativity: number
    balance: number
  }
} {
  // 綜合分數：邏輯40% + 創意40% + 平衡性20%
  const logicWeight = 0.4
  const creativityWeight = 0.4
  const balanceWeight = 0.2

  // 計算平衡性分數（兩項分數越接近，平衡性越高）
  const scoreDiff = Math.abs(logicScore - creativityScore)
  const balanceScore = Math.max(0, 100 - scoreDiff * 2)

  const overallScore = Math.round(
    logicScore * logicWeight + creativityScore * creativityWeight + balanceScore * balanceWeight,
  )

  let level: string
  let description: string
  let color: string

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

export function getRecommendations(logicScore: number, creativityScore: number): string[] {
  const recommendations: string[] = []

  if (logicScore < 70) {
    recommendations.push("建議加強邏輯思維訓練，多做推理題和數學題")
    recommendations.push("學習系統性思維方法，如思維導圖、流程圖等")
  }

  if (creativityScore < 70) {
    recommendations.push("建議參與更多創意活動，如頭腦風暴、設計思維工作坊")
    recommendations.push("培養好奇心，多接觸不同領域的知識和經驗")
  }

  const scoreDiff = Math.abs(logicScore - creativityScore)
  if (scoreDiff > 20) {
    if (logicScore > creativityScore) {
      recommendations.push("您的邏輯思維較強，建議平衡發展創意能力")
    } else {
      recommendations.push("您的創意能力較強，建議平衡發展邏輯思維")
    }
  }

  if (logicScore >= 80 && creativityScore >= 80) {
    recommendations.push("您具備優秀的綜合能力，建議承擔更多挑戰性工作")
    recommendations.push("可以考慮擔任需要創新和分析並重的領導角色")
  }

  return recommendations
}
