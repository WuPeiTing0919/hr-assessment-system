const fetch = require('node-fetch');

async function testDetailedAnswersFixed() {
  console.log('🔍 測試修復後的詳細答題結果功能');
  console.log('==============================');

  try {
    // 先獲取測試結果列表
    const listResponse = await fetch('http://localhost:3000/api/admin/test-results');
    const listData = await listResponse.json();

    if (listData.success && listData.data.results.length > 0) {
      // 測試綜合能力測試的詳細結果
      const combinedResult = listData.data.results.find(r => r.type === 'combined');
      if (combinedResult) {
        console.log(`📋 測試綜合能力結果: ${combinedResult.userName}`);
        console.log(`   分數: ${combinedResult.score}, 等級: ${combinedResult.grade}`);
        console.log(`   ID: ${combinedResult.id}`);

        const detailResponse = await fetch(`http://localhost:3000/api/admin/test-results/detail?testResultId=${combinedResult.id}&testType=combined`);
        const detailData = await detailResponse.json();

        if (detailData.success) {
          console.log('✅ 綜合能力詳細結果獲取成功');
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
          console.log('🎯 能力分析:', {
            logicScore: detailData.data.result.details.logicScore,
            creativeScore: detailData.data.result.details.creativeScore,
            abilityBalance: detailData.data.result.details.abilityBalance
          });
          console.log('📝 題目總數:', detailData.data.questions?.length || 0);

          if (detailData.data.questions && detailData.data.questions.length > 0) {
            const logicQuestions = detailData.data.questions.filter(q => q.type === 'logic');
            const creativeQuestions = detailData.data.questions.filter(q => q.type === 'creative');
            
            console.log(`\n🧠 邏輯思維題目: ${logicQuestions.length} 題`);
            console.log(`💡 創意能力題目: ${creativeQuestions.length} 題`);

            if (logicQuestions.length > 0) {
              console.log('\n📋 邏輯題詳情:');
              logicQuestions.forEach((q, index) => {
                console.log(`   第 ${index + 1} 題:`, {
                  question: q.question?.substring(0, 50) + '...',
                  userAnswer: q.userAnswer,
                  correctAnswer: q.correctAnswer,
                  isCorrect: q.isCorrect
                });
              });
            }

            if (creativeQuestions.length > 0) {
              console.log('\n📋 創意題詳情:');
              creativeQuestions.forEach((q, index) => {
                console.log(`   第 ${index + 1} 題:`, {
                  statement: q.statement?.substring(0, 50) + '...',
                  userAnswer: q.userAnswer,
                  score: q.score
                });
              });
            }
          } else {
            console.log('⚠️ 沒有找到詳細答題資料');
          }

        } else {
          console.error('❌ 綜合能力詳細結果獲取失敗:', detailData.message);
        }
      } else {
        console.log('⚠️ 沒有找到綜合能力測試結果');
      }

      // 測試單一測試類型
      const singleResult = listData.data.results.find(r => r.type !== 'combined');
      if (singleResult) {
        console.log(`\n📋 測試單一類型結果: ${singleResult.userName} - ${singleResult.type}`);
        
        const detailResponse = await fetch(`http://localhost:3000/api/admin/test-results/detail?testResultId=${singleResult.id}&testType=${singleResult.type}`);
        const detailData = await detailResponse.json();

        if (detailData.success) {
          console.log('✅ 單一類型詳細結果獲取成功');
          console.log('📝 題目數量:', detailData.data.questions?.length || 0);
          
          if (detailData.data.questions && detailData.data.questions.length > 0) {
            console.log('\n📋 題目詳情:');
            detailData.data.questions.forEach((q, index) => {
              console.log(`   第 ${index + 1} 題:`, {
                question: (q.question || q.statement)?.substring(0, 50) + '...',
                userAnswer: q.userAnswer,
                isCorrect: q.isCorrect,
                score: q.score
              });
            });
          }
        } else {
          console.error('❌ 單一類型詳細結果獲取失敗:', detailData.message);
        }
      }

    } else {
      console.log('⚠️ 沒有找到測試結果');
    }

  } catch (error) {
    console.error('❌ 測試錯誤:', error.message);
  }

  console.log('==============================\n');
}

testDetailedAnswersFixed();
