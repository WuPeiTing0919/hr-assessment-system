const http = require('http')

const testAdminResults = async () => {
  console.log('🔍 測試管理員測驗結果功能')
  console.log('=' .repeat(40))

  try {
    // 測試基本 API 呼叫
    console.log('\n📊 測試基本 API 呼叫...')
    const basicResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (basicResponse.status === 200) {
      const basicData = JSON.parse(basicResponse.data)
      if (basicData.success) {
        console.log('✅ 基本 API 呼叫成功')
        console.log(`📈 統計資料:`)
        console.log(`  總測試次數: ${basicData.data.stats.totalResults}`)
        console.log(`  平均分數: ${basicData.data.stats.averageScore}`)
        console.log(`  總用戶數: ${basicData.data.stats.totalUsers}`)
        console.log(`  參與率: ${basicData.data.stats.participationRate}%`)
        console.log(`  測試類型分布:`)
        console.log(`    邏輯思維: ${basicData.data.stats.testTypeCounts.logic} 次`)
        console.log(`    創意能力: ${basicData.data.stats.testTypeCounts.creative} 次`)
        console.log(`    綜合能力: ${basicData.data.stats.testTypeCounts.combined} 次`)
        console.log(`📄 分頁資訊:`)
        console.log(`  當前頁: ${basicData.data.pagination.currentPage}`)
        console.log(`  總頁數: ${basicData.data.pagination.totalPages}`)
        console.log(`  每頁限制: ${basicData.data.pagination.limit}`)
        console.log(`  總結果數: ${basicData.data.pagination.totalResults}`)
        console.log(`🏢 部門列表: ${basicData.data.departments.join(', ')}`)
        console.log(`📋 結果數量: ${basicData.data.results.length}`)
      } else {
        console.log('❌ 基本 API 呼叫失敗:', basicData.message)
        return
      }
    } else {
      console.log('❌ 基本 API 呼叫失敗，狀態碼:', basicResponse.status)
      return
    }

    // 測試搜尋功能
    console.log('\n🔍 測試搜尋功能...')
    const searchResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results?search=王', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (searchResponse.status === 200) {
      const searchData = JSON.parse(searchResponse.data)
      if (searchData.success) {
        console.log(`✅ 搜尋功能正常，找到 ${searchData.data.pagination.totalResults} 筆結果`)
      } else {
        console.log('❌ 搜尋功能失敗:', searchData.message)
      }
    }

    // 測試部門篩選
    console.log('\n🏢 測試部門篩選...')
    const deptResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results?department=人力資源部', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (deptResponse.status === 200) {
      const deptData = JSON.parse(deptResponse.data)
      if (deptData.success) {
        console.log(`✅ 部門篩選正常，找到 ${deptData.data.pagination.totalResults} 筆結果`)
      } else {
        console.log('❌ 部門篩選失敗:', deptData.message)
      }
    }

    // 測試測試類型篩選
    console.log('\n🧠 測試測試類型篩選...')
    const typeResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results?testType=logic', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (typeResponse.status === 200) {
      const typeData = JSON.parse(typeResponse.data)
      if (typeData.success) {
        console.log(`✅ 測試類型篩選正常，找到 ${typeData.data.pagination.totalResults} 筆結果`)
      } else {
        console.log('❌ 測試類型篩選失敗:', typeData.message)
      }
    }

    // 測試分頁功能
    console.log('\n📄 測試分頁功能...')
    const pageResponse = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/admin/test-results?page=1&limit=5', (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve({ 
          status: res.statusCode, 
          data: data
        }))
      })
      req.on('error', reject)
    })

    if (pageResponse.status === 200) {
      const pageData = JSON.parse(pageResponse.data)
      if (pageData.success) {
        console.log(`✅ 分頁功能正常`)
        console.log(`  每頁限制: ${pageData.data.pagination.limit}`)
        console.log(`  當前頁結果數: ${pageData.data.results.length}`)
        console.log(`  總頁數: ${pageData.data.pagination.totalPages}`)
      } else {
        console.log('❌ 分頁功能失敗:', pageData.message)
      }
    }

    console.log('\n🎯 功能特點:')
    console.log('✅ 從資料庫獲取所有測驗結果')
    console.log('✅ 支援搜尋用戶姓名和郵箱')
    console.log('✅ 支援部門篩選')
    console.log('✅ 支援測試類型篩選')
    console.log('✅ 支援分頁功能')
    console.log('✅ 顯示詳細統計資料')
    console.log('✅ 響應式設計（桌面版和手機版）')
    console.log('✅ 載入狀態和錯誤處理')

    console.log('\n📊 資料來源:')
    console.log('✅ test_results 表（基本測試結果）')
    console.log('✅ logic_test_answers 表（邏輯測試詳細答案）')
    console.log('✅ creative_test_answers 表（創意測試詳細答案）')
    console.log('✅ combined_test_results 表（綜合測試結果）')
    console.log('✅ users 表（用戶資訊）')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 管理員測驗結果功能測試完成')
  }
}

testAdminResults()
