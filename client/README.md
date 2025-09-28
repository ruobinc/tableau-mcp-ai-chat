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
│   ├── api.ts              # API接続設定
│   ├── tableau.ts          # Tableau設定
│   └── constants.ts        # アプリケーション定数
├── contexts/               # React コンテキスト
│   └── DarkModeContext.tsx # ダークモード管理
├── theme/                  # MUIテーマ設定
│   └── theme.ts            # テーマ定義
├── utils/                  # ユーティリティ関数
│   ├── date.ts             # 日付関連ユーティリティ
│   └── storage.ts          # ローカルストレージ管理
├── features/               # 機能別モジュール
│   ├── chat/               # AIチャット機能
│   │   ├── components/     # チャット関連コンポーネント
│   │   ├── hooks/          # チャット用カスタムフック
│   │   ├── styles/         # チャット専用スタイル
│   │   └── types.ts        # 型定義
│   └── tableau/            # Tableau統合
│       ├── components/     # 埋め込みコンポーネント
│       └── hooks/          # Tableau用カスタムフック
├── components/             # 共通UIコンポーネント
│   ├── markdown/           # Markdown表示
│   └── navigation/         # ナビゲーション
├── pages/                  # ページコンポーネント
│   ├── HomePage.tsx        # ホームページ
│   ├── PerformancePage.tsx # パフォーマンス分析
│   └── PulsePage.tsx       # Pulse表示
├── providers/              # コンテキストプロバイダー
├── lib/                    # 外部ライブラリ統合
│   └── http.ts             # HTTP通信ユーティリティ
└── App.tsx                 # メインアプリケーション
```

## リファクタリング改善点

### 🏗️ アーキテクチャ改善
- **定数の一元管理**: すべての設定値を `constants.ts` に集約
- **環境変数テンプレート**: `.env.example` でデプロイ設定を標準化
- **テーマシステム分離**: MUIテーマを独立したモジュールに分離
- **コンテキスト分離**: ダークモード管理を専用コンテキストに抽出

### 🧩 コンポーネント分割
- **ChatPanel分割**: 802行の巨大コンポーネントを複数の小さなコンポーネントに分離
- **スタイル分離**: インラインスタイルを専用ファイルに抽出
- **メッセージコンポーネント**: 再利用可能な ChatMessage コンポーネントを作成
- **ユーティリティ統合**: 日付処理やストレージ操作を共通化

### 🚀 パフォーマンス最適化
- **コード重複削除**: 類似処理を共通関数に統合
- **レンダリング最適化**: useCallback と適切な依存配列を設定
- **バンドルサイズ削減**: 不要なインポートを削除
- **型安全性向上**: より厳密な型定義を追加

### 🔧 開発体験改善
- **ESLint最適化**: コード品質ルールの統一
- **Import整理**: アルファベット順ソートで可読性向上
- **構造化ログ**: より詳細なエラー情報とデバッグ支援
- **Docker対応準備**: 環境変数ベース設定でコンテナ化対応

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