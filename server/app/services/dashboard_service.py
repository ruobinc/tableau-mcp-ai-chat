from .bedrock_service import BedrockService
from ..config.prompts import get_dashboard_system_prompt, CHART_SYSTEM_PROMPT
from ..core.response_utils import extract_text_from_response


class DashboardService:
    def __init__(self, bedrock_service: BedrockService):
        self.bedrock_service = bedrock_service

    async def generate_dashboard_code(self, content: str) -> str:
        """Generate dashboard HTML code using Chart.js"""
        messages = [
            {"role": "user", "content": f"以下の分析結果をHTML+CSS+Chart.jsを使ってダッシュボードとして可視化してください:\n\n{content}"}
        ]

        response = self.bedrock_service.create_message(
            messages=messages,
            system=get_dashboard_system_prompt()
        )

        return extract_text_from_response(response.content)

    async def generate_chart_code(self, content: str) -> str:
        """Generate single chart HTML code using Chart.js"""
        messages = [
            {"role": "user", "content": f"以下の分析結果から最適なチャートを1つ作成してください:\n\n{content}"}
        ]

        response = self.bedrock_service.create_message(
            messages=messages,
            system=CHART_SYSTEM_PROMPT
        )

        return extract_text_from_response(response.content)