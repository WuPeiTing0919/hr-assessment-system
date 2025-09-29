const { executeQuery } = require('../lib/database/connection');

async function checkDatabaseStructure() {
  console.log('🔍 檢查資料庫結構');
  console.log('==============================');

  try {
    // 檢查 combined_test_results 的結構
    console.log('\n📋 combined_test_results 範例:');
    const combinedResults = await executeQuery('SELECT * FROM combined_test_results LIMIT 1');
    if (combinedResults.length > 0) {
      const result = combinedResults[0];
      console.log('ID:', result.id);
      console.log('User ID:', result.user_id);
      console.log('Logic Score:', result.logic_score);
      console.log('Creativity Score:', result.creativity_score);
      console.log('Balance Score:', result.balance_score);
      console.log('Overall Score:', result.overall_score);
      console.log('Logic Breakdown:', typeof result.logic_breakdown, result.logic_breakdown);
      console.log('Creativity Breakdown:', typeof result.creativity_breakdown, result.creativity_breakdown);
    } else {
      console.log('沒有 combined_test_results 資料');
    }

    // 檢查 logic_test_answers 的結構
    console.log('\n📋 logic_test_answers 範例:');
    const logicAnswers = await executeQuery('SELECT * FROM logic_test_answers LIMIT 3');
    if (logicAnswers.length > 0) {
      logicAnswers.forEach((answer, index) => {
        console.log(`答案 ${index + 1}:`, {
          id: answer.id,
          test_result_id: answer.test_result_id,
          question_id: answer.question_id,
          user_answer: answer.user_answer,
          correct_answer: answer.correct_answer,
          is_correct: answer.is_correct,
          explanation: answer.explanation
        });
      });
    } else {
      console.log('沒有 logic_test_answers 資料');
    }

    // 檢查 creative_test_answers 的結構
    console.log('\n📋 creative_test_answers 範例:');
    const creativeAnswers = await executeQuery('SELECT * FROM creative_test_answers LIMIT 3');
    if (creativeAnswers.length > 0) {
      creativeAnswers.forEach((answer, index) => {
        console.log(`答案 ${index + 1}:`, {
          id: answer.id,
          test_result_id: answer.test_result_id,
          question_id: answer.question_id,
          user_answer: answer.user_answer,
          score: answer.score
        });
      });
    } else {
      console.log('沒有 creative_test_answers 資料');
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message);
  }

  console.log('==============================\n');
}

checkDatabaseStructure();
