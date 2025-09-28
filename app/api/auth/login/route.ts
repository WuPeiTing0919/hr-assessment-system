import { NextRequest, NextResponse } from 'next/server'
import { verifyUserPassword } from '@/lib/database/models/user'
import { initializeDatabase } from '@/lib/database/init'
import { generateToken, generateRefreshToken } from '@/lib/utils/jwt'

export async function POST(request: NextRequest) {
  try {
    // 確保資料庫已初始化
    await initializeDatabase()
    
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: '請提供電子郵件和密碼' },
        { status: 400 }
      )
    }
    
    // 驗證用戶密碼
    const user = await verifyUserPassword(email, password)
    
    if (!user) {
      return NextResponse.json(
        { error: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }
    
    // 生成 JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
    
    const accessToken = generateToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)
    
    // 移除密碼並返回用戶資料
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        createdAt: user.created_at,
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error('登入錯誤:', error)
    return NextResponse.json(
      { error: '登入失敗，請稍後再試' },
      { status: 500 }
    )
  }
}
