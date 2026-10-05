# 📋 Vue 3 + TypeScript 採買小清單

一個以 **Vue 3 + TypeScript** 開發的採買清單管理工具，支援離線使用，讓使用者可以快速新增、編輯與管理日常採買項目。

---

## 🛠️ 技術棧與工具

- **前端框架**：[Vue 3](https://vuejs.org/)（Composition API + `<script setup>`）
- **程式語言**：[TypeScript](https://www.typescriptlang.org/)
- **建置工具**：[Vite](https://vitejs.dev/)
- **狀態管理**：[Pinia](https://pinia.vuejs.org/)
- **路由管理**：[Vue Router](https://router.vuejs.org/)
- **樣式處理**：[Sass / SCSS](https://sass-lang.com/)
- **圖表**：[ECharts](https://echarts.apache.org/)
- **Excel 處理**：[SheetJS](https://sheetjs.com/)
- **PWA**：[vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **程式碼檢查**：ESLint

---

## 📂 專案目錄結構

```text
public/
├── favicon.ico
├── pwa-192x192.png
└── pwa-512x512.png

src/
├── App.vue
├── main.ts
├── assets/
│   └── style/
│       ├── main.scss
│       └── _variables.scss
├── components/
│   ├── BaseButton.vue
│   ├── ConfirmModal.vue
│   ├── DonutChart.vue
│   ├── GlobalToast.vue
│   ├── InputField.vue
│   ├── NoData.vue
│   ├── OperateTaskModal.vue
│   ├── PwaUpdate.vue
│   └── SearchInput.vue
├── router/
│   └── index.ts
├── stores/
│   ├── toast.ts
│   └── todoList.ts
├── type/
│   └── list.ts
├── utils/
│   ├── constants.ts
│   └── index.ts
└── views/
    └── HomeView.vue
```

---

## 📌 資料功能

每筆採買資料包含：

| 欄位     | 說明                 |
| -------- | -------------------- |
| 項目名稱 | 採買項目的名稱       |
| 金額     | 項目的預估或實際金額 |
| 日期     | 採買或預計採買日期   |
| 備註     | 補充採買資訊         |
| 狀態     | 進行中或已完成       |

資料會儲存在瀏覽器的 **LocalStorage**，因此不需要登入或後端 API 即可使用。

---

## 📊 主要功能

| 功能            | 說明                      |
| --------------- | ------------------------- |
| 📝 新增項目     | 建立新的採買項目          |
| ✍️ 編輯項目     | 修改既有採買資料          |
| 🧹 刪除項目     | 刪除單筆或全部採買資料    |
| 🔍 搜尋         | 依項目名稱快速搜尋        |
| 🔖 狀態篩選     | 全部／進行中／已完成      |
| 📊 完成進度     | 以圓形圖表顯示完成比例    |
| 💰 金額統計     | 顯示目前採買清單總花費    |
| ⬇️ Excel 匯入   | 從 Excel 建立採買清單     |
| 📤 Excel 匯出   | 將清單匯出成 Excel        |
| 💾 LocalStorage | 儲存使用者的採買資料      |
| 📱 PWA          | 支援安裝與離線使用        |
| 🔄 更新提示     | 偵測 PWA 新版本並提示更新 |
| 📱 RWD          | 支援手機與桌機畫面        |

---

## ⚙️ 快速啟動

### 1. 安裝套件

```bash
npm install
```

### 2. 啟動開發環境

```bash
npm run dev
```

### 3. 專案打包

```bash
npm run build
```

### 4. 預覽打包結果

```bash
npm run preview
```

---

## 🌐 Demo

https://vue-vite-todolist.vercel.app/
