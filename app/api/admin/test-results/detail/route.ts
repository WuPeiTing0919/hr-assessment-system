import { NextRequest, NextResponse } from "next/server"
import { getTestResultById } from "@/lib/database/models/test_result"
import { getLogicTestAnswersByTestResultId } from "@/lib/database/models/logic_test_answer"
import { getCreativeTestAnswersByTestResultId } from "@/lib/database/models/creative_test_answer"
import { getCombinedTestResultById } from "@/lib/database/models/combined_test_result"
import { findUserById } from "@/lib/database/models/user"
import { findLogicQuestionById } from "@/lib/database/models/logic_question"
import { findCreativeQuestionById } from "@/lib/database/models/creative_question"
import { executeQuery } from "@/lib/database/connection"

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
        // 綜合測試的詳細答案存儲在 logic_breakdown 和 creativity_breakdown 中
        console.log('Debug: combinedResult.logic_breakdown:', combinedResult.logic_breakdown)
        console.log('Debug: combinedResult.creativity_breakdown:', combinedResult.creativity_breakdown)
        
        if (combinedResult.logic_breakdown && typeof combinedResult.logic_breakdown === 'object') {
          const logicBreakdown = combinedResult.logic_breakdown as any
          console.log('Debug: logicBreakdown.answers:', logicBreakdown.answers)
          if (logicBreakdown.answers && typeof logicBreakdown.answers === 'object') {
            // 處理物件格式的答案
            const answerEntries = Object.entries(logicBreakdown.answers)
            console.log('Debug: 邏輯題答案條目:', answerEntries)
            
            // 獲取所有邏輯題目
            const allLogicQuestions = await executeQuery('SELECT * FROM logic_questions ORDER BY id')
            console.log('Debug: 所有邏輯題目數量:', allLogicQuestions.length)
            
            for (let i = 0; i < answerEntries.length; i++) {
              const [questionIndex, userAnswer] = answerEntries[i]
              const question = allLogicQuestions[parseInt(questionIndex)] // 使用索引獲取題目
              if (question) {
                // 判斷是否正確
                const isCorrect = userAnswer === question.correct_answer
                questions.push({
                  ...question,
                  type: 'logic',
                  userAnswer: userAnswer as string,
                  isCorrect: isCorrect,
                  correctAnswer: question.correct_answer,
                  explanation: question.explanation
                })
              }
            }
          }
        }

        if (combinedResult.creativity_breakdown && typeof combinedResult.creativity_breakdown === 'object') {
          const creativityBreakdown = combinedResult.creativity_breakdown as any
          console.log('Debug: creativityBreakdown.answers:', creativityBreakdown.answers)
          if (creativityBreakdown.answers && typeof creativityBreakdown.answers === 'object') {
            // 處理物件格式的答案
            const answerEntries = Object.entries(creativityBreakdown.answers)
            console.log('Debug: 創意題答案條目:', answerEntries)
            
            // 獲取所有創意題目
            const allCreativeQuestions = await executeQuery('SELECT * FROM creative_questions ORDER BY id')
            console.log('Debug: 所有創意題目數量:', allCreativeQuestions.length)
            
            for (let i = 0; i < answerEntries.length; i++) {
              const [questionIndex, score] = answerEntries[i]
              const question = allCreativeQuestions[parseInt(questionIndex)] // 使用索引獲取題目
              if (question) {
                questions.push({
                  ...question,
                  type: 'creative',
                  userAnswer: score.toString(), // 創意題的答案就是分數
                  score: score as number,
                  isReverse: question.is_reverse
                })
              }
            }
          }
        }
        
        console.log('Debug: 總共找到題目數量:', questions.length)

        // 如果 breakdown 中沒有詳細答案，嘗試從單獨的答案表獲取
        if (questions.length === 0) {
          console.log('從 breakdown 中沒有找到答案，嘗試從答案表獲取...')
          const logicAnswers = await getLogicTestAnswersByTestResultId(testResultId)
          const creativeAnswers = await getCreativeTestAnswersByTestResultId(testResultId)

          // 處理邏輯題答案
          for (const answer of logicAnswers) {
            const question = await findLogicQuestionById(answer.question_id)
            if (question) {
              questions.push({
                ...question,
                type: 'logic',
                userAnswer: answer.user_answer,
                isCorrect: answer.is_correct,
                correctAnswer: answer.correct_answer,
                explanation: answer.explanation
              })
            }
          }

          // 處理創意題答案
          for (const answer of creativeAnswers) {
            const question = await findCreativeQuestionById(answer.question_id)
            if (question) {
              questions.push({
                ...question,
                type: 'creative',
                userAnswer: answer.user_answer,
                score: answer.score,
                isReverse: answer.is_reverse
              })
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
          console.log('Debug: 邏輯測試答案數量:', answers.length)
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
          console.log('Debug: 創意測試答案數量:', answers.length)
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
        
        console.log('Debug: 單一測試類型題目數量:', questions.length)
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