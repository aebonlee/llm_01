import os
import json
from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

class ExtractorService:
    def __init__(self):
        self.model = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        self.extract_prompt = """\
당신은 질의 의도를 분석해 구조화 정보로 뽑아냅니다.
JSON만 출력하세요. 한국어 사용.

스키마:
{
  "main_question": "핵심 질문 한 문장",
  "subquestions": ["하위 질문 2~5개"],
  "constraints": ["필요 제약(있으면)", "..."],
  "target_tone": "친절/간결/기술적 등의 어투 제안",
  "expected_format": "글머리표/단계/코드/표 중 적합한 형태",
  "domain": "관련 도메인 (IT/금융/제조/헬스케어 등)",
  "time_range": "시간 범위 (있으면)"
}
사용자 메시지:
"""

    def extract(self, user_text: str) -> Dict[str, Any]:
        msgs = [
            SystemMessage(content="JSON만 출력하세요."),
            HumanMessage(content=self.extract_prompt + user_text)
        ]
        
        raw = self.model.invoke(msgs).content
        try:
            return json.loads(raw)
        except:
            return {
                "main_question": user_text.strip(),
                "subquestions": [],
                "constraints": [],
                "target_tone": "친절하고 전문적으로",
                "expected_format": "글머리표",
                "domain": "general",
                "time_range": None
            }