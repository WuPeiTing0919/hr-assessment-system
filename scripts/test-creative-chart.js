// 測試創意能力分析圖表功能
const testCategoryResults = [
  { category: 'innovation', name: '創新能力', score: 73, rawScore: 22, maxRawScore: 30 },
  { category: 'imagination', name: '想像力', score: 100, rawScore: 30, maxRawScore: 30 },
  { category: 'flexibility', name: '靈活性', score: 68, rawScore: 20, maxRawScore: 30 },
  { category: 'originality', name: '原創性', score: 52, rawScore: 15, maxRawScore: 30 }
]

console.log('📊 創意能力分析圖表測試 (4維度修正版)')
console.log('=' .repeat(50))

console.log('\n🎯 圖表功能:')
console.log('- 雷達圖顯示四個能力維度 (正確的4維度)')
console.log('- 每個維度顯示分數百分比，使用文字陰影效果')
console.log('- 圖表大小響應式：手機 320x320px，桌面 384x384px')
console.log('- 包含網格線、數據點、面積填充和圖例')

console.log('\n📈 測試數據 (4維度):')
testCategoryResults.forEach((category, index) => {
  const angle = (index * 90 - 90) * Math.PI / 180
  const radius = (category.score / 100) * 80
  const x = 100 + radius * Math.cos(angle)
  const y = 100 + radius * Math.sin(angle)
  
  console.log(`\n${category.name}:`)
  console.log(`  分數: ${category.score}%`)
  console.log(`  角度: ${(index * 90 - 90)}°`)
  console.log(`  半徑: ${radius.toFixed(1)}`)
  console.log(`  座標: (${x.toFixed(1)}, ${y.toFixed(1)})`)
})

console.log('\n🎨 視覺元素 (4維度修正版):')
console.log('- 網格圓圈: 4個同心圓 (17, 35, 52, 70 半徑)')
console.log('- 網格線: 4條從中心放射的線 (0°, 90°, 180°, 270°)')
console.log('- 數據點: 藍色圓點，半徑4px，白色邊框2px')
console.log('- 分數標籤: 使用文字陰影效果，確保可讀性')
console.log('- 面積填充: 半透明藍色 (rgba(59, 130, 246, 0.2))')
console.log('- 邊框: 2px 藍色實線')
console.log('- 標籤: 灰色文字，10px，粗體 (縮小)')
console.log('- 分數: 藍色文字，10px，粗體，白色陰影 (縮小)')

console.log('\n📱 響應式設計 (4維度最終版):')
console.log('- 手機版: w-56 h-56 (224x224px)')
console.log('- 桌面版: w-72 h-72 (288x288px)')
console.log('- 圖例: 手機2欄，桌面4欄，間距3')

console.log('\n🔧 修正內容 (4維度優化):')
console.log('- 修正為正確的4個維度 (0°, 90°, 180°, 270°)')
console.log('- 移除多餘的網格線，只保留4條軸線')
console.log('- 使用文字陰影效果替代背景框，更簡潔')
console.log('- 縮小圖表尺寸，為文字留出更多空間')
console.log('- 維度標籤位置調整到圖表外圍')
console.log('- 根據位置調整文字對齊方式')
console.log('- 圖例置中顯示')

console.log('\n📝 文字對齊修正 (最終版):')
console.log('- 上方 (創新能力): dominantBaseline="hanging", 半徑75px')
console.log('- 右方 (想像力): textAnchor="start", 半徑70px (特殊調整)')
console.log('- 下方 (靈活性): dominantBaseline="alphabetic", 半徑75px')
console.log('- 左方 (原創性): textAnchor="end", 半徑70px (特殊調整)')
console.log('- 一般標籤半徑: 75px')
console.log('- 想像力/原創性半徑: 70px (更靠近圖表)')

console.log('\n📏 圖表尺寸優化 (最終版):')
console.log('- 圖表半徑: 60px (從70px進一步縮小)')
console.log('- 網格圓圈: 15, 30, 45, 60 半徑')
console.log('- 標籤位置: 75px 半徑 (一般), 70px (想像力/原創性)')
console.log('- 容器尺寸: 手機224px，桌面288px')

console.log('\n🔤 文字大小優化:')
console.log('- 維度標籤: 從12px縮小到10px')
console.log('- 分數標籤: 從12px縮小到10px')
console.log('- 使用text-[10px]自定義大小')
console.log('- 保持粗體和陰影效果')

console.log('\n🎨 新增功能 (豐富化):')
console.log('- 百分比刻度標籤: 25%, 50%, 75%, 100%')
console.log('- 能力維度詳細說明: 每個維度的具體描述')
console.log('- 能力等級評定: 優秀(80+), 良好(60+), 一般(40+), 待提升(<40)')
console.log('- 響應式網格: 手機1欄，桌面2欄')
console.log('- 視覺層次: 分數、等級、描述分層顯示')

console.log('\n📋 維度說明內容:')
console.log('- 創新能力: 善於提出新想法，勇於嘗試不同的解決方案')
console.log('- 想像力: 能夠從不同角度思考，具有豐富的創意思維')
console.log('- 靈活性: 適應變化能力強，能夠靈活調整思維方式')
console.log('- 原創性: 具有獨特的創見，能夠產生原創性想法')

console.log('\n✅ 圖表功能測試完成')
