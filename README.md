# Tableau MCP AI Chat

Tableau ダッシュボードと Anthropic Claude を組み合わせて、日本語でのデータ分析会話を行うためのサンプルアプリです。フロントエンドは React、バックエンドは FastAPI で構成されています。
Tableau MCPとAnthropic Claudeモデルを使って、会話型データ分析エージェントのアプリです。

## 主な機能
- **データ分析チャット**: Tableauのデータソースやビューに対して、会話形式のデータ分析
- **ダッシュボード生成**: 生成した分析結果から Chart.js ベースのレポート作成とチャート作成
- **ダッシュボードとPulse**: Tableau ダッシュボードとPulseを埋め込んでいます

## 必要要件
- Node.js 18 以上
- Python 3.13 以上 + [uv](https://github.com/astral-sh/uv)
- AWS Bedrock Claude-4以降モデルと Tableau Server/Cloud へのアクセス

## セットアップ
1. リポジトリを取得:
   ```bash
   git clone https://github.com/your-repo/tableau-mcp-ai-chat.git
   cd tableau-mcp-ai-chat
   ```
2. バックエンド:
   ```bash
   cd server
   uv sync
   cp .env.example app/.env  # 資格情報を設定
   uv run uvicorn app.main:app --reload
   ```
3. フロントエンド:
   ```bash
   cd client
   npm install
   npm run dev
   ```

フロントエンドは http://localhost:5173、API は http://localhost:8000 で動作します。

## 主なディレクトリ
- `client/` – React + TypeScript フロントエンド
- `server/` – FastAPI バックエンド

## ライセンス
MIT License

