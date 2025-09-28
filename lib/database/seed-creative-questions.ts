import { createMultipleCreativeQuestions, clearCreativeQuestions } from './models/creative_question'
import { initializeDatabase } from './init'

// 創意能力測試題目數據
const creativeQuestions = [
  {
    statement: "我常能從不同角度看事情，接受多元觀點。",
    category: "flexibility" as const,
    is_reverse: false
  },
  {
    statement: "我有時會提出具挑戰性或爭議性的想法，促使他人表達不同觀點。",
    category: "innovation" as const,
    is_reverse: false
  },
  {
    statement: "我習慣一次只做一件事，不輕易嘗試新方法。",
    category: "flexibility" as const,
    is_reverse: true
  },
  {
    statement: "當靈感枯竭時，我仍能找到突破的方法。",
    category: "imagination" as const,
    is_reverse: false
  },
  {
    statement: "我喜歡與不同背景的人合作，從差異中獲得新想法。",
    category: "innovation" as const,
    is_reverse: false
  },
  {
    statement: "我通常笑得比別人多，並帶動正面氛圍。",
    category: "originality" as const,
    is_reverse: false
  },
  {
    statement: "我會追根究柢思考，直到找到事件背後的原因。",
    category: "imagination" as const,
    is_reverse: false
  },
  {
    statement: "我更喜歡看到整體格局，而不是專注在細節上。",
    category: "originality" as const,
    is_reverse: false
  },
  {
    statement: "我認為規定和框架在組織中絕對必要。",
    category: "flexibility" as const,
    is_reverse: true
  },
  {
    statement: "我通常會先做詳細規劃，然後按部就班執行。",
    category: "flexibility" as const,
    is_reverse: true
  },
  {
    statement: "我能找到更快的方法或捷徑完成任務。",
    category: "innovation" as const,
    is_reverse: false
  },
  {
    statement: "我喜歡解謎或挑戰看似難解的問題。",
    category: "imagination" as const,
    is_reverse: false
  },
  {
    statement: "我能接受頻繁的改變，並調整自己因應。",
    category: "flexibility" as const,
    is_reverse: false
  },
  {
    statement: "我通常不輕易說出心中想法，除非被問到。",
    category: "originality" as const,
    is_reverse: true
  },
  {
    statement: "我經常追求穩定感，避免風險。",
    category: "flexibility" as const,
    is_reverse: true
  },
  {
    statement: "當遇到一個陌生問題時，我會主動去探索，即使沒有明確指引。",
    category: "innovation" as const,
    is_reverse: false
  },
  {
    statement: "當既有方法行不通時，我會刻意嘗試完全相反的方向。",
    category: "originality" as const,
    is_reverse: false
  },
  {
    statement: "即使存在風險，我也願意嘗試新的解決方法。",
    category: "innovation" as const,
    is_reverse: false
  }
]

// 種子創意能力測試題目
export async function seedCreativeQuestions(): Promise<void> {
  try {
    await initializeDatabase()
    console.log('🔄 正在種子創意能力測試題目...')

    // 清空現有題目數據
    await clearCreativeQuestions()

    // 建立題目
    const createdQuestions = await createMultipleCreativeQuestions(creativeQuestions)

    console.log(`✅ 成功建立 ${createdQuestions.length} 道創意能力測試題目`)

    // 顯示題目摘要
    console.log('\n📋 題目摘要:')
    createdQuestions.forEach((question, index) => {
      const reverseText = question.is_reverse ? ' (反向題)' : ''
      console.log(`${index + 1}. ${question.statement.substring(0, 30)}...${reverseText}`)
    })

    console.log('\n📊 統計:')
    const reverseCount = createdQuestions.filter(q => q.is_reverse).length
    const normalCount = createdQuestions.length - reverseCount
    console.log(`- 一般題目: ${normalCount} 題`)
    console.log(`- 反向題目: ${reverseCount} 題`)

  } catch (error) {
    console.error('❌ 種子創意能力測試題目失敗:', error)
    throw error
  }
}

if (require.main === module) {
  seedCreativeQuestions().catch(error => {
    console.error('執行 seedCreativeQuestions 腳本失敗:', error)
    process.exit(1)
  })
}
