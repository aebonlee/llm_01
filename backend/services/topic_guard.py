import os
import json
from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

class TopicGuardService:
    def __init__(self):
        self.model = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        self.allowed_topics = [
            "시장", "트렌드", "시장 동향", "산업 동향", "업계 동향", 
            "뉴스 요약", "시장/트렌드 요약", "비즈니스", "경제"
        ]
        
        self.market_keywords = [
            "시장", "트렌드", "동향", "업계", "산업", "리포트", 
            "전망", "요약", "핵심 포인트", "하이라이트", "메가트렌드", 
            "뉴스", "trend", "market", "insight", "outlook", "analysis"
        ]

    def check_topic(self, text: str) -> Dict[str, Any]:
        if self._is_market_trend_query(text):
            return {"on_topic": True, "why": "market_trend_keyword"}
        
        topic_guard_prompt = f"""\
다음 사용자 질문이 아래 '허용 주제'에 부합하는지 판단하고, 결과를 JSON으로만 출력하세요.
'시장/트렌드 요약' 관련이면 분야 제한 없이 모두 허용합니다.

[허용 주제]
{', '.join(self.allowed_topics)}

출력 JSON 스키마:
{{
  "on_topic": true|false,
  "why": "간단 사유",
  "gentle_redirect": "주제에 맞도록 부드럽게 되묻는 한 문장 (off-topic일 때만)"
}}
JSON만 출력하세요.
"""
        
        msgs = [
            SystemMessage(content=topic_guard_prompt),
            HumanMessage(content=text)
        ]
        
        out = self.model.invoke(msgs).content
        try:
            return json.loads(out)
        except:
            return {"on_topic": True, "why": "parse_fail_assume_true"}
    
    def _is_market_trend_query(self, text: str) -> bool:
        t = text.lower()
        return any(k in t for k in self.market_keywords)