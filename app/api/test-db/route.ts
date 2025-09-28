import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/database/connection'

export async function GET() {
  try {
    const isConnected = await testConnection()
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: '資料庫連接正常'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: '資料庫連接失敗'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('資料庫測試失敗:', error)
    return NextResponse.json({
      success: false,
      message: '資料庫測試失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 })
  }
}
