import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, createUser, updateUser, deleteUser } from '@/lib/database/models/user'
import { hashPassword } from '@/lib/utils/password'

// 獲取所有用戶
export async function GET() {
  try {
    const users = await getAllUsers()
    
    // 移除密碼欄位
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({
      success: true,
      data: usersWithoutPassword
    })

  } catch (error) {
    console.error('獲取用戶列表失敗:', error)
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

// 創建新用戶
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, department, role } = body

    // 驗證必要欄位
    if (!name || !email || !password || !department) {
      return NextResponse.json(
        { success: false, error: '請填寫所有必填欄位' },
        { status: 400 }
      )
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '電子郵件格式不正確' },
        { status: 400 }
      )
    }

    // 驗證密碼長度
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密碼長度至少需要6個字元' },
        { status: 400 }
      )
    }

    // 加密密碼
    const hashedPassword = await hashPassword(password)

    // 創建用戶
    const userData = {
      name,
      email,
      password: hashedPassword,
      department,
      role: role || 'user'
    }

    const newUser = await createUser(userData)
    if (!newUser) {
      return NextResponse.json(
        { success: false, error: '創建用戶失敗' },
        { status: 500 }
      )
    }

    // 返回用戶資料（不包含密碼）
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })

  } catch (error) {
    console.error('創建用戶失敗:', error)
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

// 更新用戶
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, department, role } = body

    // 驗證必要欄位
    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少用戶ID' },
        { status: 400 }
      )
    }

    // 準備更新資料
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (department !== undefined) updateData.department = department
    if (role !== undefined) updateData.role = role

    // 檢查是否有資料需要更新
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: '沒有資料需要更新' },
        { status: 400 }
      )
    }

    // 更新用戶
    const updatedUser = await updateUser(id, updateData)
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: '更新用戶失敗' },
        { status: 500 }
      )
    }

    // 返回更新後的用戶資料（不包含密碼）
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })

  } catch (error) {
    console.error('更新用戶失敗:', error)
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

// 刪除用戶
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用戶ID' },
        { status: 400 }
      )
    }

    const success = await deleteUser(userId)
    if (!success) {
      return NextResponse.json(
        { success: false, error: '刪除用戶失敗' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '用戶已成功刪除'
    })

  } catch (error) {
    console.error('刪除用戶失敗:', error)
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
