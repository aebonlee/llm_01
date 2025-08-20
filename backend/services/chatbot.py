import os
import json
from typing import List, Dict, Any, Tuple
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from .extractor import ExtractorService
from .memory import ConversationMemory

class ChatbotService:
    def __init__(self):
        self.model = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0.2,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.extractor = ExtractorService()
        self.memory = ConversationMemory()
        
        self.persona_prompt = """\
당신은 공손하고 친절한 한국어 시장 분석 전문가입니다.
1. 응답은 간결하되, 핵심은 놓치지 마세요.
2. 사용자가 혼란스러워하면 예시와 단계로 안내하세요.
3. 과도한 수식/미사여구 금지.
4. 모호하면 스스로 가정 후 명시하고 답하세요.
5. 시장 트렌드와 데이터 기반 인사이트를 제공하세요.
"""

    async def process_message(self, message: str, session_id: str = None) -> Tuple[str, List[str]]:
        history = self.memory.get_history(session_id) if session_id else []
        
        extracted = self.extractor.extract(message)
        aggregated = self._aggregate(history, extracted)
        
        response = self._generate_response(aggregated, extracted)
        
        if session_id:
            self.memory.add_message(session_id, "user", message)
            self.memory.add_message(session_id, "assistant", response)
        
        suggestions = aggregated.get("suggested_followups", [])
        return response, suggestions

    def _aggregate(self, history: List[Dict], extracted: Dict[str, Any]) -> Dict[str, Any]:
        aggregate_prompt = """\
아래 구조화 결과와 대화 히스토리를 종합해, 답변에 포함해야 하는 '핵심 포인트 리스트'를 JSON으로 만드세요.
JSON만 출력하세요. 한국어 사용.

스키마:
{
  "key_points": ["핵심 포인트", "..."],
  "missing_info": ["부족한 정보(있으면)", "..."],
  "suggested_followups": ["적절한 후속 질문 1~3개"]
}
"""
        
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-8:]])
        
        msgs = [
            SystemMessage(content="JSON만 출력하세요."),
            HumanMessage(content=aggregate_prompt + json.dumps({
                "history_tail": history_text,
                "extracted": extracted
            }, ensure_ascii=False))
        ]
        
        raw = self.model.invoke(msgs).content
        try:
            return json.loads(raw)
        except:
            return {
                "key_points": [extracted.get("main_question", "")],
                "missing_info": [],
                "suggested_followups": []
            }

    def _generate_response(self, aggregated: Dict[str, Any], extracted: Dict[str, Any]) -> str:
        tone = extracted.get("target_tone", "친절하고 전문적으로")
        fmt = extracted.get("expected_format", "글머리표")
        points = "\n- " + "\n- ".join(aggregated.get("key_points", [])) if aggregated.get("key_points") else "- (없음)"
        
        summarize_prompt = f"""\
다음 요구를 만족하는 시장 분석 답변을 작성하세요:

- 톤: {tone}
- 형식: {fmt}
- 길이: 핵심 위주로 간결하되, 빠진 맥락 없게
- 데이터와 수치가 있다면 포함
- 시장 동향과 인사이트 중심

[반드시 반영할 핵심 포인트]
{points}

이제 최종 답변을 한국어로 작성하세요.
"""
        
        msgs = [
            SystemMessage(content=self.persona_prompt),
            HumanMessage(content=summarize_prompt)
        ]
        
        return self.model.invoke(msgs).content