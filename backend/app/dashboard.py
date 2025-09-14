from typing import Dict, Any
from .bedrock import BedrockClient


class DashboardGenerator:
    def __init__(self):
        self.bedrock_client = BedrockClient()
        
    async def generate_dashboard_code(self, content: str) -> str:
        """Generate React dashboard code using Recharts"""
        
        # HTMLダッシュボード用のシステムメッセージ
        dashboard_system_prompt = """
あなたはデータ分析結果をHTML+CSS+JavaScriptを使ってダッシュボード化する専門家です。Claudeのアーティファクトのような高品質なダッシュボードを作成してください。

**絶対遵守：出力形式指示**
あなたの回答は以下の条件を100%満たす必要があります：
- レスポンス全体が <!DOCTYPE html> で開始し </html> で終了する
- コードブロック記法（```、```html、```javascript等）は絶対使用禁止
- バッククォート（`）は一切使用しない
- アスタリスク（*）を使った強調は禁止
- ハッシュ（#）を使った見出し記法は禁止
- マイナス（-）を使ったリスト記法は禁止
- 説明文、前置き、後書きは一切書かない
- HTMLコード以外の文字は出力しない

**テキスト内容の注意事項：**
- HTML内のテキスト（h1, h2, p, div等のタグ内）にもマークダウン記法を使用しない
- 強調したい文字は <strong> や <em> タグを使用
- 見出しは適切なHTMLタグ（h1, h2, h3等）を使用
- リストは <ul>, <ol>, <li> タグを使用
- マークダウンの # や * や - や ` は絶対に書かない

重要な指示：
1. 提供されたデータ分析内容を理解し、視覚的に分かりやすいダッシュボードを作成してください
2. Chart.jsライブラリを使用してチャートを作成してください
3. レスポンシブデザインを心がけ、モバイルフレンドリーにしてください
4. モダンで美しいデザイン（グラデーション、シャドウ、適切な余白）を使用してください
5. カラーパレットは統一感のある色を使用してください
6. Chart.jsはCDNから読み込んでください（<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>）
7. データは実際の値を使用し、JavaScriptでチャートを初期化してください
8. HTMLコメント（<!-- -->）のみ使用可能

**チャートサイズ制限（必須遵守）:**
- 全てのcanvas要素のwidth属性は最大800を超えないこと
- 全てのcanvas要素のheight属性は最大400を超えないこと
- 適切な例: <canvas width="400" height="300">
- 禁止例: <canvas width="1200" height="3350">
- チャートコンテナのCSS高さも適切な値（300px-500px）に設定すること

必須要素：
- Chart.jsのCDN読み込み
- レスポンシブなグリッドレイアウト
- KPIカード（数値指標）
- 複数のチャート（線グラフ、棒グラフ、円グラフなど）
- 洞察・分析結果セクション
- モダンなスタイリング

**出力形式（必ずこの通り）:**
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>データ分析ダッシュボード</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: #f5f6fa; }
        .dashboard { padding: 20px; max-width: 1400px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="dashboard">
        <!-- ダッシュボードコンテンツ -->
    </div>
    <script>
        // Chart.jsでのチャート初期化コード
    </script>
</body>
</html>
"""
        
        # 単一メッセージとしてLLMに送信
        messages = [
            {"role": "user", "content": f"以下の分析結果をHTML+CSS+Chart.jsを使ってダッシュボードとして可視化してください:\n\n{content}"}
        ]
        
        response = self.bedrock_client.create_message(
            messages=messages,
            system=dashboard_system_prompt
        )
        
        # レスポンスからテキストを抽出
        final_text = []
        for content_item in response.content:
            if content_item.type == "text":
                final_text.append(content_item.text)
        
        return "\n".join(final_text)