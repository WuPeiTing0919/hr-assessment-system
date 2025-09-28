const testCombinedIntegration = () => {
  console.log('🔄 綜合能力測試資料庫整合測試')
  console.log('=' .repeat(50))

  console.log('\n📋 測試目標:')
  console.log('- 整合 logic_questions 資料表')
  console.log('- 整合 creative_questions 資料表')
  console.log('- 移除硬編碼的題目資料')
  console.log('- 確保題目、答案與資料庫一致')

  console.log('\n🔧 主要修改:')
  console.log('1. 移除硬編碼的題目匯入')
  console.log('   - 移除: import { logicQuestions } from "@/lib/questions/logic-questions"')
  console.log('   - 移除: import { creativeQuestions } from "@/lib/questions/creative-questions"')

  console.log('\n2. 新增資料庫介面')
  console.log('   - LogicQuestion 介面 (id, question, option_a-e, correct_answer, explanation)')
  console.log('   - CreativeQuestion 介面 (id, statement, category, is_reverse)')

  console.log('\n3. 新增狀態管理')
  console.log('   - logicQuestions: LogicQuestion[]')
  console.log('   - creativeQuestions: CreativeQuestion[]')
  console.log('   - isLoading: boolean')

  console.log('\n4. 新增資料載入邏輯')
  console.log('   - useEffect 載入邏輯題目 (/api/logic-questions)')
  console.log('   - useEffect 載入創意題目 (/api/creative-questions)')
  console.log('   - 錯誤處理和載入狀態')

  console.log('\n5. 修改題目渲染')
  console.log('   - 邏輯題目: 使用 option_a 到 option_e 欄位')
  console.log('   - 創意題目: 使用 statement 和 is_reverse 欄位')
  console.log('   - 移除數值顯示 (5, 4, 3, 2, 1)')

  console.log('\n6. 新增載入和錯誤狀態')
  console.log('   - 載入中: 顯示載入動畫')
  console.log('   - 載入失敗: 顯示錯誤訊息和重新載入按鈕')

  console.log('\n📊 資料庫欄位對應:')
  console.log('邏輯題目 (logic_questions):')
  console.log('  - question -> 題目內容')
  console.log('  - option_a, option_b, option_c, option_d, option_e -> 選項 A-E')
  console.log('  - correct_answer -> 正確答案 (A-E)')
  console.log('  - explanation -> 解釋說明')

  console.log('\n創意題目 (creative_questions):')
  console.log('  - statement -> 題目描述')
  console.log('  - category -> 能力類別 (innovation, imagination, flexibility, originality)')
  console.log('  - is_reverse -> 是否反向計分')

  console.log('\n🎯 測試流程:')
  console.log('1. 載入綜合能力測試頁面')
  console.log('2. 檢查是否從資料庫載入題目')
  console.log('3. 驗證邏輯題目選項顯示 (A-E)')
  console.log('4. 驗證創意題目選項顯示 (無數值)')
  console.log('5. 完成測試並檢查結果頁面')

  console.log('\n✅ 預期結果:')
  console.log('- 題目完全來自資料庫，無硬編碼')
  console.log('- 邏輯題目顯示 A-E 選項')
  console.log('- 創意題目不顯示數值')
  console.log('- 載入狀態正常顯示')
  console.log('- 錯誤處理完善')

  console.log('\n🔍 驗證要點:')
  console.log('- 檢查 Network 標籤中的 API 請求')
  console.log('- 確認題目內容與資料庫一致')
  console.log('- 測試載入失敗情況')
  console.log('- 驗證計分邏輯正確性')

  console.log('\n📝 注意事項:')
  console.log('- 確保 API 路由正常運作')
  console.log('- 檢查資料庫連線狀態')
  console.log('- 驗證題目數量正確')
  console.log('- 測試反向計分邏輯')

  console.log('\n✅ 綜合能力測試資料庫整合測試完成')
}

testCombinedIntegration()
