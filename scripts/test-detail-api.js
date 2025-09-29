const fetch = require('node-fetch');

async function testDetailAPI() {
  console.log('🔍 測試詳細結果 API');
  console.log('==============================');

  try {
    // 先獲取測試結果列表
    const listResponse = await fetch('http://localhost:3000/api/admin/test-results');
    const listData = await listResponse.json();

    if (listData.success && listData.data.results.length > 0) {
      const firstResult = listData.data.results[0];
      console.log(`📋 測試結果: ${firstResult.userName} - ${firstResult.type}`);
      console.log(`   分數: ${firstResult.score}, 等級: ${firstResult.grade}`);

      // 測試詳細結果 API
      const detailResponse = await fetch(`http://localhost:3000/api/admin/test-results/detail?testResultId=${firstResult.id}&testType=${firstResult.type}`);
      const detailData = await detailResponse.json();

      if (detailData.success) {
        console.log('✅ 詳細結果獲取成功');
        console.log('📊 用戶資訊:', {
          name: detailData.data.user.name,
          email: detailData.data.user.email,
          department: detailData.data.user.department
        });
        console.log('📈 測試結果:', {
          type: detailData.data.result.type,
          score: detailData.data.result.score,
          completedAt: detailData.data.result.completedAt
        });
        console.log('📝 題目數量:', detailData.data.questions?.length || 0);
        console.log('💡 答案數量:', detailData.data.answers?.length || 0);

        if (detailData.data.questions && detailData.data.questions.length > 0) {
          console.log('\n📋 第一題詳情:');
          const firstQuestion = detailData.data.questions[0];
          console.log('   題目:', firstQuestion.question || firstQuestion.statement);
          console.log('   用戶答案:', firstQuestion.userAnswer);
          if (firstQuestion.isCorrect !== undefined) {
            console.log('   是否正確:', firstQuestion.isCorrect ? '是' : '否');
          }
          if (firstQuestion.score !== undefined) {
            console.log('   得分:', firstQuestion.score);
          }
        }

        if (detailData.data.result.type === 'combined' && detailData.data.result.details) {
          console.log('\n🎯 綜合能力分析:');
          console.log('   邏輯思維:', detailData.data.result.details.logicScore);
          console.log('   創意能力:', detailData.data.result.details.creativeScore);
          console.log('   能力平衡:', detailData.data.result.details.abilityBalance);
        }

      } else {
        console.error('❌ 詳細結果獲取失敗:', detailData.message);
      }
    } else {
      console.log('⚠️ 沒有找到測試結果');
    }

  } catch (error) {
    console.error('❌ 測試錯誤:', error.message);
  }

  console.log('==============================\n');
}

testDetailAPI();
