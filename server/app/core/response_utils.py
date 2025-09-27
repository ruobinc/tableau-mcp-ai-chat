from typing import List, Any


def extract_text_from_response(response_content: List[Any]) -> str:
    """Bedrockレスポンスからテキストを抽出する共通ユーティリティ"""
    final_text = []
    for content_item in response_content:
        if hasattr(content_item, 'type') and content_item.type == "text":
            final_text.append(content_item.text)
        elif hasattr(content_item, 'text'):  # 直接textプロパティがある場合
            final_text.append(content_item.text)

    return "\n".join(final_text)


def format_tool_execution_log(tool_name: str) -> str:
    """ツール実行ログの統一フォーマット"""
    return f"[ツール実行: {tool_name}]"


def create_error_message(operation: str) -> str:
    """エラーメッセージの統一フォーマット"""
    return f"申し訳ありません。{operation}中にエラーが発生しています。しばらく後にもう一度お試しください。"