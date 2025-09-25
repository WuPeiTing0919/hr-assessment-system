export interface CreativeQuestion {
  id: number
  statement: string
  isReverse?: boolean // 是否為反向計分題
  category: "innovation" | "imagination" | "flexibility" | "originality"
}

export const creativeQuestions: CreativeQuestion[] = [
  {
    id: 1,
    statement: "我經常能想出別人想不到的解決方案",
    category: "innovation",
  },
  {
    id: 2,
    statement: "我喜歡嘗試新的做事方法，即使可能會失敗",
    category: "innovation",
  },
  {
    id: 3,
    statement: "我更喜歡按照既定的規則和程序工作",
    isReverse: true,
    category: "flexibility",
  },
  {
    id: 4,
    statement: "我能夠從不同的角度看待同一個問題",
    category: "flexibility",
  },
  {
    id: 5,
    statement: "我經常會有一些奇思妙想",
    category: "imagination",
  },
  {
    id: 6,
    statement: "我喜歡參與腦力激盪活動",
    category: "innovation",
  },
  {
    id: 7,
    statement: "我認為傳統的方法通常是最好的",
    isReverse: true,
    category: "originality",
  },
  {
    id: 8,
    statement: "我能夠將看似無關的概念聯繫起來",
    category: "imagination",
  },
  {
    id: 9,
    statement: "我喜歡挑戰現有的做事方式",
    category: "originality",
  },
  {
    id: 10,
    statement: "我在面對問題時，通常能想出多種解決方案",
    category: "flexibility",
  },
  {
    id: 11,
    statement: "我避免做那些結果不確定的事情",
    isReverse: true,
    category: "innovation",
  },
  {
    id: 12,
    statement: "我經常會想像一些不存在的情景或故事",
    category: "imagination",
  },
  {
    id: 13,
    statement: "我喜歡創造性的工作任務",
    category: "originality",
  },
  {
    id: 14,
    statement: "我能夠快速適應新的工作環境和要求",
    category: "flexibility",
  },
  {
    id: 15,
    statement: "我更願意改進現有的方法而不是創造全新的方法",
    isReverse: true,
    category: "originality",
  },
  {
    id: 16,
    statement: "我經常會想到一些獨特的想法",
    category: "imagination",
  },
  {
    id: 17,
    statement: "我喜歡探索未知的領域",
    category: "innovation",
  },
  {
    id: 18,
    statement: "我認為穩定性比創新性更重要",
    isReverse: true,
    category: "innovation",
  },
  {
    id: 19,
    statement: "我能夠在限制條件下找到創造性的解決方案",
    category: "flexibility",
  },
  {
    id: 20,
    statement: "我經常會提出與眾不同的觀點",
    category: "originality",
  },
]
