# 簡易 3D 模型檢視器 (GLB Viewer)

這是一個基於 React + Vite + Three.js 開發的輕量級 3D 模型檢視器，專門設計用於比較兩個 GLB 模型。

## 功能特色

- **雙模型比較**: 預設讀取 `完整版實照.glb` 與 `完整版白框.glb`。
- **即時切換**: 提供按鈕可瞬間切換顯示兩個模型，方便比較差異。
- **視角鎖定**: 切換模型時，相機的角度、縮放與位置會完全保持一致 (OrbitControls Sync)。
- **讀取進度條**: 內建全螢幕 Loading UI，清楚顯示載入百分比。
- **深色主題**: 簡潔的黑色系介面，專注於模型展示。

## 本地開發與執行

確保您的環境已安裝 Node.js (建議 v20 或 v22 LTS)。

1.  **安裝依賴**:
    ```bash
    npm install
    ```

2.  **啟動開發伺服器**:
    ```bash
    npm run dev
    ```
    啟動後請訪問 `http://localhost:5173`。

3.  **建置生產版本**:
    ```bash
    npm run build
    ```
    打包後的檔案將位於 `dist` 資料夾。

## 檔案配置

若要更換顯示的模型，請將您的 `.glb` 檔案放入 `public` 資料夾，並修改 `src/App.jsx` 中的 `models` 設定：

```javascript
const models = [
  { name: '您的模型 A', url: '/your-model-a.glb' },
  { name: '您的模型 B', url: '/your-model-b.glb' }
];
```

## 部屬至 Zeabur

本專案支援 Zeabur 自動部屬 (Static Site)：

1.  將程式碼 (包含 `public` 內的 GLB 檔案) Push 至 GitHub。
2.  在 Zeabur 新增服務 -> Git -> 選擇儲存庫。
3.  Zeabur 會自動偵測 Vite 專案並完成建置與上線。
