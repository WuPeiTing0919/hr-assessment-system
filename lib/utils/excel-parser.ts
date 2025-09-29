import * as XLSX from "xlsx"

export interface LogicQuestionImport {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e?: string
  correct_answer: string
  explanation: string
}

export interface CreativeQuestionImport {
  id: number
  statement: string
  category: "innovation" | "imagination" | "flexibility" | "originality"
  is_reverse: boolean
}

export interface ImportResult {
  success: boolean
  message: string
  data?: LogicQuestionImport[] | CreativeQuestionImport[]
  errors?: string[]
}

// 匯出功能
export function exportLogicQuestionsToExcel(questions: LogicQuestionImport[]): void {
  const headers = [
    "題目ID",
    "題目內容", 
    "選項A",
    "選項B", 
    "選項C",
    "選項D",
    "選項E",
    "正確答案",
    "解釋"
  ]

  const data = questions.map(q => [
    q.id,
    q.question,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.option_e || "",
    q.correct_answer,
    q.explanation
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "邏輯思維題目")
  
  XLSX.writeFile(workbook, "邏輯思維題目範本.xlsx")
}

export function exportCreativeQuestionsToExcel(questions: CreativeQuestionImport[]): void {
  const headers = [
    "題目ID",
    "陳述內容",
    "類別",
    "反向計分"
  ]

  const data = questions.map(q => [
    q.id,
    q.statement,
    q.category,
    q.is_reverse ? "是" : "否"
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "創意能力題目")
  
  XLSX.writeFile(workbook, "創意能力題目範本.xlsx")
}

export function parseExcelFile(file: File, type: "logic" | "creative"): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (type === "logic") {
          const result = parseLogicQuestions(jsonData as any[][])
          resolve(result)
        } else {
          const result = parseCreativeQuestions(jsonData as any[][])
          resolve(result)
        }
      } catch (error) {
        resolve({
          success: false,
          message: "檔案解析失敗，請檢查檔案格式",
          errors: [error instanceof Error ? error.message : "未知錯誤"],
        })
      }
    }

    reader.onerror = () => {
      resolve({
        success: false,
        message: "檔案讀取失敗",
        errors: ["無法讀取檔案"],
      })
    }

    reader.readAsArrayBuffer(file)
  })
}

function parseLogicQuestions(data: any[][]): ImportResult {
  const errors: string[] = []
  const questions: LogicQuestionImport[] = []

  // 跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length < 7) continue

    try {
      const question: LogicQuestionImport = {
        id: Number.parseInt(row[0]) || i,
        question: row[1]?.toString() || "",
        option_a: row[2]?.toString() || "",
        option_b: row[3]?.toString() || "",
        option_c: row[4]?.toString() || "",
        option_d: row[5]?.toString() || "",
        option_e: row[6]?.toString() || undefined,
        correct_answer: row[7]?.toString() || "",
        explanation: row[8]?.toString() || "",
      }

      // 驗證必填欄位
      if (
        !question.question ||
        !question.option_a ||
        !question.option_b ||
        !question.option_c ||
        !question.option_d ||
        !question.correct_answer
      ) {
        errors.push(`第 ${i + 1} 行：缺少必填欄位`)
        continue
      }

      // 驗證正確答案格式
      const validAnswers = question.option_e ? ["A", "B", "C", "D", "E"] : ["A", "B", "C", "D"]
      if (!validAnswers.includes(question.correct_answer.toUpperCase())) {
        errors.push(`第 ${i + 1} 行：正確答案必須是 ${validAnswers.join("、")}`)
        continue
      }

      questions.push(question)
    } catch (error) {
      errors.push(`第 ${i + 1} 行：資料格式錯誤`)
    }
  }

  if (questions.length === 0) {
    return {
      success: false,
      message: "沒有找到有效的題目資料",
      errors,
    }
  }

  return {
    success: true,
    message: `成功解析 ${questions.length} 道題目`,
    data: questions,
    errors: errors.length > 0 ? errors : undefined,
  }
}

function parseCreativeQuestions(data: any[][]): ImportResult {
  const errors: string[] = []
  const questions: CreativeQuestionImport[] = []

  // 跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length < 4) continue

    try {
      const question: CreativeQuestionImport = {
        id: Number.parseInt(row[0]) || i,
        statement: row[1]?.toString() || "",
        category: (row[2]?.toString().toLowerCase() as any) || "innovation",
        is_reverse: row[3]?.toString().toLowerCase() === "是" || row[3]?.toString().toLowerCase() === "true",
      }

      // 驗證必填欄位
      if (!question.statement) {
        errors.push(`第 ${i + 1} 行：缺少陳述內容`)
        continue
      }

      // 驗證類別
      const validCategories = ["innovation", "imagination", "flexibility", "originality"]
      if (!validCategories.includes(question.category)) {
        errors.push(`第 ${i + 1} 行：類別必須是 innovation、imagination、flexibility 或 originality`)
        continue
      }

      questions.push(question)
    } catch (error) {
      errors.push(`第 ${i + 1} 行：資料格式錯誤`)
    }
  }

  if (questions.length === 0) {
    return {
      success: false,
      message: "沒有找到有效的題目資料",
      errors,
    }
  }

  return {
    success: true,
    message: `成功解析 ${questions.length} 道題目`,
    data: questions,
    errors: errors.length > 0 ? errors : undefined,
  }
}
