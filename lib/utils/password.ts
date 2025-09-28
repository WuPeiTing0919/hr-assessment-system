import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

// 雜湊密碼
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// 驗證密碼
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// 同步雜湊密碼（用於種子數據）
export function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

// 同步驗證密碼
export function verifyPasswordSync(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}
