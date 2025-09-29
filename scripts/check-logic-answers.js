const { executeQuery } = require('../lib/database/connection');

async function checkLogicAnswers() {
  try {
    console.log('=== 檢查 logic_test_answers 表 ===');
    const answers = await executeQuery('SELECT * FROM logic_test_answers');
    console.log('logic_test_answers 資料總數:', answers.length);
    if (answers.length > 0) {
      console.log('前3筆資料:', answers.slice(0, 3));
    }
    
    console.log('\n=== 檢查 test_results 表 ===');
    const results = await executeQuery('SELECT * FROM test_results WHERE type = "logic" ORDER BY created_at DESC LIMIT 5');
    console.log('logic test_results 資料總數:', results.length);
    if (results.length > 0) {
      console.log('前3筆資料:', results);
      
      console.log('\n=== 檢查關聯資料 ===');
      for (const result of results.slice(0, 2)) {
        console.log(`\n檢查 test_result_id: ${result.id}`);
        const relatedAnswers = await executeQuery('SELECT * FROM logic_test_answers WHERE test_result_id = ?', [result.id]);
        console.log(`關聯的答案數量: ${relatedAnswers.length}`);
        if (relatedAnswers.length > 0) {
          console.log('答案資料:', relatedAnswers);
        }
      }
    }
    
    console.log('\n=== 檢查所有 test_results 類型 ===');
    const allResults = await executeQuery('SELECT type, COUNT(*) as count FROM test_results GROUP BY type');
    console.log('各類型測試結果數量:', allResults);
    
  } catch (error) {
    console.error('錯誤:', error.message);
  }
}

checkLogicAnswers();
