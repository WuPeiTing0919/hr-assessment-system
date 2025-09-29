import { NextRequest, NextResponse } from 'next/server'
import { updateUser, findUserById } from '@/lib/database/models/user'
import { verifyPassword, hashPassword } from '@/lib/utils/password'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email, department, currentPassword, newPassword } = body

    // 驗證必要欄位
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用戶ID' },
        { status: 400 }
      )
    }

    // 獲取當前用戶資料
    const currentUser = await findUserById(userId)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '用戶不存在' },
        { status: 404 }
      )
    }

    // 準備更新資料
    const updateData: any = {}

    // 更新基本資料
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (department !== undefined) updateData.department = department

    // 如果要更新密碼，需要驗證當前密碼
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: '請提供當前密碼' },
          { status: 400 }
        )
      }

      // 驗證當前密碼
      const isCurrentPasswordValid = await verifyPassword(currentPassword, currentUser.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { success: false, error: '當前密碼不正確' },
          { status: 400 }
        )
      }

      // 加密新密碼
      updateData.password = await hashPassword(newPassword)
    }

    // 檢查是否有資料需要更新
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: '沒有資料需要更新' },
        { status: 400 }
      )
    }

    // 更新用戶資料
    const updatedUser = await updateUser(userId, updateData)
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: '更新用戶資料失敗' },
        { status: 500 }
      )
    }

    // 返回更新後的用戶資料（不包含密碼）
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })

  } catch (error) {
    console.error('更新用戶資料失敗:', error)
    return NextResponse.json(
      {
        success: false,
        error: '伺服器錯誤',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用戶ID' },
        { status: 400 }
      )
    }

    const user = await findUserById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用戶不存在' },
        { status: 404 }
      )
    }

    // 返回用戶資料（不包含密碼）
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })

  } catch (error) {
    console.error('獲取用戶資料失敗:', error)
    return NextResponse.json(
      {
        success: false,
        error: '伺服器錯誤',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    )
  }
}
