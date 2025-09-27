# Tableau MCP AI Chat - Backend Server

FastAPIベースのTableau分析AIチャットアプリケーションのバックエンドサーバーです。Anthropic Claude (AWS Bedrock) とTableau MCP (Model Context Protocol) を統合して、対話型の分析レポートとダッシュボード生成を提供します。

## 技術スタック

- **FastAPI** - 非同期Webフレームワーク
- **Python 3.11+** - プログラミング言語
- **Anthropic Bedrock** - Claude AIモデル統合
- **MCP (Model Context Protocol)** - Tableau データアクセス
- **UV** - Pythonパッケージマネージャー

## アーキテクチャ

### ディレクトリ構成

```
app/
├── config/                 # 設定管理
│   ├── settings.py         # 環境設定
│   └── prompts.py          # システムプロンプト
├── core/                   # コア機能
│   ├── exceptions.py       # カスタム例外
│   ├── logging.py          # 構造化ログ
│   └── response_utils.py   # レスポンス処理
├── models/                 # データモデル
│   ├── requests.py         # リクエストモデル
│   └── responses.py        # レスポンスモデル
├── routers/                # API エンドポイント
│   ├── auth.py             # Tableau JWT認証
│   ├── chat.py             # AI チャット
│   └── dashboard.py        # ダッシュボード生成
├── services/               # ビジネスロジック
│   ├── bedrock_service.py  # Bedrock API統合
│   ├── dashboard_service.py # ダッシュボード生成
│   └── mcp_service.py      # MCP サーバー通信
├── dependencies.py         # 依存性注入
└── main.py                 # FastAPI アプリケーション
```

### 主要サービス

- **MCPService**: Tableau MCPサーバーとの通信とツール実行
- **BedrockService**: Anthropic Claude API呼び出し
- **DashboardService**: Chart.jsベースのダッシュボード/チャート生成

## 開発コマンド

### 環境構築

```bash
# 依存関係をインストール
uv sync

# 環境設定ファイルをコピー
cp .env.example app/.env
# .envファイルを編集してAWSおよびTableau設定を追加
```

### サーバー起動

```bash
# 開発サーバー起動 (ホットリロード有効)
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# プロダクション起動
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### テスト・開発

```bash
# MCP接続テスト
uv run python app/services/mcp_service.py

# 依存関係の更新
uv sync --upgrade
```

## 環境設定

`app/.env`ファイルで以下の設定が必要です：

### AWS Bedrock設定

```env
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SESSION_TOKEN=your_session_token
BEDROCK_MODEL_ID=apac.anthropic.claude-sonnet-4-20250514-v1:0
```

### Tableau MCP設定

```env
SERVER_SCRIPT_PATH=/path/to/tableau-mcp-server.py
SERVER=your-tableau-server.com
SITE_NAME=your-site
PAT_NAME=your_pat_name
PAT_VALUE=your_pat_value
```

### ログ設定

```env
LOG_LEVEL=INFO
USE_STRUCTURED_LOGGING=false
ENABLE_PERFORMANCE_LOGS=true
```

## API エンドポイント

### チャット
- `POST /api/chat` - AI チャット処理
- MCP接続時：Tableau データアクセス + Claude分析
- フォールバック：シンプルなClaude対話

### ダッシュボード生成
- `POST /api/create_report` - 分析結果からダッシュボード生成
- `POST /api/create_chart` - 分析結果からチャート生成

### 認証
- `POST /api/generate_jwt` - Tableau Connected App JWT生成

## ログシステム

構造化ログとパフォーマンス監視が実装されています：

- リクエストトラッキング（UUID）
- API呼び出し時間測定
- Token使用量監視
- エラー詳細記録

## 重要な特徴

- **グレースフルデグラデーション**: MCP接続失敗時もシンプルモードで動作
- **非同期アーキテクチャ**: 全てasync/awaitパターンで実装
- **ツール呼び出し対応**: Anthropicのツール呼び出しで反復的な会話ループ
- **日本語対応**: 日本語システムプロンプトでTableau分析ワークフロー最適化