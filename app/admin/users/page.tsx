"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth, type User } from "@/lib/hooks/use-auth"

export default function UsersManagementPage() {
  return (
    <ProtectedRoute adminOnly>
      <UsersManagementContent />
    </ProtectedRoute>
  )
}

function UsersManagementContent() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<(User & { password?: string })[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "user" as "user" | "admin",
  })
  const [error, setError] = useState("")

  const departments = ["人力資源部", "資訊技術部", "財務部", "行銷部", "業務部", "研發部", "客服部", "其他"]

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const usersData = JSON.parse(localStorage.getItem("hr_users") || "[]")
    setUsers(usersData)
  }

  const handleAddUser = () => {
    setError("")

    if (!newUser.name || !newUser.email || !newUser.password || !newUser.department) {
      setError("請填寫所有必填欄位")
      return
    }

    if (users.some((u) => u.email === newUser.email)) {
      setError("該電子郵件已被使用")
      return
    }

    const user = {
      ...newUser,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...users, user]
    setUsers(updatedUsers)
    localStorage.setItem("hr_users", JSON.stringify(updatedUsers))

    setNewUser({
      name: "",
      email: "",
      password: "",
      department: "",
      role: "user",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      department: user.department,
      role: user.role,
    })
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    setError("")

    if (!newUser.name || !newUser.email || !newUser.department) {
      setError("請填寫所有必填欄位")
      return
    }

    if (users.some((u) => u.email === newUser.email && u.id !== editingUser.id)) {
      setError("該電子郵件已被使用")
      return
    }

    const updatedUsers = users.map((u) =>
      u.id === editingUser.id
        ? {
            ...u,
            name: newUser.name,
            email: newUser.email,
            department: newUser.department,
            role: newUser.role,
            ...(newUser.password && { password: newUser.password }),
          }
        : u,
    )

    setUsers(updatedUsers)
    localStorage.setItem("hr_users", JSON.stringify(updatedUsers))

    setEditingUser(null)
    setNewUser({
      name: "",
      email: "",
      password: "",
      department: "",
      role: "user",
    })
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      setError("無法刪除自己的帳戶")
      return
    }

    const updatedUsers = users.filter((u) => u.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem("hr_users", JSON.stringify(updatedUsers))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回儀表板
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">用戶管理</h1>
              <p className="text-sm text-muted-foreground">管理系統用戶和權限</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">總用戶數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">管理員</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">一般用戶</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((u) => u.role === "user").length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>用戶列表</CardTitle>
                  <CardDescription>管理系統中的所有用戶</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      新增用戶
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新增用戶</DialogTitle>
                      <DialogDescription>建立新的系統用戶帳戶</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="請輸入姓名"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">電子郵件</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="請輸入電子郵件"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">密碼</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="請輸入密碼"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">部門</Label>
                        <Select
                          value={newUser.department}
                          onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇部門" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">角色</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: "user" | "admin") => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">一般用戶</SelectItem>
                            <SelectItem value="admin">管理員</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={handleAddUser} className="flex-1">
                          新增用戶
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                          取消
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>電子郵件</TableHead>
                    <TableHead>部門</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>建立時間</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "管理員" : "一般用戶"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.id !== currentUser?.id && (
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit User Dialog */}
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>編輯用戶</DialogTitle>
                <DialogDescription>修改用戶資訊和權限</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">姓名</Label>
                  <Input
                    id="edit-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="請輸入姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">電子郵件</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="請輸入電子郵件"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">新密碼（留空表示不修改）</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="請輸入新密碼"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-department">部門</Label>
                  <Select
                    value={newUser.department}
                    onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇部門" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-role">角色</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "user" | "admin") => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">一般用戶</SelectItem>
                      <SelectItem value="admin">管理員</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleUpdateUser} className="flex-1">
                    更新用戶
                  </Button>
                  <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                    取消
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
