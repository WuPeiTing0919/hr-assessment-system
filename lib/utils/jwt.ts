import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'hr_assessment_super_secret_key_2024_secure_random_string'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  name: string
}

// 生成 JWT Token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// 驗證 JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error('JWT 驗證失敗:', error)
    return null
  }
}

// 從 Authorization header 中提取 token
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// 生成刷新 token
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}
