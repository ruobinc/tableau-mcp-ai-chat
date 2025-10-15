# Tableau MCP AI Chat

Tableau ダッシュボードと Anthropic Claude を組み合わせて、日本語でのデータ分析会話を行うためのサンプルアプリです。フロントエンドは React、バックエンドは FastAPI で構成されています。

## 主な機能
- **データ分析チャット**: AWS Bedrock の Claude 3 と会話しながら Tableau データを参照し、MCP 経由で利用可能なツールを自動的に呼び出します。MCP に接続できない場合はフォールバックのシンプルチャットで応答します。
- **ダッシュボード生成**: 生成した分析結果から Chart.js ベースのダッシュボードや単一チャートの HTML を自動生成するエンドポイントを提供します。
- **Tableau 認証サポート**: Tableau Connected App 用の JWT を即時発行する API を備え、埋め込みシナリオの検証に利用できます。

## 必要要件
- Node.js 18 以上
- Python 3.11 以上 + [uv](https://github.com/astral-sh/uv)
- AWS Bedrock と Tableau Server/Cloud へのアクセス

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

