import * as XLSX from "xlsx"

export interface LogicQuestionImport {
  id: number
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation?: string
}

export interface CreativeQuestionImport {
  id: number
  statement: string
  category: "innovation" | "imagination" | "flexibility" | "originality"
  isReverse: boolean
}

export interface ImportResult {
  success: boolean
  message: string
  data?: LogicQuestionImport[] | CreativeQuestionImport[]
  errors?: string[]
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
        optionA: row[2]?.toString() || "",
        optionB: row[3]?.toString() || "",
        optionC: row[4]?.toString() || "",
        optionD: row[5]?.toString() || "",
        correctAnswer: row[6]?.toString() || "",
        explanation: row[7]?.toString() || "",
      }

      // 驗證必填欄位
      if (
        !question.question ||
        !question.optionA ||
        !question.optionB ||
        !question.optionC ||
        !question.optionD ||
        !question.correctAnswer
      ) {
        errors.push(`第 ${i + 1} 行：缺少必填欄位`)
        continue
      }

      // 驗證正確答案格式
      if (!["A", "B", "C", "D"].includes(question.correctAnswer.toUpperCase())) {
        errors.push(`第 ${i + 1} 行：正確答案必須是 A、B、C 或 D`)
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
        isReverse: row[3]?.toString().toLowerCase() === "是" || row[3]?.toString().toLowerCase() === "true",
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
