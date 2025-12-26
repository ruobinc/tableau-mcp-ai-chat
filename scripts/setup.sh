#!/bin/bash
set -e

echo "========================================="
echo "Tableau MCP AI Chat - EC2セットアップ"
echo "========================================="

# 1. システムパッケージ更新
echo "[1/8] システムパッケージを更新中..."
sudo dnf update -y

# 2. 必要なソフトウェアのインストール
echo "[2/8] Git, Python 3.13, tmuxをインストール中..."
sudo dnf install git python3.13 python3.13-pip tmux -y

# 3. uv インストール
echo "[3/8] uvパッケージマネージャーをインストール中..."
if ! command -v uv &> /dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
    echo 'source $HOME/.cargo/env' >> ~/.bashrc
fi

# 4. Node.js 22 インストール
echo "[4/8] Node.js 22をインストール中..."
if ! command -v nvm &> /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 22
    nvm use 22
    nvm alias default 22
fi

# 5. プロジェクトクローン
echo "[5/8] プロジェクトをクローン中..."
cd /home/ec2-user
if [ ! -d "tableau-mcp-ai-chat" ]; then
    # read -p "GitHubリポジトリのURLを入力してください: " REPO_URL
    git clone https://github.com/ruobinc/tableau-mcp-ai-chat.git tableau-mcp-ai-chat
else
    echo "プロジェクトは既に存在します。スキップします。"
fi

# 6. Tableau MCP サーバーのインストール
echo "[6/8] Tableau MCP サーバーをインストール中..."
cd /home/ec2-user
if [ ! -d "tableau-mcp" ]; then
    git clone https://github.com/tableau/tableau-mcp.git tableau-mcp
    cd tableau-mcp
    npm install
    npm run build
else
    echo "Tableau MCPは既に存在します。スキップします。"
fi

# 7. バックエンドセットアップ
echo "[7/8] バックエンドをセットアップ中..."
cd /home/ec2-user/tableau-mcp-ai-chat/server
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  server/.env ファイルを編集してTableau設定を入力してください"
fi
source $HOME/.cargo/env
uv sync

# 8. フロントエンドセットアップ
echo "[8/8] フロントエンドをセットアップ中..."
cd /home/ec2-user/tableau-mcp-ai-chat/client
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    # EC2のパブリックIPを取得
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")
    # .env.localのAPI URLを自動設定
    sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=http://$PUBLIC_IP:8000|g" .env.local
    echo "⚠️  client/.env.local ファイルを編集してTableau設定を入力してください"
fi

# nvmを読み込み
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22

npm install

echo ""
echo "========================================="
echo "✅ セットアップ完了！"
echo "========================================="
echo ""
echo "次のステップ:"
echo "1. server/.env を編集してTableau設定を入力"
echo "   nano /home/ec2-user/tableau-mcp-ai-chat/server/.env"
echo ""
echo "2. client/.env.local を編集してTableau設定を入力"
echo "   nano /home/ec2-user/tableau-mcp-ai-chat/client/.env.local"
echo ""
echo "3. サーバーを起動:"
echo "   bash /home/ec2-user/start-servers.sh"
echo ""
