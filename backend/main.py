from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

from services.chatbot import ChatbotService
from services.topic_guard import TopicGuardService
from services.extractor import ExtractorService

load_dotenv()

app = FastAPI(title="Market Trend Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chatbot_service = ChatbotService()
topic_guard = TopicGuardService()
extractor = ExtractorService()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    on_topic: bool
    suggestions: List[str] = []

@app.get("/")
async def root():
    return {"message": "Market Trend Chatbot API", "status": "running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        guard_result = topic_guard.check_topic(request.message)
        
        if not guard_result.get("on_topic", True):
            return ChatResponse(
                response=guard_result.get("gentle_redirect", "시장/트렌드 관련 질문을 해주세요."),
                session_id=request.session_id or "new",
                on_topic=False,
                suggestions=["AI 시장 트렌드는?", "2024년 친환경 산업 동향", "반도체 업계 전망"]
            )
        
        response, suggestions = await chatbot_service.process_message(
            request.message, 
            request.session_id
        )
        
        return ChatResponse(
            response=response,
            session_id=request.session_id or "new",
            on_topic=True,
            suggestions=suggestions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "api_key_set": bool(os.getenv("OPENAI_API_KEY"))}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)