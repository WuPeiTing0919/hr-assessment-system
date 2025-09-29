const { executeQuery } = require('../lib/database/connection');

async function checkCombinedBreakdown() {
  console.log('🔍 檢查綜合測試的 breakdown 資料');
  console.log('==============================');

  try {
    // 檢查 combined_test_results 的 breakdown 資料
    const results = await executeQuery('SELECT id, user_id, logic_breakdown, creativity_breakdown FROM combined_test_results LIMIT 3');
    
    results.forEach((result, index) => {
      console.log(`\n📋 綜合測試 ${index + 1}:`);
      console.log('ID:', result.id);
      console.log('User ID:', result.user_id);
      console.log('Logic Breakdown 類型:', typeof result.logic_breakdown);
      console.log('Creativity Breakdown 類型:', typeof result.creativity_breakdown);
      
      if (result.logic_breakdown) {
        console.log('Logic Breakdown 內容:', JSON.stringify(result.logic_breakdown, null, 2));
      }
      
      if (result.creativity_breakdown) {
        console.log('Creativity Breakdown 內容:', JSON.stringify(result.creativity_breakdown, null, 2));
      }
    });

    // 檢查 logic_test_answers 資料
    console.log('\n📋 Logic Test Answers:');
    const logicAnswers = await executeQuery('SELECT * FROM logic_test_answers LIMIT 3');
    logicAnswers.forEach((answer, index) => {
      console.log(`答案 ${index + 1}:`, {
        test_result_id: answer.test_result_id,
        question_id: answer.question_id,
        user_answer: answer.user_answer,
        is_correct: answer.is_correct
      });
    });

    // 檢查 creative_test_answers 資料
    console.log('\n📋 Creative Test Answers:');
    const creativeAnswers = await executeQuery('SELECT * FROM creative_test_answers LIMIT 3');
    creativeAnswers.forEach((answer, index) => {
      console.log(`答案 ${index + 1}:`, {
        test_result_id: answer.test_result_id,
        question_id: answer.question_id,
        user_answer: answer.user_answer,
        score: answer.score
      });
    });

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message);
  }

  console.log('==============================\n');
}

checkCombinedBreakdown();
