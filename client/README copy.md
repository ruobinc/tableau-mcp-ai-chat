# Tableau MCP AI Chat - Frontend Client

React + TypeScript + Viteベースのフロントエンドアプリケーションです。TableauダッシュボードとAIチャット機能を統合した分析プラットフォームを提供します。

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Material-UI (MUI)** - UIコンポーネントライブラリ
- **Tableau Embedding API** - Tableau統合
- **React Router** - クライアントサイドルーティング

## 主要機能

### ページ構成

- **ホームページ** (`/home`) - メイン分析インターフェース
- **パフォーマンスページ** (`/performance`) - 分析レポート表示
- **Pulseページ** (`/pulse`) - Tableau Pulse埋め込み

### コア機能

- **分割ペインレイアウト** - Tableauダッシュボード + AIチャット
- **レスポンシブデザイン** - モバイル対応
- **リアルタイムチャット** - AI分析アシスタント
- **ダッシュボード埋め込み** - Tableau Connected App認証

## 開発コマンド

### 環境構築

```bash
# 依存関係をインストール
npm install

# 開発サーバー起動 (localhost:5173)
npm run dev
```

### ビルド・デプロイ

```bash
# TypeScriptコンパイル + プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview

# ESLintによるコード品質チェック
npm run lint
```

## ディレクトリ構成

```
src/
├── config/                 # 設定ファイル
│   ├── api.ts              # API設定
│   └── tableau.ts          # Tableau設定
├── features/               # 機能別コンポーネント
│   ├── chat/               # AIチャット機能
│   └── tableau/            # Tableau統合
│       ├── components/     # 埋め込みコンポーネント
│       └── hooks/          # カスタムフック
├── pages/                  # ページコンポーネント
│   ├── home/               # ホームページ
│   ├── performance/        # パフォーマンス分析
│   └── pulse/              # Pulse表示
├── providers/              # コンテキストプロバイダー
└── App.tsx                 # メインアプリケーション
```

## API統合

### バックエンド接続

```typescript
// API設定 (src/config/api.ts)
export const API_BASE_URL = 'http://localhost:8000';

// 主要エンドポイント
POST /api/chat           // AIチャット
POST /api/create_report  // レポート生成
POST /api/create_chart   // チャート生成
POST /api/generate_jwt   // Tableau認証
```

### Tableau統合

- **Connected App認証** - JWT トークンベース
- **埋め込みダッシュボード** - Tableau Embedding API v3
- **Pulse表示** - シンプル埋め込みモード

## 開発設定

### TypeScript設定

- `tsconfig.json` - アプリケーション設定
- `tsconfig.node.json` - Vite設定
- パス解決: `@/` → `src/`

### ESLint設定

- React/TypeScript対応
- Prettier統合
- Import ソート
- React Hooks ルール

### Vite設定

- React SWC プラグイン
- Hot Module Replacement (HMR)
- TypeScript サポート

## 重要な特徴

- **レスポンシブ設計**: モバイルファーストアプローチ
- **型安全性**: 全てのコンポーネントでTypeScript活用
- **再利用可能性**: 機能別にコンポーネント分離
- **パフォーマンス最適化**: Viteによる高速開発・ビルド
- **マテリアルデザイン**: MUIコンポーネントで統一されたUX

## ブラウザサポート

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- モバイルブラウザ対応