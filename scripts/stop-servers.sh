#!/bin/bash

echo "サーバーを停止中..."
tmux kill-session -t tableau-app 2>/dev/null || echo "サーバーは既に停止しています"
echo "✅ サーバーが停止しました"
