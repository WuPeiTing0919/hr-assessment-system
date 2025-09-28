# 資料庫設置指南

## 環境變數設置

請在專案根目錄建立 `.env.local` 檔案，並加入以下內容：

```env
# 資料庫配置
DB_HOST=mysql.theaken.com
DB_PORT=33306
DB_NAME=db_hr_assessment
DB_USER=hr_assessment
DB_PASSWORD=QFOts8FlibiI

# Next.js 環境變數
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# 其他配置
NODE_ENV=development
```

## 安裝依賴

```bash
npm install
# 或
pnpm install
```

## 資料庫初始化

資料庫會在應用程式啟動時自動初始化，包括：

1. 建立用戶表
2. 建立預設管理員和測試用戶

### 預設用戶

- **管理員帳號**: admin@company.com / admin123
- **測試用戶**: user@company.com / user123

## 資料庫結構

### users 表

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | VARCHAR(36) | 用戶唯一識別碼 (UUID) |
| name | VARCHAR(255) | 用戶姓名 |
| email | VARCHAR(255) | 電子郵件 (唯一) |
| password | VARCHAR(255) | 密碼 |
| department | VARCHAR(100) | 部門 |
| role | ENUM('admin', 'user') | 角色 |
| created_at | TIMESTAMP | 建立時間 |
| updated_at | TIMESTAMP | 更新時間 |

## 手動種子資料庫

如果需要重新種子資料庫，可以執行：

```bash
npx tsx lib/database/seed.ts
```

## 密碼安全

- 所有密碼都使用 bcrypt 進行雜湊處理
- 雜湊強度：12 rounds
- 密碼在資料庫中以雜湊形式儲存，不會以明文顯示

## 可用的腳本

- `npm run test-db` - 測試資料庫連接
- `npm run check-passwords` - 檢查密碼雜湊狀態
- `npm run reset-users` - 重新建立用戶數據（使用雜湊密碼）
- `npm run test-login` - 測試登入功能（需要先啟動開發伺服器）

## 注意事項

1. 確保資料庫伺服器可訪問
2. 密碼已使用 bcrypt 進行雜湊處理，安全性更高
3. 環境變數檔案 `.env.local` 不會被提交到版本控制
4. 資料庫連接使用連接池以提高效能
5. JWT 密碼已設置在環境變數中
