"use client"

import type React from "react"

import { useState } from "react"
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
  Upload,
  Download,
  Brain,
  Lightbulb,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { logicQuestions } from "@/lib/questions/logic-questions"
import { creativeQuestions } from "@/lib/questions/creative-questions"
import { parseExcelFile, type ImportResult } from "@/lib/utils/excel-parser"

export default function QuestionsManagementPage() {
  return (
    <ProtectedRoute adminOnly>
      <QuestionsManagementContent />
    </ProtectedRoute>
  )
}

function QuestionsManagementContent() {
  const [activeTab, setActiveTab] = useState("logic")
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<"logic" | "creative">("logic")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      ) {
        setSelectedFile(file)
        setImportResult(null)
      } else {
        setImportResult({
          success: false,
          message: "請選擇 Excel 檔案 (.xlsx 或 .xls)",
        })
      }
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setImportResult({
        success: false,
        message: "請先選擇要匯入的 Excel 檔案",
      })
      return
    }

    setIsImporting(true)

    try {
      const result = await parseExcelFile(selectedFile, importType)
      setImportResult(result)

      if (result.success) {
        setSelectedFile(null)
        // 重置檔案輸入
        const fileInput = document.getElementById("file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: "匯入失敗，請檢查檔案格式是否正確",
        errors: [error instanceof Error ? error.message : "未知錯誤"],
      })
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = (type: "logic" | "creative") => {
    let csvContent = ""

    if (type === "logic") {
      csvContent = [
        ["題目ID", "題目內容", "選項A", "選項B", "選項C", "選項D", "正確答案", "解釋"],
        [
          "1",
          "範例題目：如果所有A都是B，所有B都是C，那麼？",
          "所有A都是C",
          "所有C都是A",
          "有些A不是C",
          "無法確定",
          "A",
          "根據邏輯推理...",
        ],
        ["2", "在序列 2, 4, 8, 16, ? 中，下一個數字是？", "24", "32", "30", "28", "B", "每個數字都是前一個數字的2倍"],
      ]
        .map((row) => row.join(","))
        .join("\n")
    } else {
      csvContent = [
        ["題目ID", "陳述內容", "類別", "是否反向計分"],
        ["1", "我經常能想出創新的解決方案", "innovation", "否"],
        ["2", "我更喜歡按照既定規則工作", "flexibility", "是"],
        ["3", "我喜歡嘗試新的做事方法", "innovation", "否"],
      ]
        .map((row) => row.join(","))
        .join("\n")
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${type === "logic" ? "邏輯思維" : "創意能力"}題目範本.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
                <span className="hidden sm:inline">返回儀表板</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">題目管理</h1>
              <p className="text-sm text-muted-foreground">管理測試題目和匯入新題目</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Import Section */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Excel 檔案匯入
              </CardTitle>
              <CardDescription>上傳 Excel 檔案來批量匯入測試題目。支援邏輯思維測試和創意能力測試題目。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-input">選擇 Excel 檔案</Label>
                    <Input
                      id="file-input"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>題目類型</Label>
                    <Select value={importType} onValueChange={(value: "logic" | "creative") => setImportType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logic">邏輯思維測試</SelectItem>
                        <SelectItem value="creative">創意能力測試</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">已選擇：{selectedFile.name}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleImport} disabled={!selectedFile || isImporting} className="flex-1">
                    {isImporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        匯入中...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        開始匯入
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Import Result */}
              {importResult && (
                <Alert variant={importResult.success ? "default" : "destructive"}>
                  {importResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>
                    {importResult.message}
                    {importResult.errors && (
                      <ul className="mt-2 list-disc list-inside">
                        {importResult.errors.map((error, index) => (
                          <li key={index} className="text-sm">
                            {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Template Download */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">下載範本檔案</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => downloadTemplate("logic")} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    邏輯思維範本
                  </Button>
                  <Button variant="outline" onClick={() => downloadTemplate("creative")} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    創意能力範本
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Questions */}
          <Card>
            <CardHeader>
              <CardTitle>現有題目管理</CardTitle>
              <CardDescription>查看和管理系統中的測試題目</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="logic" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    邏輯思維 ({logicQuestions.length})
                  </TabsTrigger>
                  <TabsTrigger value="creative" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    創意能力 ({creativeQuestions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="logic" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">邏輯思維測試題目</h3>
                    <Badge variant="outline">{logicQuestions.length} 道題目</Badge>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>題目ID</TableHead>
                        <TableHead>題目內容</TableHead>
                        <TableHead>選項數量</TableHead>
                        <TableHead>正確答案</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logicQuestions.slice(0, 10).map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.id}</TableCell>
                          <TableCell className="max-w-md truncate">{question.question}</TableCell>
                          <TableCell>{question.options.length}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 text-white">{question.correctAnswer}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="creative" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">創意能力測試題目</h3>
                    <Badge variant="outline">{creativeQuestions.length} 道題目</Badge>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>題目ID</TableHead>
                        <TableHead>陳述內容</TableHead>
                        <TableHead>類別</TableHead>
                        <TableHead>反向計分</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creativeQuestions.slice(0, 10).map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.id}</TableCell>
                          <TableCell className="max-w-md truncate">{question.statement}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{question.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {question.isReverse ? (
                              <Badge className="bg-orange-500 text-white">是</Badge>
                            ) : (
                              <Badge variant="outline">否</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
