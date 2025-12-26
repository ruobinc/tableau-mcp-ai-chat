#!/bin/bash
set -e

echo "========================================="
echo "Tableau MCP AI Chat - サーバー起動"
echo "========================================="

# 環境変数読み込み
source $HOME/.cargo/env
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# EC2のパブリックIPを取得
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

echo ""
echo "📍 アクセスURL:"
echo "   フロントエンド: http://$PUBLIC_IP:5173"
echo "   バックエンドAPI: http://$PUBLIC_IP:8000"
echo ""
echo "🔑 Bedrock設定:"
echo "   ブラウザでフロントエンドにアクセス後、"
echo "   右上のアカウントメニュー（👤）→「Bedrock設定」から"
echo "   AWS Bearer Tokenを入力してください"
echo ""
echo "========================================="
echo ""

# tmuxセッションがあれば削除
tmux kill-session -t tableau-app 2>/dev/null || true

# 新しいtmuxセッションを作成
tmux new-session -d -s tableau-app

# ウィンドウ1: バックエンド
tmux rename-window -t tableau-app:0 'backend'
tmux send-keys -t tableau-app:0 'cd /home/ec2-user/tableau-mcp-ai-chat/server' C-m
tmux send-keys -t tableau-app:0 'source $HOME/.cargo/env' C-m
tmux send-keys -t tableau-app:0 'uv run uvicorn app.main:app --host 0.0.0.0 --port 8000' C-m

# ウィンドウ2: フロントエンド
tmux new-window -t tableau-app:1 -n 'frontend'
tmux send-keys -t tableau-app:1 'cd /home/ec2-user/tableau-mcp-ai-chat/client' C-m
tmux send-keys -t tableau-app:1 'export NVM_DIR="$HOME/.nvm"' C-m
tmux send-keys -t tableau-app:1 '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' C-m
tmux send-keys -t tableau-app:1 'npm run dev -- --host 0.0.0.0' C-m

echo "✅ サーバーが起動しました！"
echo ""
echo "📌 tmuxセッション管理:"
echo "   セッションにアタッチ: tmux attach -t tableau-app"
echo "   ウィンドウ切り替え: Ctrl+B → 数字キー (0=backend, 1=frontend)"
echo "   デタッチ: Ctrl+B → D"
echo "   サーバー停止: bash /home/ec2-user/stop-servers.sh"
echo ""
echo "📊 ログ確認:"
echo "   tmux attach -t tableau-app"
echo "   で各ウィンドウのログを確認できます"
echo ""
