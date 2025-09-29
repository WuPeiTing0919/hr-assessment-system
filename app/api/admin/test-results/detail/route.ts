import { NextRequest, NextResponse } from "next/server"
import { getTestResultById } from "@/lib/database/models/test_result"
import { getLogicTestAnswersByTestResultId } from "@/lib/database/models/logic_test_answer"
import { getCreativeTestAnswersByTestResultId } from "@/lib/database/models/creative_test_answer"
import { getCombinedTestResultById } from "@/lib/database/models/combined_test_result"
import { findUserById } from "@/lib/database/models/user"
import { findLogicQuestionById } from "@/lib/database/models/logic_question"
import { findCreativeQuestionById } from "@/lib/database/models/creative_question"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testResultId = searchParams.get("testResultId")
    const testType = searchParams.get("testType") as "logic" | "creative" | "combined"

    if (!testResultId || !testType) {
      return NextResponse.json(
        { success: false, message: "缺少必要參數" },
        { status: 400 }
      )
    }

    let result: any = null
    let user: any = null
    let questions: any[] = []
    let answers: any[] = []

    // 獲取用戶資訊
    if (testType === "combined") {
      const combinedResult = await getCombinedTestResultById(testResultId)
      if (combinedResult) {
        user = await findUserById(combinedResult.user_id)
        result = {
          id: combinedResult.id,
          userId: combinedResult.user_id,
          type: "combined",
          score: combinedResult.overall_score,
          completedAt: combinedResult.completed_at,
          details: {
            logicScore: combinedResult.logic_score,
            creativeScore: combinedResult.creativity_score,
            abilityBalance: combinedResult.balance_score,
            breakdown: combinedResult.logic_breakdown
          }
        }

        // 獲取綜合測試的詳細答題資料
        // 從 logic_breakdown 中獲取邏輯題答案
        if (combinedResult.logic_breakdown && typeof combinedResult.logic_breakdown === 'object') {
          const logicBreakdown = combinedResult.logic_breakdown as any
          if (logicBreakdown.answers && Array.isArray(logicBreakdown.answers)) {
            for (const answer of logicBreakdown.answers) {
              const question = await findLogicQuestionById(answer.questionId)
              if (question) {
                questions.push({
                  ...question,
                  type: 'logic',
                  userAnswer: answer.userAnswer,
                  isCorrect: answer.isCorrect,
                  correctAnswer: answer.correctAnswer,
                  explanation: answer.explanation
                })
              }
            }
          }
        }

        // 從 creativity_breakdown 中獲取創意題答案
        if (combinedResult.creativity_breakdown && typeof combinedResult.creativity_breakdown === 'object') {
          const creativityBreakdown = combinedResult.creativity_breakdown as any
          if (creativityBreakdown.answers && Array.isArray(creativityBreakdown.answers)) {
            for (const answer of creativityBreakdown.answers) {
              const question = await findCreativeQuestionById(answer.questionId)
              if (question) {
                questions.push({
                  ...question,
                  type: 'creative',
                  userAnswer: answer.userAnswer,
                  score: answer.score,
                  isReverse: answer.isReverse
                })
              }
            }
          }
        }
      }
    } else {
      const testResult = await getTestResultById(testResultId)
      if (testResult) {
        user = await findUserById(testResult.user_id)
        result = {
          id: testResult.id,
          userId: testResult.user_id,
          type: testResult.test_type,
          score: testResult.score,
          completedAt: testResult.completed_at
        }

        // 獲取詳細答案
        if (testType === "logic") {
          answers = await getLogicTestAnswersByTestResultId(testResultId)
          // 獲取對應的題目
          for (const answer of answers) {
            const question = await findLogicQuestionById(answer.question_id)
            if (question) {
              questions.push({
                ...question,
                userAnswer: answer.user_answer,
                isCorrect: answer.is_correct,
                correctAnswer: answer.correct_answer,
                explanation: answer.explanation
              })
            }
          }
        } else if (testType === "creative") {
          answers = await getCreativeTestAnswersByTestResultId(testResultId)
          // 獲取對應的題目
          for (const answer of answers) {
            const question = await findCreativeQuestionById(answer.question_id)
            if (question) {
              questions.push({
                ...question,
                userAnswer: answer.user_answer,
                score: answer.score,
                isReverse: answer.is_reverse
              })
            }
          }
        }
      }
    }

    if (!result || !user) {
      return NextResponse.json(
        { success: false, message: "找不到測試結果" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        result,
        user,
        questions,
        answers
      }
    })

  } catch (error) {
    console.error("獲取詳細測試結果失敗:", error)
    return NextResponse.json(
      { success: false, message: "獲取詳細結果失敗", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
