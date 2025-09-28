import { executeQuery, executeQueryOne } from '../connection'
import { hashPassword, verifyPassword } from '../../utils/password'

export interface User {
  id: string
  name: string
  email: string
  password: string
  department: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  department: string
  role: 'admin' | 'user'
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  department?: string
  role?: 'admin' | 'user'
}

// 建立用戶表（如果不存在）
export async function createUsersTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL,
      role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `
  
  await executeQuery(createTableQuery)
  console.log('✅ 用戶表建立成功')
}

// 根據 email 查找用戶
export async function findUserByEmail(email: string): Promise<User | null> {
  const query = 'SELECT * FROM users WHERE email = ?'
  return await executeQueryOne<User>(query, [email])
}

// 根據 ID 查找用戶
export async function findUserById(id: string): Promise<User | null> {
  const query = 'SELECT * FROM users WHERE id = ?'
  return await executeQueryOne<User>(query, [id])
}

// 建立新用戶
export async function createUser(userData: CreateUserData): Promise<User | null> {
  const query = `
    INSERT INTO users (id, name, email, password, department, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  
  const { name, email, password, department, role } = userData
  
  try {
    // 生成簡單的 UUID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // 雜湊密碼
    const hashedPassword = await hashPassword(password)
    await executeQuery(query, [userId, name, email, hashedPassword, department, role])
    return await findUserByEmail(email)
  } catch (error) {
    console.error('建立用戶失敗:', error)
    return null
  }
}

// 更新用戶
export async function updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
  const fields = Object.keys(userData).filter(key => userData[key as keyof UpdateUserData] !== undefined)
  
  if (fields.length === 0) {
    return await findUserById(id)
  }
  
  const setClause = fields.map(field => `${field} = ?`).join(', ')
  const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  
  const values = fields.map(field => userData[field as keyof UpdateUserData])
  values.push(id)
  
  try {
    await executeQuery(query, values)
    return await findUserById(id)
  } catch (error) {
    console.error('更新用戶失敗:', error)
    return null
  }
}

// 刪除用戶
export async function deleteUser(id: string): Promise<boolean> {
  const query = 'DELETE FROM users WHERE id = ?'
  
  try {
    await executeQuery(query, [id])
    return true
  } catch (error) {
    console.error('刪除用戶失敗:', error)
    return false
  }
}

// 獲取所有用戶
export async function getAllUsers(): Promise<User[]> {
  const query = 'SELECT * FROM users ORDER BY created_at DESC'
  return await executeQuery<User>(query)
}

// 根據部門獲取用戶
export async function getUsersByDepartment(department: string): Promise<User[]> {
  const query = 'SELECT * FROM users WHERE department = ? ORDER BY created_at DESC'
  return await executeQuery<User>(query, [department])
}

// 檢查 email 是否已存在
export async function isEmailExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email)
  return user !== null
}

// 驗證用戶密碼
export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email)
  if (!user) {
    return null
  }
  
  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }
  
  return user
}
