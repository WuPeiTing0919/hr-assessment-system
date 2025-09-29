import { NextResponse } from "next/server"

export async function GET() {
  try {
    const csvContent = "題目ID,題目內容,選項A,選項B,選項C,選項D,正確答案,解釋\n1,測試題目,選項A,選項B,選項C,選項D,A,測試解釋"
    
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=test.csv"
      }
    })
  } catch (error) {
    console.error("測試匯出失敗:", error)
    return NextResponse.json(
      { success: false, message: "測試匯出失敗" },
      { status: 500 }
    )
  }
}
