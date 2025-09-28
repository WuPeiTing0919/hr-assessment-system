import { createMultipleLogicQuestions, clearLogicQuestions } from './models/logic_question'
import { initializeDatabase } from './init'

// 邏輯思維測試題目數據
const logicQuestions = [
  {
    question: "如果所有的玫瑰都是花，而有些花是紅色的，那麼我們可以確定：",
    option_a: "所有玫瑰都是紅色的",
    option_b: "有些玫瑰是紅色的",
    option_c: "不能確定玫瑰的顏色",
    option_d: "沒有玫瑰是紅色的",
    option_e: "所有花都是玫瑰",
    correct_answer: "C" as const,
    explanation: "根據題目條件：1) 所有玫瑰都是花 2) 有些花是紅色的。我們只能確定有些花是紅色的，但無法確定這些紅色的花中是否包含玫瑰。因此不能確定玫瑰的顏色。"
  },
  {
    question: "2, 4, 8, 16, ?, 64 中間的數字是：",
    option_a: "24",
    option_b: "28",
    option_c: "32",
    option_d: "36",
    option_e: "40",
    correct_answer: "C" as const,
    explanation: "這是一個等比數列，公比為2。數列規律：2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64。所以中間的數字是32。"
  },
  {
    question: "在一個圓形跑道上，強強和茂茂同時同地出發，強強每分鐘跑400米，茂茂每分鐘跑300米。如果跑道周長是1200米，強強第一次追上茂茂需要多少分鐘？",
    option_a: "10分鐘",
    option_b: "12分鐘",
    option_c: "15分鐘",
    option_d: "18分鐘",
    option_e: "20分鐘",
    correct_answer: "B" as const,
    explanation: "強強比茂茂每分鐘快100米（400-300=100）。要追上茂茂，強強需要比茂茂多跑一圈（1200米）。所需時間 = 1200米 ÷ 100米/分鐘 = 12分鐘。"
  },
  {
    question: "五個人坐成一排，已知：A不坐兩端，B坐在C的左邊，D坐在E的右邊。如果E坐在中間，那麼從左到右的順序可能是：",
    option_a: "B-C-E-D-A",
    option_b: "D-B-E-C-A",
    option_c: "B-A-E-C-D",
    option_d: "D-A-E-B-C",
    option_e: "B-C-E-A-D",
    correct_answer: "B" as const,
    explanation: "E在中間（第3位）。D在E的右邊，所以D在第4或5位。B在C的左邊，所以B在C前面。A不在兩端，所以A在第2、3、4位。只有選項B符合：D(1)-B(2)-E(3)-C(4)-A(5)。"
  },
  {
    question: "如果今天是星期三，那麼100天後是星期幾？",
    option_a: "星期一",
    option_b: "星期二",
    option_c: "星期三",
    option_d: "星期四",
    option_e: "星期五",
    correct_answer: "E" as const,
    explanation: "一週有7天，100÷7=14餘2。所以100天後相當於14週又2天。從星期三開始，往後數2天：星期三→星期四→星期五。"
  },
  {
    question: "一個班級有30個學生，其中20個會游泳，25個會騎車，那麼既會游泳又會騎車的學生至少有多少人？",
    option_a: "10人",
    option_b: "15人",
    option_c: "20人",
    option_d: "25人",
    option_e: "30人",
    correct_answer: "B" as const,
    explanation: "使用容斥原理：會游泳或會騎車的人數 = 會游泳人數 + 會騎車人數 - 既會游泳又會騎車的人數。30 = 20 + 25 - 既會游泳又會騎車的人數。所以既會游泳又會騎車的人數 = 45 - 30 = 15人。"
  },
  {
    question: "四個朋友分別戴紅、藍、綠、黃四種顏色的帽子。已知：小王不戴紅帽，小李不戴藍帽，小陳不戴綠帽，小趙不戴黃帽。如果小王戴藍帽，那麼小趙戴什麼顏色的帽子？",
    option_a: "紅帽",
    option_b: "藍帽",
    option_c: "綠帽",
    option_d: "黃帽",
    option_e: "無法確定",
    correct_answer: "E" as const,
    explanation: "小王戴藍帽。小李不戴藍帽，所以小李只能戴紅、綠、黃帽。小陳不戴綠帽，所以小陳只能戴紅、藍、黃帽（但藍帽已被小王戴走）。小趙不戴黃帽，所以小趙只能戴紅、藍、綠帽（但藍帽已被小王戴走）。由於信息不足，無法確定小趙的帽子顏色。"
  },
  {
    question: "在一個密碼中，A=1, B=2, C=3...Z=26。如果「CAT」的數值和是24，那麼「DOG」的數值和是：",
    option_a: "26",
    option_b: "27",
    option_c: "28",
    option_d: "29",
    option_e: "30",
    correct_answer: "A" as const,
    explanation: "C=3, A=1, T=20，所以CAT=3+1+20=24。D=4, O=15, G=7，所以DOG=4+15+7=26。"
  },
  {
    question: "一隻青蛙掉進了一口18米深的井裡。每天白天它向上爬6米，晚上向下滑落3米。按這一速度，問青蛙多少天能爬出井口？",
    option_a: "3",
    option_b: "4",
    option_c: "5",
    option_d: "6",
    option_e: "7",
    correct_answer: "C" as const,
    explanation: "每天淨爬升：6-3=3米。前4天共爬升：4×3=12米，還剩18-12=6米。第5天白天爬6米就能到達井口，不需要再滑落。所以需要5天。"
  },
  {
    question: "有兄妹倆，1993年的時候，哥哥21歲，妹妹的年齡當時是7歲，請問到什麼時候，哥哥的年齡才會是妹妹年齡的兩倍？",
    option_a: "1997年",
    option_b: "1998年",
    option_c: "1999年",
    option_d: "2000年",
    option_e: "2001年",
    correct_answer: "D" as const,
    explanation: "1993年時哥哥21歲，妹妹7歲，年齡差是14歲。設x年後哥哥年齡是妹妹的2倍：21+x = 2(7+x)，解得x=7。所以是1993+7=2000年。驗證：2000年哥哥28歲，妹妹14歲，28=2×14。"
  }
]

// 種子邏輯思維題目
export async function seedLogicQuestions(): Promise<void> {
  try {
    console.log('🔄 正在種子邏輯思維題目...')
    
    // 確保資料庫已初始化
    await initializeDatabase()
    
    // 清空現有題目
    await clearLogicQuestions()
    
    // 建立題目
    const createdQuestions = await createMultipleLogicQuestions(logicQuestions)
    
    console.log(`✅ 成功建立 ${createdQuestions.length} 道邏輯思維題目`)
    
    // 顯示題目摘要
    console.log('\n📋 題目摘要:')
    createdQuestions.forEach((question, index) => {
      console.log(`${index + 1}. ${question.question.substring(0, 30)}... (答案: ${question.correct_answer})`)
    })
    
  } catch (error) {
    console.error('❌ 種子邏輯思維題目失敗:', error)
    throw error
  }
}

// 如果直接執行此檔案，則執行種子
if (require.main === module) {
  seedLogicQuestions().catch(console.error)
}
