export interface LogicQuestion {
  id: number
  question: string
  options: {
    value: string
    text: string
  }[]
  correctAnswer: string
  explanation?: string
}

export const logicQuestions: LogicQuestion[] = [
  {
    id: 1,
    question: "如果所有的玫瑰都是花，所有的花都需要水，那麼可以得出什麼結論？",
    options: [
      { value: "A", text: "所有的玫瑰都需要水" },
      { value: "B", text: "所有需要水的都是玫瑰" },
      { value: "C", text: "有些花不是玫瑰" },
      { value: "D", text: "玫瑰不需要土壤" },
    ],
    correctAnswer: "A",
    explanation: "根據三段論推理，所有玫瑰都是花，所有花都需要水，因此所有玫瑰都需要水。",
  },
  {
    id: 2,
    question: "在一個序列中：2, 6, 12, 20, 30, ?。下一個數字是什麼？",
    options: [
      { value: "A", text: "40" },
      { value: "B", text: "42" },
      { value: "C", text: "44" },
      { value: "D", text: "48" },
    ],
    correctAnswer: "B",
    explanation: "序列規律：n×(n+1)，即1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42",
  },
  {
    id: 3,
    question:
      "五個人坐成一排，張三不坐兩端，李四不坐中間，王五必須坐在張三的右邊。如果趙六坐在最左邊，那麼誰坐在最右邊？",
    options: [
      { value: "A", text: "張三" },
      { value: "B", text: "李四" },
      { value: "C", text: "王五" },
      { value: "D", text: "錢七" },
    ],
    correctAnswer: "C",
    explanation: "根據約束條件推理，趙六在最左邊，張三不坐兩端且王五在其右邊，李四不坐中間，最終王五坐在最右邊。",
  },
  {
    id: 4,
    question: "如果今天是星期三，那麼100天後是星期幾？",
    options: [
      { value: "A", text: "星期一" },
      { value: "B", text: "星期二" },
      { value: "C", text: "星期三" },
      { value: "D", text: "星期五" },
    ],
    correctAnswer: "D",
    explanation: "100÷7=14餘2，所以100天後是星期三往後推2天，即星期五。",
  },
  {
    id: 5,
    question:
      "在一個班級中，會游泳的學生有15人，會騎自行車的學生有18人，兩樣都會的學生有8人，兩樣都不會的學生有5人。這個班級總共有多少學生？",
    options: [
      { value: "A", text: "28人" },
      { value: "B", text: "30人" },
      { value: "C", text: "32人" },
      { value: "D", text: "35人" },
    ],
    correctAnswer: "B",
    explanation: "使用集合論：總人數 = 會游泳 + 會騎車 - 兩樣都會 + 兩樣都不會 = 15 + 18 - 8 + 5 = 30人",
  },
  {
    id: 6,
    question: "一個立方體的每個面都塗上不同的顏色，然後切成27個小立方體。問有多少個小立方體恰好有兩個面被塗色？",
    options: [
      { value: "A", text: "8個" },
      { value: "B", text: "12個" },
      { value: "C", text: "16個" },
      { value: "D", text: "20個" },
    ],
    correctAnswer: "B",
    explanation: "3×3×3立方體中，恰好有兩個面塗色的小立方體位於大立方體的12條邊上（除去8個角），共12個。",
  },
  {
    id: 7,
    question: "如果A>B，B>C，C>D，那麼下列哪個結論一定正確？",
    options: [
      { value: "A", text: "A>D" },
      { value: "B", text: "A=D" },
      { value: "C", text: "B=C" },
      { value: "D", text: "C<A" },
    ],
    correctAnswer: "A",
    explanation: "根據傳遞性，A>B>C>D，因此A>D一定成立。",
  },
  {
    id: 8,
    question: "一個時鐘在6點整時，時針和分針的夾角是多少度？",
    options: [
      { value: "A", text: "180度" },
      { value: "B", text: "90度" },
      { value: "C", text: "120度" },
      { value: "D", text: "150度" },
    ],
    correctAnswer: "A",
    explanation: "6點整時，時針指向6，分針指向12，它們之間相隔6個小時刻度，每個刻度30度，所以夾角是6×30=180度。",
  },
  {
    id: 9,
    question:
      "在一次考試中，小明的成績比小紅高，小紅的成績比小李高，小李的成績比小王高。如果小王得了80分，小明得了92分，那麼小紅可能得了多少分？",
    options: [
      { value: "A", text: "78分" },
      { value: "B", text: "85分" },
      { value: "C", text: "94分" },
      { value: "D", text: "79分" },
    ],
    correctAnswer: "B",
    explanation: "根據排序：小明(92)>小紅>小李>小王(80)，所以小紅的分數在80-92之間，只有85分符合條件。",
  },
  {
    id: 10,
    question:
      "有三個盒子，每個盒子裡都有一些球。第一個盒子裡的球數是第二個盒子的2倍，第二個盒子裡的球數是第三個盒子的3倍。如果總共有66個球，那麼第二個盒子裡有多少個球？",
    options: [
      { value: "A", text: "18個" },
      { value: "B", text: "12個" },
      { value: "C", text: "15個" },
      { value: "D", text: "21個" },
    ],
    correctAnswer: "A",
    explanation:
      "設第三個盒子有x個球，則第二個盒子有3x個球，第一個盒子有6x個球。總和：x+3x+6x=10x=66，所以x=6.6，第二個盒子有3×6=18個球。",
  },
]
