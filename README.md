# Tableau MCP AI Chat

TableauダッシュボードとAI分析アシスタントを統合した対話型分析プラットフォームです。Anthropic Claude (AWS Bedrock) とTableau MCP (Model Context Protocol) を活用して、データ可視化と自然言語による分析を組み合わせます。

## 概要

このアプリケーションは、Tableauダッシュボードを表示しながら、AI分析アシスタントとリアルタイムで対話できる分割ペインインターフェースを提供します。ユーザーは日本語でデータに関する質問を投げかけ、AIが分析結果とともにChart.jsベースのダッシュボードやチャートを自動生成します。

## アーキテクチャ

### フロントエンド (React + TypeScript + Vite)
- **場所**: `client/`
- **技術**: React 18, TypeScript, Material-UI, Tableau Embedding API
- **機能**:
  - 機能別モジュール設計 (features/chat, features/tableau)
  - ページベースルーティング (pages/)
  - 再利用可能コンポーネント (components/)
  - テーマベースデザインシステム (theme/)
  - レスポンシブ分割ペインUI

### バックエンド (FastAPI + Python)
- **場所**: `server/`
- **技術**: FastAPI, Anthropic Bedrock, MCP Protocol
- **機能**:
  - 非同期AI処理
  - Tableauデータアクセス (MCP)
  - 動的ダッシュボード生成
  - JWT認証・セキュリティ
  - 構造化ログ・監視

## クイックスタート

### 前提条件
- Node.js 18+
- Python 3.11+
- UV (Pythonパッケージマネージャー)
- AWS Bedrock アクセス
- Tableau Server/Cloud アクセス

### 1. リポジトリクローン
```bash
git clone https://github.com/your-repo/tableau-mcp-ai-chat.git
cd tableau-mcp-ai-chat
```

### 2. バックエンド設定
```bash
cd server
uv sync

# 環境設定
cp .env.example app/.env
# app/.env を編集してAWS/Tableau設定を追加

# サーバー起動
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. フロントエンド設定
```bash
cd client
npm install

# 開発サーバー起動
npm run dev
```

### 4. アクセス
- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000

## 主要機能

### 🤖 AIチャット分析
- 日本語での自然言語クエリ
- Tableauデータへのリアルタイムアクセス
- 分析結果の自動可視化
- 思考プロセスの可視化UI
- キャンセル可能な非同期処理

### 📊 Tableau統合
- Tableau Connected App認証 (JWT)
- 埋め込みダッシュボード表示
- Tableau Pulse メトリクス表示（単一・複数）
- レスポンシブ分割ペインUI

### 📈 動的レポート生成
- Chart.jsベースのダッシュボード自動生成
- 分析結果に基づくチャート作成
- HTMLレポート出力
- パフォーマンス監視・メトリクス

### 🎨 ユーザーエクスペリエンス
- ダークモード対応
- レスポンシブデザイン
- ページ間ナビゲーション
- ローディング・エラーハンドリング

## 技術スタック

### フロントエンド
- **React 18** + **TypeScript** - モダンUIライブラリ
- **Vite** - 高速開発・ビルドツール
- **Material-UI (MUI)** - UIコンポーネント・テーマシステム
- **Tableau Embedding API v3** - ダッシュボード統合
- **React Router** - ページ間ナビゲーション
- **Chart.js** - 動的チャート生成
- **ESLint + Prettier** - コード品質管理

### バックエンド
- **FastAPI** - 非同期Webフレームワーク
- **Anthropic Bedrock** - Claude AI統合
- **MCP Protocol** - Tableauデータアクセス
- **Pydantic** - データバリデーション

## 環境設定

### AWS Bedrock設定
```env
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SESSION_TOKEN=your_session_token
BEDROCK_MODEL_ID=apac.anthropic.claude-sonnet-4-20250514-v1:0
```

### Tableau設定
```env
SERVER_SCRIPT_PATH=/path/to/tableau-mcp-server.py
SERVER=your-tableau-server.com
SITE_NAME=your-site
PAT_NAME=your_pat_name
PAT_VALUE=your_pat_value
```

## 開発ワークフロー

### 開発コマンド
```bash
# バックエンド
cd server
uv run uvicorn app.main:app --reload    # 開発サーバー
uv run python app/services/mcp_service.py  # MCP接続テスト

# フロントエンド
cd client
npm run dev      # 開発サーバー
npm run build    # プロダクションビルド
npm run lint     # コード品質チェック
```

### プロジェクト構造
```
tableau-mcp-ai-chat/
├── client/                          # React フロントエンド
│   ├── src/
│   │   ├── components/             # 汎用再利用コンポーネント
│   │   ├── features/               # 機能別モジュール
│   │   │   ├── chat/              # AIチャット機能
│   │   │   │   ├── components/    # チャット専用コンポーネント
│   │   │   │   └── styles/        # チャット専用スタイル
│   │   │   └── tableau/           # Tableau統合機能
│   │   │       ├── components/    # Tableau専用コンポーネント
│   │   │       ├── hooks/         # Tableau専用フック
│   │   │       ├── styles/        # Tableau専用スタイル
│   │   │       └── types/         # Tableau専用型定義
│   │   ├── pages/                 # ページコンポーネント
│   │   │   ├── components/        # ページ共通コンポーネント
│   │   │   │   ├── JWTPageWrapper.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── MetricCard.tsx
│   │   │   ├── HomePage.tsx       # ホームページ
│   │   │   ├── PulsePage.tsx      # Tableau Pulseページ
│   │   │   └── PerformancePage.tsx # パフォーマンス監視ページ
│   │   ├── config/                # アプリケーション設定
│   │   ├── contexts/              # Reactコンテキスト
│   │   ├── providers/             # プロバイダコンポーネント
│   │   ├── theme/                 # MUIテーマ設定
│   │   ├── utils/                 # ユーティリティ関数
│   │   └── samples/               # サンプルデータ・テンプレート
│   └── package.json
├── server/                          # FastAPI バックエンド
│   ├── app/
│   │   ├── routers/               # API エンドポイント
│   │   ├── services/              # ビジネスロジック
│   │   ├── models/                # データモデル
│   │   └── config/                # 設定・プロンプト
│   └── pyproject.toml
└── CLAUDE.md                        # 開発ガイド
```

## 特徴

### 🏗️ アーキテクチャ
- **モジュラー設計**: features/でドメイン別にコンポーネント分離
- **グレースフルデグラデーション**: MCP接続失敗時もシンプルモードで動作
- **型安全性**: TypeScript + Pydanticによる堅牢な型システム
- **関心の分離**: コンポーネント・スタイル・型定義の明確な分離

### 🎨 ユーザビリティ
- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **テーマシステム**: MUIベースのダークモード対応
- **直感的ナビゲーション**: React Routerによるページ遷移
- **日本語最適化**: 日本語プロンプトとUI最適化

### 🔧 開発体験
- **構造化ログ**: 包括的なログ・監視システム
- **ホットリロード**: Vite + React Fast Refreshによる高速開発
- **コード品質**: ESLint + Prettierによる統一されたコードスタイル
- **型推論**: TypeScriptによるIDEサポート強化

## ライセンス

MIT License

## 詳細な技術仕様

### 🔧 バックエンド詳細 (server/)

#### サービス層アーキテクチャ
- **BedrockService**: Anthropic Claude Sonnet 4 API統合・ストリーミング対応
- **MCPService**: Tableau MCP サーバーとの通信・ツール実行・データアクセス
- **AuthService**: Tableau Connected App JWT生成・管理・有効性検証
- **DashboardService**: Chart.js ベースのダッシュボード・チャート自動生成

#### API エンドポイント詳細
- **`POST /api/chat`** - メインAIチャット処理
  - MCP接続時: Tableau データアクセス + Claude分析
  - フォールバック: シンプルなClaude対話
  - 機能: ストリーミングレスポンス、ツール呼び出し、思考プロセス可視化
- **`POST /api/create_report`** - Chart.js ベースの動的ダッシュボード作成
- **`POST /api/create_chart`** - 各種チャートタイプ対応（棒グラフ、線グラフ、円グラフ等）
- **`POST /api/jwt`** - Tableau Connected App JWT生成・署名・有効期限管理

#### ログ・監視システム
- **構造化ログ**: UUID ベースの完全なリクエストライフサイクル追跡
- **パフォーマンス測定**: API呼び出し時間・レスポンス時間の詳細計測
- **Token使用量監視**: Anthropic API トークン消費量のリアルタイム監視
- **エラー詳細記録**: スタックトレース・コンテキスト情報付きエラーログ

### 🎨 フロントエンド詳細 (client/)

#### コンポーネント設計原則
- **機能別モジュール設計**: features/chat, features/tableau による分離
- **ページベースルーティング**: HomePage, PulsePage, PerformancePage
- **テーマベースデザイン**: MUIシステムによるダークモード対応
- **型安全性**: TypeScript + 厳密な型定義

#### 主要機能
- **リアルタイムAIチャット**: ストリーミング・思考プロセス可視化
- **Tableau統合**: Connected App認証・ダッシュボード埋め込み・Pulse表示
- **レスポンシブUI**: モバイルファーストアプローチ
- **パフォーマンス監視**: メトリクス表示・可視化

#### 開発者体験
- **ESLint + Prettier**: 統一されたコードスタイル・品質管理
- **Vite**: 超高速開発・ビルドツール
- **React Fast Refresh**: ホットリロード最適化
- **TypeScript**: IDEサポート強化・型推論

## 開発者向けリソース

### 重要なファイル
- **`server/app/.env`** - バックエンド環境設定（AWS Bedrock, Tableau MCP）
- **`client/src/config/`** - フロントエンド設定（API接続、Tableau設定）

### トラブルシューティング
- **MCP接続失敗**: `uv run python app/services/mcp_service.py` でテスト
- **フロントエンドlintエラー**: `npm run lint -- --fix` で自動修正
- **ビルドエラー**: `npm run build` で詳細エラー確認