import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { 
  createLogicQuestion, 
  getAllLogicQuestions,
  clearLogicQuestions 
} from "@/lib/database/models/logic_question"
import { 
  createCreativeQuestion, 
  getAllCreativeQuestions,
  clearCreativeQuestions 
} from "@/lib/database/models/creative_question"

// 定義解析結果介面
interface ImportResult {
  success: boolean
  message: string
  data?: any[]
  errors?: string[]
}

// 解析邏輯題目
function parseLogicQuestions(data: any[][]): ImportResult {
  const errors: string[] = []
  const questions: any[] = []

  // 跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length < 7) continue

    try {
      const question = {
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

// 解析創意題目
function parseCreativeQuestions(data: any[][]): ImportResult {
  const errors: string[] = []
  const questions: any[] = []

  // 跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length < 4) continue

    try {
      const question = {
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as "logic" | "creative"

    if (!file || !type) {
      return NextResponse.json(
        { success: false, message: "缺少檔案或題目類型" },
        { status: 400 }
      )
    }

    console.log(`開始處理 ${type} 題目匯入，檔案大小: ${file.size} bytes`)

    // 讀取檔案內容
    const arrayBuffer = await file.arrayBuffer()
    console.log(`檔案讀取完成，大小: ${arrayBuffer.byteLength} bytes`)

    // 根據檔案類型處理
    let jsonData
    if (file.name.endsWith('.csv')) {
      // 處理 CSV 檔案
      const text = new TextDecoder('utf-8').decode(arrayBuffer)
      const lines = text.split('\n').filter(line => line.trim())
      jsonData = lines.map(line => {
        // 簡單的 CSV 解析（處理引號包圍的欄位）
        const result = []
        let current = ''
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        result.push(current.trim())
        return result
      })
    } else {
      // 處理 Excel 檔案
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    }

    console.log(`資料解析完成，共 ${jsonData.length} 行`)

    // 解析資料
    let result
    if (type === "logic") {
      result = parseLogicQuestions(jsonData as any[][])
    } else {
      result = parseCreativeQuestions(jsonData as any[][])
    }

    console.log(`解析結果: ${result.success ? '成功' : '失敗'}, ${result.message}`)

    if (!result.success || !result.data) {
      return NextResponse.json({
        success: false,
        message: result.message,
        errors: result.errors
      })
    }

    if (type === "logic") {
      const questions = result.data as any[]
      
      // 清空現有邏輯題目
      await clearLogicQuestions()
      
      // 插入新題目
      for (const question of questions) {
        await createLogicQuestion({
          question: question.question,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          option_e: question.option_e || null,
          correct_answer: question.correct_answer,
          explanation: question.explanation
        })
      }

      return NextResponse.json({
        success: true,
        message: `成功匯入 ${questions.length} 道邏輯思維題目`,
        count: questions.length
      })

    } else {
      const questions = result.data as any[]
      
      // 清空現有創意題目
      await clearCreativeQuestions()
      
      // 插入新題目
      for (const question of questions) {
        await createCreativeQuestion({
          statement: question.statement,
          category: question.category,
          is_reverse: question.is_reverse
        })
      }

      return NextResponse.json({
        success: true,
        message: `成功匯入 ${questions.length} 道創意能力題目`,
        count: questions.length
      })
    }

  } catch (error) {
    console.error("匯入題目失敗:", error)
    return NextResponse.json(
      { success: false, message: "匯入失敗，請檢查檔案格式" },
      { status: 500 }
    )
  }
}
