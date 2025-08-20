# API 문서

## Base URL
```
Production: https://llm-01.onrender.com
Development: http://localhost:8000
```

## 인증
현재 버전은 공개 API로 인증이 필요하지 않습니다.

## 엔드포인트

### 1. 채팅 메시지 전송

**Endpoint:** `POST /api/chat`

**Description:** 사용자 메시지를 처리하고 AI 응답을 반환합니다.

**Request Body:**
```json
{
  "message": "string",       // 필수: 사용자 질문
  "session_id": "string"      // 선택: 세션 ID (대화 연속성)
}
```

**Response:**
```json
{
  "response": "string",       // AI 응답 메시지
  "session_id": "string",     // 세션 ID
  "on_topic": boolean,        // 주제 적합성 여부
  "suggestions": ["string"]   // 추천 질문 목록
}
```

**Status Codes:**
- `200 OK`: 성공
- `422 Unprocessable Entity`: 잘못된 요청 형식
- `500 Internal Server Error`: 서버 오류

**Example Request:**
```bash
curl -X POST "https://llm-01.onrender.com/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "AI 시장의 최신 트렌드는 무엇인가요?",
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Example Response:**
```json
{
  "response": "2024년 AI 시장의 주요 트렌드는 다음과 같습니다:\n\n1. **생성형 AI의 대중화**\n- ChatGPT와 같은 LLM 기반 서비스 확산\n- 이미지, 음성, 비디오 생성 AI 발전\n\n2. **엔터프라이즈 AI 도입 가속화**\n- 기업용 AI 솔루션 수요 증가\n- 업무 자동화 및 효율성 향상\n\n3. **AI 규제 및 윤리**\n- EU AI Act 등 규제 프레임워크 확립\n- 책임감 있는 AI 개발 강조",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "on_topic": true,
  "suggestions": [
    "생성형 AI 시장 규모는?",
    "주요 AI 기업들의 전략은?",
    "AI 규제가 시장에 미치는 영향은?"
  ]
}
```

### 2. 서버 상태 확인

**Endpoint:** `GET /api/health`

**Description:** 서버 상태 및 설정을 확인합니다.

**Response:**
```json
{
  "status": "healthy",
  "api_key_set": boolean      // OpenAI API 키 설정 여부
}
```

**Status Codes:**
- `200 OK`: 서버 정상

**Example Request:**
```bash
curl "https://llm-01.onrender.com/api/health"
```

**Example Response:**
```json
{
  "status": "healthy",
  "api_key_set": true
}
```

### 3. 루트 엔드포인트

**Endpoint:** `GET /`

**Description:** API 정보를 반환합니다.

**Response:**
```json
{
  "message": "Market Trend Chatbot API",
  "status": "running"
}
```

## 에러 처리

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "detail": "에러 메시지"
}
```

### 일반적인 에러 코드

| 코드 | 설명 |
|------|------|
| 400 | 잘못된 요청 |
| 422 | 검증 실패 |
| 500 | 서버 내부 오류 |
| 503 | 서비스 이용 불가 |

## Rate Limiting

현재 Rate Limiting은 적용되지 않았지만, 향후 다음과 같이 적용될 예정입니다:
- 분당 60회 요청
- 시간당 1000회 요청

## 세션 관리

### 세션 ID
- UUID v4 형식 사용
- 클라이언트에서 생성 및 관리
- 24시간 동안 유지

### 대화 기록
- 세션당 최대 20개 메시지 저장
- 24시간 후 자동 삭제
- 메모리 기반 저장 (재시작시 초기화)

## WebSocket (계획중)

향후 실시간 스트리밍을 위한 WebSocket 엔드포인트가 추가될 예정입니다:

```
ws://llm-01.onrender.com/ws/chat/{session_id}
```

## SDK 예제

### JavaScript/TypeScript
```javascript
import axios from 'axios';

const API_BASE = 'https://llm-01.onrender.com';

class MarketTrendAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async sendMessage(message, sessionId = null) {
    const response = await this.client.post('/api/chat', {
      message,
      session_id: sessionId
    });
    return response.data;
  }

  async checkHealth() {
    const response = await this.client.get('/api/health');
    return response.data;
  }
}

// 사용 예제
const api = new MarketTrendAPI();
const result = await api.sendMessage('AI 시장 트렌드를 알려주세요');
console.log(result.response);
```

### Python
```python
import requests
from typing import Optional, Dict, Any

class MarketTrendAPI:
    def __init__(self, base_url: str = "https://llm-01.onrender.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json"
        })
    
    def send_message(
        self, 
        message: str, 
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        response = self.session.post(
            f"{self.base_url}/api/chat",
            json={
                "message": message,
                "session_id": session_id
            }
        )
        response.raise_for_status()
        return response.json()
    
    def check_health(self) -> Dict[str, Any]:
        response = self.session.get(f"{self.base_url}/api/health")
        response.raise_for_status()
        return response.json()

# 사용 예제
api = MarketTrendAPI()
result = api.send_message("AI 시장 트렌드를 알려주세요")
print(result["response"])
```

## 테스트

### cURL 테스트 스크립트
```bash
#!/bin/bash

API_URL="https://llm-01.onrender.com"

# 헬스 체크
echo "=== Health Check ==="
curl -s "$API_URL/api/health" | jq .

# 채팅 테스트
echo -e "\n=== Chat Test ==="
curl -s -X POST "$API_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "테스트 메시지"}' | jq .
```

## 변경 로그

### v1.0.0 (2025-01-XX)
- 초기 릴리즈
- 기본 채팅 기능
- 주제 검증 시스템
- 세션 관리