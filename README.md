# Tableau MCP AI Chat

TableauダッシュボードとAI分析アシスタントを統合した対話型分析プラットフォームです。Anthropic Claude (AWS Bedrock) とTableau MCP (Model Context Protocol) を活用して、データ可視化と自然言語による分析を組み合わせます。

## 概要

このアプリケーションは、Tableauダッシュボードを表示しながら、AI分析アシスタントとリアルタイムで対話できる分割ペインインターフェースを提供します。ユーザーは日本語でデータに関する質問を投げかけ、AIが分析結果とともにChart.jsベースのダッシュボードやチャートを自動生成します。

## アーキテクチャ

### フロントエンド (React + TypeScript + Vite)
- **場所**: `client/`
- **技術**: React 18, TypeScript, Material-UI, Tableau Embedding API
- **機能**: レスポンシブ分割ペイン、Tableau埋め込み、AIチャットUI

### バックエンド (FastAPI + Python)
- **場所**: `server/`
- **技術**: FastAPI, Anthropic Bedrock, MCP Protocol
- **機能**: AI処理、Tableauデータアクセス、ダッシュボード生成

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

### AIチャット分析
- 日本語での自然言語クエリ
- Tableauデータへのリアルタイムアクセス
- 分析結果の自動可視化

### ダッシュボード統合
- Tableau Connected App認証
- 埋め込みダッシュボード表示
- Tableau Pulse サポート

### 動的レポート生成
- Chart.jsベースのダッシュボード自動生成
- 分析結果に基づくチャート作成
- HTMLレポート出力

## 技術スタック

### フロントエンド
- **React 18** + **TypeScript** - モダンUIライブラリ
- **Vite** - 高速開発・ビルドツール
- **Material-UI (MUI)** - UIコンポーネント
- **Tableau Embedding API v3** - ダッシュボード統合

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
├── client/                 # React フロントエンド
│   ├── src/
│   │   ├── features/      # 機能別コンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   └── config/        # 設定ファイル
│   └── package.json
├── server/                 # FastAPI バックエンド
│   ├── app/
│   │   ├── routers/       # API エンドポイント
│   │   ├── services/      # ビジネスロジック
│   │   ├── models/        # データモデル
│   │   └── config/        # 設定・プロンプト
│   └── pyproject.toml
└── CLAUDE.md              # 開発ガイド
```

## 特徴

- **グレースフルデグラデーション**: MCP接続失敗時もシンプルモードで動作
- **レスポンシブデザイン**: デスクトップ・モバイル対応
- **構造化ログ**: 包括的なログ・監視システム
- **型安全性**: TypeScript + Pydanticによる堅牢な型システム
- **日本語最適化**: 日本語プロンプトとUI最適化

## ライセンス

MIT License

## サポート

詳細な開発ガイドは各ディレクトリのREADMEを参照してください：
- [バックエンド開発ガイド](./server/README.md)
- [フロントエンド開発ガイド](./client/README.md)