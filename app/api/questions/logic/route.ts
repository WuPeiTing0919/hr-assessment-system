import { NextResponse } from "next/server"
import { getAllLogicQuestions } from "@/lib/database/models/logic_question"

export async function GET() {
  try {
    const questions = await getAllLogicQuestions()
    
    return NextResponse.json({
      success: true,
      data: questions
    })
  } catch (error) {
    console.error("獲取邏輯題目失敗:", error)
    return NextResponse.json(
      { success: false, message: "獲取邏輯題目失敗" },
      { status: 500 }
    )
  }
}
