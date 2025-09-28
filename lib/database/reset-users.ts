import { executeQuery } from './connection'
import { initializeDatabase } from './init'
import { hashPasswordSync } from '../utils/password'

// 重新建立用戶數據（使用明文密碼）
const resetUsers = [
  {
    name: "系統管理員",
    email: "admin@company.com",
    password: "admin123",
    department: "人力資源部",
    role: "admin",
  },
  {
    name: "張小明",
    email: "user@company.com", 
    password: "user123",
    department: "資訊技術部",
    role: "user",
  },
  {
    name: "李經理",
    email: "manager@company.com",
    password: "manager123",
    department: "管理部",
    role: "admin",
  },
  {
    name: "王測試",
    email: "test@company.com",
    password: "test123",
    department: "測試部",
    role: "user",
  }
]

export async function resetUsersData(): Promise<void> {
  try {
    console.log('🔄 正在重新建立用戶數據...')
    
    // 確保資料庫已初始化
    await initializeDatabase()
    
    // 清空現有用戶數據
    await executeQuery('DELETE FROM users')
    console.log('✅ 已清空現有用戶數據')
    
    // 重新插入用戶數據
    for (const user of resetUsers) {
      // 生成簡單的 UUID
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // 雜湊密碼
      const hashedPassword = hashPasswordSync(user.password)
      
      const query = `
        INSERT INTO users (id, name, email, password, department, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `
      
      await executeQuery(query, [
        userId,
        user.name,
        user.email,
        hashedPassword,
        user.department,
        user.role
      ])
      
      console.log(`✅ 建立用戶: ${user.name} (${user.email}) - 密碼已雜湊`)
    }
    
    console.log('✅ 用戶數據重新建立完成')
    console.log('\n📋 可用帳號:')
    resetUsers.forEach(user => {
      console.log(`   ${user.name}: ${user.email} / ${user.password} (${user.role})`)
    })
    
  } catch (error) {
    console.error('❌ 重新建立用戶數據失敗:', error)
    throw error
  }
}

// 如果直接執行此檔案，則執行重置
if (require.main === module) {
  resetUsersData().catch(console.error)
}
