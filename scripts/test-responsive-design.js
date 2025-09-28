// 測試響應式設計的 CSS 類別
const responsiveClasses = {
  // 統計數據區域
  statsGrid: "grid grid-cols-3 gap-4 mb-6",
  statsText: "text-xs text-muted-foreground",
  
  // 詳細結果區域
  questionCard: "border rounded-lg p-3 sm:p-4",
  questionIcon: "w-4 h-4 sm:w-5 sm:h-5",
  questionTitle: "text-sm sm:text-base",
  questionContent: "text-xs sm:text-sm",
  answerRow: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2",
  badge: "text-xs w-fit",
  explanation: "p-2 sm:p-3 text-xs sm:text-sm",
  
  // 按鈕區域
  buttonContainer: "flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center",
  button: "w-full sm:w-auto"
}

console.log('📱 響應式設計測試')
console.log('=' .repeat(50))

console.log('\n📊 統計數據區域:')
console.log(`網格佈局: ${responsiveClasses.statsGrid}`)
console.log(`標籤文字: ${responsiveClasses.statsText}`)

console.log('\n📋 詳細結果區域:')
console.log(`題目卡片: ${responsiveClasses.questionCard}`)
console.log(`圖示大小: ${responsiveClasses.questionIcon}`)
console.log(`題目標題: ${responsiveClasses.questionTitle}`)
console.log(`內容文字: ${responsiveClasses.questionContent}`)
console.log(`答案行: ${responsiveClasses.answerRow}`)
console.log(`徽章: ${responsiveClasses.badge}`)
console.log(`解析: ${responsiveClasses.explanation}`)

console.log('\n🔘 按鈕區域:')
console.log(`按鈕容器: ${responsiveClasses.buttonContainer}`)
console.log(`按鈕樣式: ${responsiveClasses.button}`)

console.log('\n✅ 響應式設計配置完成')
console.log('\n📱 手機版特點:')
console.log('- 統計數據始終 3 欄並排顯示')
console.log('- 文字大小在手機上較小，桌面版較大')
console.log('- 答案選項在手機上垂直排列，桌面版水平排列')
console.log('- 按鈕在手機上全寬顯示，桌面版自動寬度')
console.log('- 內邊距在手機上較小，桌面版較大')
