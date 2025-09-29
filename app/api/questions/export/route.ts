import { NextRequest, NextResponse } from "next/server"
import { getAllLogicQuestions } from "@/lib/database/models/logic_question"
import { getAllCreativeQuestions } from "@/lib/database/models/creative_question"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as "logic" | "creative"

    if (!type) {
      return NextResponse.json(
        { success: false, message: "缺少題目類型參數" },
        { status: 400 }
      )
    }

    if (type === "logic") {
      const questions = await getAllLogicQuestions()
      
      // 生成 CSV 格式的資料
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

      // 轉換為 CSV 格式
      const csvRows = [headers, ...data].map(row => 
        row.map(cell => {
          const escaped = String(cell).replace(/"/g, '""')
          return `"${escaped}"`
        }).join(",")
      )
      
      const csvContent = csvRows.join("\n")
      
      // 直接使用 UTF-8 BOM 字節
      const bomBytes = new Uint8Array([0xEF, 0xBB, 0xBF]) // UTF-8 BOM
      const contentBytes = new TextEncoder().encode(csvContent)
      const result = new Uint8Array(bomBytes.length + contentBytes.length)
      result.set(bomBytes)
      result.set(contentBytes, bomBytes.length)
      
      const base64Content = Buffer.from(result).toString('base64')

      return new NextResponse(JSON.stringify({
        success: true,
        data: base64Content,
        filename: "邏輯思維題目範本.csv",
        contentType: "text/csv; charset=utf-8"
      }), {
        headers: {
          "Content-Type": "application/json"
        }
      })

    } else {
      const questions = await getAllCreativeQuestions()
      
      // 生成 CSV 格式的資料
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

      // 轉換為 CSV 格式
      const csvRows = [headers, ...data].map(row => 
        row.map(cell => {
          const escaped = String(cell).replace(/"/g, '""')
          return `"${escaped}"`
        }).join(",")
      )
      
      const csvContent = csvRows.join("\n")
      
      // 直接使用 UTF-8 BOM 字節
      const bomBytes = new Uint8Array([0xEF, 0xBB, 0xBF]) // UTF-8 BOM
      const contentBytes = new TextEncoder().encode(csvContent)
      const result = new Uint8Array(bomBytes.length + contentBytes.length)
      result.set(bomBytes)
      result.set(contentBytes, bomBytes.length)
      
      const base64Content = Buffer.from(result).toString('base64')

      return new NextResponse(JSON.stringify({
        success: true,
        data: base64Content,
        filename: "創意能力題目範本.csv",
        contentType: "text/csv; charset=utf-8"
      }), {
        headers: {
          "Content-Type": "application/json"
        }
      })
    }

  } catch (error) {
    console.error("匯出題目失敗:", error)
    console.error("錯誤詳情:", error instanceof Error ? error.message : String(error))
    console.error("錯誤堆疊:", error instanceof Error ? error.stack : "無堆疊資訊")
    return NextResponse.json(
      { success: false, message: "匯出失敗", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
