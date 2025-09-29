const { executeQuery } = require('../lib/database/connection');

async function testDbConnection() {
  console.log('🔍 測試資料庫連接和表結構');
  console.log('==============================');

  try {
    // 測試基本連接
    console.log('1. 測試基本連接...');
    const testQuery = await executeQuery('SELECT 1 as test');
    console.log('✅ 資料庫連接成功:', testQuery);

    // 檢查所有表
    console.log('\n2. 檢查所有表...');
    const tables = await executeQuery('SHOW TABLES');
    console.log('📋 所有表:', tables.map(t => Object.values(t)[0]));

    // 檢查 logic_test_answers 表是否存在
    console.log('\n3. 檢查 logic_test_answers 表...');
    const tableExists = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'logic_test_answers'
    `);
    console.log('logic_test_answers 表存在:', tableExists[0].count > 0);

    // 檢查表結構
    console.log('\n4. 檢查 logic_test_answers 表結構...');
    const tableStructure = await executeQuery('DESCRIBE logic_test_answers');
    console.log('📋 表結構:', tableStructure);

    // 檢查資料數量
    console.log('\n5. 檢查資料數量...');
    const count = await executeQuery('SELECT COUNT(*) as count FROM logic_test_answers');
    console.log('📊 logic_test_answers 資料數量:', count[0].count);

    // 檢查前幾筆資料
    if (count[0].count > 0) {
      console.log('\n6. 檢查前 3 筆資料...');
      const sampleData = await executeQuery('SELECT * FROM logic_test_answers LIMIT 3');
      console.log('📋 範例資料:', sampleData);
    }

  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error('錯誤詳情:', error);
  }

  console.log('==============================\n');
}

testDbConnection();
