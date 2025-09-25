import type { User } from "@/lib/hooks/use-auth"

export type Permission =
  | "view_own_results"
  | "view_all_results"
  | "manage_users"
  | "view_analytics"
  | "take_tests"
  | "export_data"
  | "manage_questions" // 新增題目管理權限

export const rolePermissions: Record<User["role"], Permission[]> = {
  user: ["view_own_results", "take_tests"],
  admin: [
    "view_own_results",
    "view_all_results",
    "manage_users",
    "view_analytics",
    "take_tests",
    "export_data",
    "manage_questions",
  ], // 為管理員新增題目管理權限
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  return rolePermissions[user.role].includes(permission)
}

export function requirePermission(user: User | null, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`權限不足：需要 ${permission} 權限`)
  }
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false

  // 公開路由
  const publicRoutes = ["/", "/login", "/register"]
  if (publicRoutes.includes(route)) return true

  // 用戶路由
  const userRoutes = ["/dashboard", "/tests", "/results", "/settings"]
  if (userRoutes.some((r) => route.startsWith(r))) return true

  // 管理員路由
  const adminRoutes = ["/admin"]
  if (adminRoutes.some((r) => route.startsWith(r))) {
    return user.role === "admin"
  }

  return false
}
