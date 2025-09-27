import time
from .bedrock_service import BedrockService
from ..config.prompts import get_dashboard_system_prompt, CHART_SYSTEM_PROMPT
from ..core.response_utils import extract_text_from_response
from ..core.logging import get_dashboard_logger


class DashboardService:
    def __init__(self, bedrock_service: BedrockService):
        self.bedrock_service = bedrock_service
        self.logger = get_dashboard_logger()

    async def generate_dashboard_code(self, content: str) -> str:
        """Generate dashboard HTML code using Chart.js"""
        start_time = time.time()
        content_length = len(content)

        self.logger.info(
            "Generating dashboard code",
            extra={"content_length": content_length}
        )

        messages = [
            {"role": "user", "content": f"以下の分析結果をHTML+CSS+Chart.jsを使ってダッシュボードとして可視化してください:\n\n{content}"}
        ]

        try:
            response = self.bedrock_service.create_message(
                messages=messages,
                system=get_dashboard_system_prompt()
            )

            result = extract_text_from_response(response.content)
            duration = time.time() - start_time

            self.logger.info(
                "Dashboard code generated successfully",
                extra={
                    "duration": duration,
                    "output_length": len(result),
                    "is_html": result.strip().startswith("<!DOCTYPE html>")
                }
            )

            return result
        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(
                "Dashboard code generation failed",
                extra={"error": str(e), "duration": duration}
            )
            raise

    async def generate_chart_code(self, content: str) -> str:
        """Generate single chart HTML code using Chart.js"""
        start_time = time.time()
        content_length = len(content)

        self.logger.info(
            "Generating chart code",
            extra={"content_length": content_length}
        )

        messages = [
            {"role": "user", "content": f"以下の分析結果から最適なチャートを1つ作成してください:\n\n{content}"}
        ]

        try:
            response = self.bedrock_service.create_message(
                messages=messages,
                system=CHART_SYSTEM_PROMPT
            )

            result = extract_text_from_response(response.content)
            duration = time.time() - start_time

            self.logger.info(
                "Chart code generated successfully",
                extra={
                    "duration": duration,
                    "output_length": len(result),
                    "is_html": result.strip().startswith("<!DOCTYPE html>")
                }
            )

            return result
        except Exception as e:
            duration = time.time() - start_time
            self.logger.error(
                "Chart code generation failed",
                extra={"error": str(e), "duration": duration}
            )
            raise