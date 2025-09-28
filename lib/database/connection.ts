import mysql from 'mysql2/promise'

// 資料庫連接配置
const dbConfig = {
  host: process.env.DB_HOST || 'mysql.theaken.com',
  port: parseInt(process.env.DB_PORT || '33306'),
  user: process.env.DB_USER || 'hr_assessment',
  password: process.env.DB_PASSWORD || 'QFOts8FlibiI',
  database: process.env.DB_NAME || 'db_hr_assessment',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
}

// 建立連接池
let pool: mysql.Pool | null = null

export function getConnectionPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// 測試資料庫連接
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getConnectionPool().getConnection()
    await connection.ping()
    connection.release()
    console.log('✅ 資料庫連接成功')
    return true
  } catch (error) {
    console.error('❌ 資料庫連接失敗:', error)
    return false
  }
}

// 關閉連接池
export async function closeConnectionPool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

// 執行查詢的輔助函數
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await getConnectionPool().execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error('查詢執行失敗:', error)
    throw error
  }
}

// 執行單一查詢的輔助函數
export async function executeQueryOne<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  try {
    const [rows] = await getConnectionPool().execute(query, params)
    const results = rows as T[]
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error('查詢執行失敗:', error)
    throw error
  }
}
