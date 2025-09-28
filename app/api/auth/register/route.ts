import { NextRequest, NextResponse } from 'next/server'
import { createUser, isEmailExists } from '@/lib/database/models/user'
import { initializeDatabase } from '@/lib/database/init'

export async function POST(request: NextRequest) {
  try {
    // 確保資料庫已初始化
    await initializeDatabase()
    
    const { name, email, password, department, role } = await request.json()
    
    if (!name || !email || !password || !department) {
      return NextResponse.json(
        { error: '請填寫所有必填欄位' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密碼長度至少需要6個字元' },
        { status: 400 }
      )
    }
    
    // 檢查電子郵件是否已存在
    const emailExists = await isEmailExists(email)
    if (emailExists) {
      return NextResponse.json(
        { error: '該電子郵件已被使用' },
        { status: 409 }
      )
    }
    
    // 建立新用戶
    const newUser = await createUser({
      name,
      email,
      password, // 在實際應用中應該加密
      department,
      role: role || 'user'
    })
    
    if (!newUser) {
      return NextResponse.json(
        { error: '註冊失敗，請稍後再試' },
        { status: 500 }
      )
    }
    
    // 移除密碼並返回用戶資料
    const { password: _, ...userWithoutPassword } = newUser
    
    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        createdAt: newUser.created_at,
      }
    })
  } catch (error) {
    console.error('註冊錯誤:', error)
    return NextResponse.json(
      { error: '註冊失敗，請稍後再試' },
      { status: 500 }
    )
  }
}
