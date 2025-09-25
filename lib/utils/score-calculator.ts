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
      level: "优秀",
      color: "bg-green-500",
      description: "逻辑思维能力出色，具备卓越的分析和推理能力",
    }
  }
  if (score >= 80) {
    return {
      score,
      level: "良好",
      color: "bg-blue-500",
      description: "逻辑思维能力较强，能够有效分析和解决问题",
    }
  }
  if (score >= 70) {
    return {
      score,
      level: "中等",
      color: "bg-yellow-500",
      description: "逻辑思维能力一般，有一定的分析能力",
    }
  }
  if (score >= 60) {
    return {
      score,
      level: "及格",
      color: "bg-orange-500",
      description: "逻辑思维能力需要提升，建议加强训练",
    }
  }
  return {
    score,
    level: "不及格",
    color: "bg-red-500",
    description: "逻辑思维能力有待加强，需要系统性训练",
  }
}

export function calculateCreativityScore(totalScore: number, maxScore: number): TestScore {
  const score = Math.round((totalScore / maxScore) * 100)

  if (score >= 85) {
    return {
      score,
      level: "极具创意",
      color: "bg-purple-500",
      description: "拥有卓越的创新思维和想象力，能够产生独特的解决方案",
    }
  }
  if (score >= 75) {
    return {
      score,
      level: "很有创意",
      color: "bg-blue-500",
      description: "具备较强的创造性思维能力，善于创新",
    }
  }
  if (score >= 65) {
    return {
      score,
      level: "有一定创意",
      color: "bg-green-500",
      description: "具有一定的创新潜力，可以进一步培养",
    }
  }
  if (score >= 50) {
    return {
      score,
      level: "创意一般",
      color: "bg-yellow-500",
      description: "创造性思维有待提升，建议多参与创新活动",
    }
  }
  return {
    score,
    level: "缺乏创意",
    color: "bg-red-500",
    description: "需要培养创新思维能力，建议接受创意思维训练",
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
  // 综合分数：逻辑40% + 创意40% + 平衡性20%
  const logicWeight = 0.4
  const creativityWeight = 0.4
  const balanceWeight = 0.2

  // 计算平衡性分数（两项分数越接近，平衡性越高）
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
    description = "综合能力卓越，逻辑思维与创意能力并重，是理想的复合型人才"
  } else if (overallScore >= 80) {
    level = "优秀"
    color = "bg-gradient-to-r from-blue-500 to-green-500"
    description = "综合能力优秀，在逻辑思维和创意能力方面都有良好表现"
  } else if (overallScore >= 70) {
    level = "良好"
    color = "bg-gradient-to-r from-green-500 to-yellow-500"
    description = "综合能力良好，具备一定的逻辑思维和创意能力"
  } else if (overallScore >= 60) {
    level = "中等"
    color = "bg-gradient-to-r from-yellow-500 to-orange-500"
    description = "综合能力中等，建议针对性提升薄弱环节"
  } else {
    level = "待提升"
    color = "bg-gradient-to-r from-orange-500 to-red-500"
    description = "综合能力有待提升，建议系统性训练逻辑思维和创意能力"
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
    recommendations.push("建议加强逻辑思维训练，多做推理题和数学题")
    recommendations.push("学习系统性思维方法，如思维导图、流程图等")
  }

  if (creativityScore < 70) {
    recommendations.push("建议参与更多创意活动，如头脑风暴、设计思维工作坊")
    recommendations.push("培养好奇心，多接触不同领域的知识和经验")
  }

  const scoreDiff = Math.abs(logicScore - creativityScore)
  if (scoreDiff > 20) {
    if (logicScore > creativityScore) {
      recommendations.push("您的逻辑思维较强，建议平衡发展创意能力")
    } else {
      recommendations.push("您的创意能力较强，建议平衡发展逻辑思维")
    }
  }

  if (logicScore >= 80 && creativityScore >= 80) {
    recommendations.push("您具备优秀的综合能力，建议承担更多挑战性工作")
    recommendations.push("可以考虑担任需要创新和分析并重的领导角色")
  }

  return recommendations
}
