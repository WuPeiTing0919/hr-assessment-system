const { executeQuery } = require('../lib/database/connection');

async function checkSingleTestAnswers() {
  console.log('🔍 檢查單一測試類型的答案資料');
  console.log('==============================');

  try {
    // 檢查 test_results 表
    console.log('\n📋 Test Results:');
    const testResults = await executeQuery('SELECT id, user_id, test_type, score, completed_at FROM test_results ORDER BY completed_at DESC LIMIT 5');
    testResults.forEach((result, index) => {
      console.log(`測試 ${index + 1}:`, {
        id: result.id,
        user_id: result.user_id,
        test_type: result.test_type,
        score: result.score,
        completed_at: result.completed_at
      });
    });

    // 檢查 logic_test_answers 表
    console.log('\n📋 Logic Test Answers:');
    const logicAnswers = await executeQuery('SELECT * FROM logic_test_answers ORDER BY created_at DESC LIMIT 5');
    logicAnswers.forEach((answer, index) => {
      console.log(`邏輯答案 ${index + 1}:`, {
        id: answer.id,
        test_result_id: answer.test_result_id,
        question_id: answer.question_id,
        user_answer: answer.user_answer,
        is_correct: answer.is_correct
      });
    });

    // 檢查 creative_test_answers 表
    console.log('\n📋 Creative Test Answers:');
    const creativeAnswers = await executeQuery('SELECT * FROM creative_test_answers ORDER BY created_at DESC LIMIT 5');
    creativeAnswers.forEach((answer, index) => {
      console.log(`創意答案 ${index + 1}:`, {
        id: answer.id,
        test_result_id: answer.test_result_id,
        question_id: answer.question_id,
        user_answer: answer.user_answer,
        score: answer.score
      });
    });

    // 檢查是否有匹配的答案
    if (testResults.length > 0) {
      const firstTest = testResults[0];
      console.log(`\n🔍 檢查測試 ${firstTest.id} 的答案:`);
      
      const matchingLogicAnswers = await executeQuery('SELECT * FROM logic_test_answers WHERE test_result_id = ?', [firstTest.id]);
      console.log(`邏輯答案匹配數量: ${matchingLogicAnswers.length}`);
      
      const matchingCreativeAnswers = await executeQuery('SELECT * FROM creative_test_answers WHERE test_result_id = ?', [firstTest.id]);
      console.log(`創意答案匹配數量: ${matchingCreativeAnswers.length}`);
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message);
  }

  console.log('==============================\n');
}

checkSingleTestAnswers();
