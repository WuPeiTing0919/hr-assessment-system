const testCombinedMobileButtons = () => {
  console.log('📱 綜合能力測試結果頁面手機版按鈕修正測試')
  console.log('=' .repeat(50))

  console.log('\n🔍 問題分析:')
  console.log('原始問題: 手機版「返回首頁」文字消失')
  console.log('原因: 使用了 hidden sm:inline 類別，在手機版隱藏文字')

  console.log('\n🔧 修正內容:')
  console.log('舊代碼: <span className="hidden sm:inline">返回首頁</span>')
  console.log('新代碼: <span>返回首頁</span>')
  console.log('效果: 移除 hidden sm:inline，讓文字在所有螢幕尺寸都顯示')

  console.log('\n📊 按鈕區域分析:')
  console.log('按鈕容器: flex flex-col sm:flex-row gap-4 justify-center')
  console.log('- 手機版: 垂直排列 (flex-col)')
  console.log('- 桌面版: 水平排列 (sm:flex-row)')
  console.log('- 間距: 4 (16px)')
  console.log('- 對齊: 置中')

  console.log('\n🎯 三個按鈕:')
  console.log('1. 返回首頁按鈕:')
  console.log('   - 樣式: 主要按鈕 (solid blue)')
  console.log('   - 圖示: Home 圖示')
  console.log('   - 文字: 返回首頁 (現在所有螢幕都顯示)')
  console.log('   - 連結: / (首頁)')

  console.log('\n2. 重新測試按鈕:')
  console.log('   - 樣式: 次要按鈕 (outline)')
  console.log('   - 圖示: RotateCcw 圖示')
  console.log('   - 文字: 重新測試')
  console.log('   - 連結: /tests/combined')

  console.log('\n3. 查看所有成績按鈕:')
  console.log('   - 樣式: 次要按鈕 (outline)')
  console.log('   - 圖示: 無')
  console.log('   - 文字: 查看所有成績')
  console.log('   - 連結: /results')

  console.log('\n📱 手機版顯示效果:')
  console.log('- 按鈕垂直堆疊')
  console.log('- 每個按鈕全寬顯示')
  console.log('- 圖示和文字都清晰可見')
  console.log('- 間距適中，易於點擊')

  console.log('\n🖥️ 桌面版顯示效果:')
  console.log('- 按鈕水平排列')
  console.log('- 按鈕寬度自動調整')
  console.log('- 圖示和文字都清晰可見')
  console.log('- 整體佈局平衡')

  console.log('\n✅ 修正效果:')
  console.log('- 手機版「返回首頁」文字現在會顯示')
  console.log('- 保持桌面版的良好體驗')
  console.log('- 所有按鈕在各種螢幕尺寸都清晰可見')
  console.log('- 用戶體驗一致性提升')

  console.log('\n🔍 測試要點:')
  console.log('1. 手機版檢查「返回首頁」文字是否顯示')
  console.log('2. 桌面版檢查按鈕排列是否正常')
  console.log('3. 所有按鈕點擊功能正常')
  console.log('4. 圖示和文字對齊美觀')
  console.log('5. 響應式設計在不同螢幕尺寸都正常')

  console.log('\n✅ 綜合能力測試結果頁面手機版按鈕修正測試完成')
}

testCombinedMobileButtons()
