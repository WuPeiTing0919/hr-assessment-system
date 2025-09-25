import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, BarChart3, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TestsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首頁
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">測試中心</h1>
              <p className="text-sm text-muted-foreground">選擇您要進行的測試類型</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">選擇測試類型</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              我們提供三種不同的測試模式，您可以根據需要選擇單項測試或綜合評估
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logic Test */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">邏輯思維測試</CardTitle>
                <CardDescription className="text-base">評估邏輯推理、分析判斷和問題解決能力</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">題目數量</span>
                    <span className="font-medium">10 題</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">題目類型</span>
                    <span className="font-medium">單選題</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">預計時間</span>
                    <span className="font-medium">15-20 分鐘</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/tests/logic">開始測試</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Creative Test */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/20">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Lightbulb className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">創意能力測試</CardTitle>
                <CardDescription className="text-base">評估創新思維、想像力和創造性解決問題的能力</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">題目數量</span>
                    <span className="font-medium">20 題</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">題目類型</span>
                    <span className="font-medium">5級量表</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">預計時間</span>
                    <span className="font-medium">25-30 分鐘</span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <Link href="/tests/creative">開始測試</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Combined Test */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">綜合能力測試</CardTitle>
                <CardDescription className="text-base">完整的邏輯思維 + 創意能力雙重評估</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">題目數量</span>
                    <span className="font-medium">30 題</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">測試內容</span>
                    <span className="font-medium">邏輯 + 創意</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">預計時間</span>
                    <span className="font-medium">40-45 分鐘</span>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full text-lg">
                  <Link href="/tests/combined">開始綜合測試</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">測試說明</h3>
                <div className="text-sm text-muted-foreground space-y-2 text-left">
                  <p>• 所有測試都有時間限制，請合理安排答題時間</p>
                  <p>• 邏輯題和創意題不會混合出現，會分別進行</p>
                  <p>• 綜合測試將先進行邏輯題，再進行創意題</p>
                  <p>• 測試結果會自動保存，您可以隨時查看歷史成績</p>
                  <p>• 建議在安靜的環境中完成測試，以獲得最佳結果</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
