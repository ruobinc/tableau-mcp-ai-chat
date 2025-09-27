import logging
import sys
from typing import Optional
from functools import lru_cache
import json
from datetime import datetime


class StructuredFormatter(logging.Formatter):
    """構造化ログフォーマッター"""

    def format(self, record):
        log_obj = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # 追加のコンテキスト情報があれば追加
        if hasattr(record, 'request_id'):
            log_obj["request_id"] = record.request_id
        if hasattr(record, 'user_id'):
            log_obj["user_id"] = record.user_id
        if hasattr(record, 'operation'):
            log_obj["operation"] = record.operation
        if hasattr(record, 'duration'):
            log_obj["duration"] = record.duration

        # 例外情報があれば追加
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj, ensure_ascii=False)


class SimpleFormatter(logging.Formatter):
    """シンプルなログフォーマッター（開発用）"""

    def format(self, record):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return f"{timestamp} | {record.levelname:8} | {record.name:20} | {record.getMessage()}"


@lru_cache()
def setup_logging(
    level: str = "INFO",
    use_structured: bool = False,
    logger_name: Optional[str] = None
) -> logging.Logger:
    """ロガーを設定する"""

    # ログレベルの設定
    log_level = getattr(logging, level.upper(), logging.INFO)

    # ロガーの取得
    logger = logging.getLogger(logger_name or "tableau_ai_chat")

    # 既にハンドラーが設定されている場合はスキップ
    if logger.handlers:
        return logger

    logger.setLevel(log_level)

    # ハンドラーの作成
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)

    # フォーマッターの設定
    if use_structured:
        formatter = StructuredFormatter()
    else:
        formatter = SimpleFormatter()

    handler.setFormatter(formatter)
    logger.addHandler(handler)

    # 親ロガーへの伝播を防ぐ（重複ログを避ける）
    logger.propagate = False

    return logger


def get_logger(name: str) -> logging.Logger:
    """特定の名前でロガーを取得"""
    return logging.getLogger(f"tableau_ai_chat.{name}")


# 各モジュール用のロガー
def get_mcp_logger() -> logging.Logger:
    return get_logger("mcp")


def get_bedrock_logger() -> logging.Logger:
    return get_logger("bedrock")


def get_dashboard_logger() -> logging.Logger:
    return get_logger("dashboard")


def get_auth_logger() -> logging.Logger:
    return get_logger("auth")


def get_api_logger() -> logging.Logger:
    return get_logger("api")


# ログ用のコンテキスト管理
class LogContext:
    """ログコンテキストを管理するヘルパークラス"""

    @staticmethod
    def add_request_context(logger: logging.Logger, request_id: str, operation: str):
        """リクエストコンテキストを追加"""
        def log_with_context(level, msg, *args, **kwargs):
            extra = kwargs.get('extra', {})
            extra.update({
                'request_id': request_id,
                'operation': operation
            })
            kwargs['extra'] = extra
            return getattr(logger, level)(msg, *args, **kwargs)

        return log_with_context

    @staticmethod
    def add_performance_context(logger: logging.Logger, duration: float):
        """パフォーマンスコンテキストを追加"""
        def log_with_context(level, msg, *args, **kwargs):
            extra = kwargs.get('extra', {})
            extra['duration'] = duration
            kwargs['extra'] = extra
            return getattr(logger, level)(msg, *args, **kwargs)

        return log_with_context