import { createUser, isEmailExists } from './models/user'
import { initializeDatabase } from './init'

// 預設用戶數據
const defaultUsers = [
  {
    name: "系統管理員",
    email: "admin@company.com",
    password: "admin123",
    department: "人力資源部",
    role: "admin" as const,
  },
  {
    name: "張小明",
    email: "user@company.com",
    password: "user123",
    department: "資訊技術部",
    role: "user" as const,
  },
]

// 種子資料庫
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🔄 正在種子資料庫...')
    
    // 確保資料庫已初始化
    await initializeDatabase()
    
    // 檢查並建立預設用戶
    for (const userData of defaultUsers) {
      const exists = await isEmailExists(userData.email)
      if (!exists) {
        await createUser(userData)
        console.log(`✅ 建立預設用戶: ${userData.name} (${userData.email})`)
      } else {
        console.log(`⏭️ 用戶已存在: ${userData.name} (${userData.email})`)
      }
    }
    
    console.log('✅ 資料庫種子完成')
  } catch (error) {
    console.error('❌ 資料庫種子失敗:', error)
    throw error
  }
}

// 如果直接執行此檔案，則執行種子
if (require.main === module) {
  seedDatabase().catch(console.error)
}
