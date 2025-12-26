# Tableau MCP AI Chat
Tableau MCPとAnthropic Claudeモデルを使って、会話型データ分析エージェントのアプリです。

## 主な機能
- **会話型データ分析エージェント**: [Tableau MCP](https://github.com/tableau/tableau-mcp)を活用し、Tableauのデータソースやビューに対して、会話形式のデータ分析
- **ダッシュボード生成**: 生成した分析結果から Chart.js ベースのレポート作成とチャート作成
- **Tableau Embedded Analytics**: Tableau ダッシュボードとPulseをアプリ内に埋め込む

## 必要要件
- Node.js 22 以上
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
   cp .env.example .env
   uv run uvicorn app.main:app --reload
   ```
3. フロントエンド:
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. Tableau MCPのセットアップ:
   ```bash
   git clone https://github.com/tableau/tableau-mcp.git tableau-mcp
   cd tableau-mcp
   npm install
   npm run build
   ```
5. 初回起動時の設定:
   - ブラウザで http://localhost:5173 にアクセス
   - ページ右上のメニューから「Bedrock設定」を選択
   - AWS Bedrock認証情報を入力・保存

## 主なディレクトリ
- `client/` – React + TypeScript フロントエンド
- `server/` – FastAPI バックエンド