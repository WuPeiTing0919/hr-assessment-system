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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Clock,
  Users,
  Link as LinkIcon,
  Send,
  RefreshCw,
  Eye,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react"
import Link from "next/link"

// 定義測驗連結類型
interface TestLink {
  id: string
  name: string
  type: 'logic' | 'creative' | 'combined'
  url: string
  createdAt: string
  expiresAt?: string
  isActive: boolean
  totalSent: number
  completedCount: number
  pendingCount: number
}

// 定義已送出連結的狀態
interface SentLinkStatus {
  id: string
  linkId: string
  recipientName: string
  recipientEmail: string
  sentAt: string
  status: 'pending' | 'completed' | 'expired'
  completedAt?: string
  testType: 'logic' | 'creative' | 'combined'
  score?: number
}

export default function TestLinksPage() {
  const [currentLinks, setCurrentLinks] = useState<TestLink[]>([])
  const [sentLinks, setSentLinks] = useState<SentLinkStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [newLinkName, setNewLinkName] = useState("")
  const [newLinkType, setNewLinkType] = useState<'logic' | 'creative' | 'combined'>('combined')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // 模擬數據
  useEffect(() => {
    const mockCurrentLinks: TestLink[] = [
      {
        id: '1',
        name: '2024年度綜合能力測驗',
        type: 'combined',
        url: 'https://hr-assessment.com/test/combined/abc123',
        createdAt: '2024-01-15T10:00:00Z',
        expiresAt: '2024-12-31T23:59:59Z',
        isActive: true,
        totalSent: 45,
        completedCount: 38,
        pendingCount: 7
      },
      {
        id: '2',
        name: '創意能力專項測驗',
        type: 'creative',
        url: 'https://hr-assessment.com/test/creative/def456',
        createdAt: '2024-01-20T14:30:00Z',
        isActive: true,
        totalSent: 23,
        completedCount: 20,
        pendingCount: 3
      }
    ]

    const mockSentLinks: SentLinkStatus[] = [
      {
        id: '1',
        linkId: '1',
        recipientName: '張小明',
        recipientEmail: 'zhang.xiaoming@company.com',
        sentAt: '2024-01-15T10:30:00Z',
        status: 'completed',
        completedAt: '2024-01-16T09:15:00Z',
        testType: 'combined',
        score: 85
      },
      {
        id: '2',
        linkId: '1',
        recipientName: '李美華',
        recipientEmail: 'li.meihua@company.com',
        sentAt: '2024-01-15T11:00:00Z',
        status: 'completed',
        completedAt: '2024-01-17T14:20:00Z',
        testType: 'combined',
        score: 92
      },
      {
        id: '3',
        linkId: '1',
        recipientName: '王大偉',
        recipientEmail: 'wang.dawei@company.com',
        sentAt: '2024-01-15T11:30:00Z',
        status: 'pending',
        testType: 'combined'
      },
      {
        id: '4',
        linkId: '2',
        recipientName: '陳小芳',
        recipientEmail: 'chen.xiaofang@company.com',
        sentAt: '2024-01-20T15:00:00Z',
        status: 'completed',
        completedAt: '2024-01-21T10:45:00Z',
        testType: 'creative',
        score: 78
      }
    ]

    setTimeout(() => {
      setCurrentLinks(mockCurrentLinks)
      setSentLinks(mockSentLinks)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    // 這裡可以添加 toast 提示
  }

  const handleCreateLink = () => {
    if (!newLinkName.trim()) return

    const newLink: TestLink = {
      id: Date.now().toString(),
      name: newLinkName,
      type: newLinkType,
      url: `https://hr-assessment.com/test/${newLinkType}/${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      totalSent: 0,
      completedCount: 0,
      pendingCount: 0
    }

    setCurrentLinks([...currentLinks, newLink])
    setNewLinkName("")
    setShowCreateForm(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">已完成</Badge>
      case 'pending':
        return <Badge variant="secondary">進行中</Badge>
      case 'expired':
        return <Badge variant="destructive">已過期</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'logic':
        return '邏輯思維'
      case 'creative':
        return '創意能力'
      case 'combined':
        return '綜合能力'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回儀表板
              </Link>
            </Button>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">測驗連結管理</h1>
              <p className="text-sm text-muted-foreground">
                管理測驗連結的發送和追蹤測試完成狀態
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">目前測驗連結</TabsTrigger>
              <TabsTrigger value="sent">已送出連結狀態</TabsTrigger>
            </TabsList>

            {/* 目前測驗連結 */}
            <TabsContent value="current" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>目前測驗連結</CardTitle>
                      <CardDescription>
                        管理當前可用的測驗連結
                      </CardDescription>
                    </div>
                    <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                      <Plus className="w-4 h-4 mr-2" />
                      新增連結
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 新增連結表單 */}
                  {showCreateForm && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">新增測驗連結</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="linkName">連結名稱</Label>
                          <Input
                            id="linkName"
                            value={newLinkName}
                            onChange={(e) => setNewLinkName(e.target.value)}
                            placeholder="請輸入連結名稱"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkType">測驗類型</Label>
                          <Select value={newLinkType} onValueChange={(value: any) => setNewLinkType(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="logic">邏輯思維測驗</SelectItem>
                              <SelectItem value="creative">創意能力測驗</SelectItem>
                              <SelectItem value="combined">綜合能力測驗</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleCreateLink} disabled={!newLinkName.trim()}>
                            建立連結
                          </Button>
                          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                            取消
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 連結列表 */}
                  <div className="space-y-4">
                    {currentLinks.map((link) => (
                      <Card key={link.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">{link.name}</h3>
                                <Badge variant={link.isActive ? "default" : "secondary"}>
                                  {link.isActive ? "啟用中" : "已停用"}
                                </Badge>
                                <Badge variant="outline">{getTypeName(link.type)}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>建立時間: {new Date(link.createdAt).toLocaleString('zh-TW')}</span>
                                {link.expiresAt && (
                                  <span>到期時間: {new Date(link.expiresAt).toLocaleString('zh-TW')}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-6 text-sm">
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  總發送: {link.totalSent}
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  已完成: {link.completedCount}
                                </span>
                                <span className="flex items-center gap-1 text-orange-600">
                                  <Clock className="w-4 h-4" />
                                  進行中: {link.pendingCount}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyLink(link.url)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                複製連結
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/test/${link.type}`} target="_blank">
                                  <Eye className="w-4 h-4 mr-2" />
                                  預覽
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 已送出連結狀態 */}
            <TabsContent value="sent" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>已送出連結狀態清單</CardTitle>
                  <CardDescription>
                    追蹤已送出測驗連結的完成狀態
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>收件人</TableHead>
                        <TableHead>測驗類型</TableHead>
                        <TableHead>發送時間</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>完成時間</TableHead>
                        <TableHead>分數</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentLinks.map((sentLink) => (
                        <TableRow key={sentLink.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{sentLink.recipientName}</div>
                              <div className="text-sm text-muted-foreground">{sentLink.recipientEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getTypeName(sentLink.testType)}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(sentLink.sentAt).toLocaleString('zh-TW')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(sentLink.status)}
                          </TableCell>
                          <TableCell>
                            {sentLink.completedAt 
                              ? new Date(sentLink.completedAt).toLocaleString('zh-TW')
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {sentLink.score ? `${sentLink.score}分` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/results?user=${sentLink.recipientEmail}`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              {sentLink.status === 'pending' && (
                                <Button variant="outline" size="sm">
                                  <Send className="w-4 h-4" />
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
