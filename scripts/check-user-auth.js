const checkUserAuth = () => {
  console.log('👤 檢查用戶認證狀態')
  console.log('=' .repeat(50))

  // 模擬瀏覽器環境檢查 localStorage
  if (typeof window !== 'undefined') {
    const currentUser = localStorage.getItem("hr_current_user")
    
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        console.log('✅ 用戶已登入:')
        console.log('用戶ID:', user.id)
        console.log('用戶名稱:', user.name)
        console.log('用戶郵箱:', user.email)
        console.log('用戶部門:', user.department)
        console.log('用戶角色:', user.role)
      } catch (error) {
        console.log('❌ 用戶資料解析失敗:', error.message)
      }
    } else {
      console.log('❌ 用戶未登入')
      console.log('localStorage 中沒有 hr_current_user')
    }
  } else {
    console.log('⚠️ 非瀏覽器環境，無法檢查 localStorage')
  }

  console.log('\n🔍 檢查要點:')
  console.log('1. 用戶是否已登入')
  console.log('2. localStorage 中是否有 hr_current_user')
  console.log('3. 用戶資料格式是否正確')
  console.log('4. 用戶ID是否存在')

  console.log('\n💡 如果用戶未登入:')
  console.log('1. 請先登入系統')
  console.log('2. 檢查登入功能是否正常')
  console.log('3. 檢查 localStorage 是否被清除')

  console.log('\n✅ 用戶認證檢查完成')
}

checkUserAuth()
