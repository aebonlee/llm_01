# 개발 내역 문서

## 프로젝트 개요
**프로젝트명**: Market Trend Chatbot  
**개발 기간**: 2025년 1월  
**목적**: AI 기반 시장 트렌드 분석 및 인사이트 제공 챗봇 서비스

## 기술 스택

### Backend
- **Framework**: FastAPI (Python)
- **AI Model**: OpenAI GPT-4o-mini
- **Libraries**: 
  - LangChain (AI 오케스트레이션)
  - Pydantic (데이터 검증)
  - python-dotenv (환경 변수 관리)

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Markdown**: react-markdown

## 아키텍처 설계

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   React App     │────▶│   FastAPI       │────▶│   OpenAI API    │
│   (Frontend)    │     │   (Backend)     │     │   (GPT-4)       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        ▼                        ▼
   Netlify/Vercel          Render.com
```

## 주요 개발 내역

### 1단계: 프로젝트 구조 설계 (2025.08.20)
```
market-trend-chatbot/
├── backend/                 # FastAPI 백엔드
│   ├── main.py             # API 엔드포인트
│   ├── services/           # 비즈니스 로직
│   │   ├── chatbot.py      # 챗봇 핵심 서비스
│   │   ├── topic_guard.py  # 주제 검증
│   │   ├── extractor.py    # 질문 분석
│   │   └── memory.py       # 대화 기록
│   └── requirements.txt
└── frontend/               # React 프론트엔드
    ├── src/
    │   ├── components/     # UI 컴포넌트
    │   ├── services/       # API 서비스
    │   └── context/        # 상태 관리
    └── package.json
```

### 2단계: Backend 개발

#### 2.1 FastAPI 서버 구축
- **main.py**: REST API 엔드포인트 구현
  - `POST /api/chat`: 채팅 메시지 처리
  - `GET /api/health`: 서버 상태 확인
  - CORS 미들웨어 설정

#### 2.2 서비스 레이어 구현

**ChatbotService** (`services/chatbot.py`)
- GPT-4 모델과 통신
- 메시지 처리 및 응답 생성
- 대화 컨텍스트 관리
- 추천 질문 생성

**TopicGuardService** (`services/topic_guard.py`)
- 시장/트렌드 관련 주제 검증
- 키워드 기반 필터링
- 부적절한 질문 리다이렉션

**ExtractorService** (`services/extractor.py`)
- 사용자 질문 의도 분석
- 구조화된 정보 추출
- 도메인 및 시간 범위 파악

**ConversationMemory** (`services/memory.py`)
- 세션별 대화 기록 관리
- TTL 기반 자동 정리
- 최대 20개 메시지 유지

### 3단계: Frontend 개발

#### 3.1 컴포넌트 구조
```
components/
├── ChatContainer.jsx    # 메인 채팅 영역
├── Message.jsx         # 개별 메시지 표시
├── MessageList.jsx     # 메시지 목록
├── ChatInput.jsx       # 입력 필드
├── Sidebar.jsx         # 사이드바 메뉴
├── Header.jsx          # 헤더
├── SuggestionChips.jsx # 추천 질문 칩
└── LoadingIndicator.jsx # 로딩 표시
```

#### 3.2 주요 기능 구현

**실시간 채팅 인터페이스**
- 사용자/AI 메시지 구분 표시
- Markdown 렌더링 지원
- 자동 스크롤
- 타이핑 애니메이션

**추천 시스템**
- 컨텍스트 기반 추천 질문
- 클릭 가능한 칩 UI
- 초기 화면 가이드

**상태 관리**
- React Context API 활용
- 세션 ID 관리
- 메시지 히스토리 관리

### 4단계: 스타일링 및 UX

#### 4.1 디자인 시스템
- **색상 팔레트**: Primary (Blue scale)
- **타이포그래피**: System fonts
- **레이아웃**: Flexbox 기반 반응형
- **애니메이션**: Framer Motion

#### 4.2 반응형 디자인
- 모바일 우선 접근
- 브레이크포인트: sm(640px), md(768px), lg(1024px)
- 터치 친화적 인터페이스

### 5단계: 배포 설정 및 최종 수정

#### 5.1 Backend (Render.com) - 최종 배포
**최종 성공 설정**:
```yaml
services:
  - type: web
    name: llm-01
    env: python
    plan: free
    rootDir: backend
    buildCommand: "pip install --upgrade pip && pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: OPENAI_MODEL
        value: gpt-4o-mini
```

**최종 패키지 버전** (Python 3.13 호환):
```
fastapi==0.115.0
uvicorn[standard]==0.30.6
python-dotenv==1.0.1
langchain==0.2.16
langchain-openai==0.1.23
tiktoken==0.7.0
pydantic==2.9.1
python-multipart==0.0.9
aiofiles==24.1.0
```

**배포 URL**: https://llm-01.onrender.com

#### 5.2 Frontend (GitHub Pages) - 최종 배포
**GitHub Actions 워크플로우** (.github/workflows/deploy.yml):
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Build React app
        run: |
          cd frontend
          npm ci || npm install
          npm run build
        env:
          VITE_API_URL: https://llm-01.onrender.com
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          path: './frontend/dist'
```

**Vite 설정** (base path 중요):
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/llm_01/',  // GitHub Pages 경로
  // ...
})
```

**배포 URL**: https://aebonlee.github.io/llm_01/

## API 명세

### POST /api/chat
**Request:**
```json
{
  "message": "AI 시장 트렌드를 알려주세요",
  "session_id": "uuid-string"
}
```

**Response:**
```json
{
  "response": "AI 시장은 현재...",
  "session_id": "uuid-string",
  "on_topic": true,
  "suggestions": ["추천 질문 1", "추천 질문 2"]
}
```

## 보안 고려사항

1. **API 키 관리**
   - 환경 변수 사용
   - .env 파일 git 제외

2. **CORS 설정**
   - 프로덕션 환경 도메인 제한

3. **Rate Limiting**
   - 세션당 요청 제한 필요

4. **입력 검증**
   - 주제 검증 시스템
   - SQL Injection 방지

## 성능 최적화

1. **Frontend**
   - Code splitting
   - Lazy loading
   - Bundle 최적화

2. **Backend**
   - 비동기 처리
   - 캐싱 전략
   - 메모리 관리

## 향후 개선 사항

- [ ] 사용자 인증 시스템
- [ ] 대화 내보내기 기능
- [ ] 다국어 지원
- [ ] 실시간 웹소켓 통신
- [ ] 데이터베이스 연동
- [ ] 분석 대시보드
- [ ] A/B 테스팅
- [ ] 모니터링 시스템

## 트러블슈팅

### 문제 1: CORS 에러
**해결**: FastAPI CORS 미들웨어 설정

### 문제 2: Render.com 배포 실패 (Python 버전 충돌)
**문제**: Python 3.13과 Pydantic 2.5.0 비호환성
**해결**: 
- 최신 패키지 버전으로 업데이트 (Pydantic 2.9.1)
- runtime.txt 제거하여 Render 기본 Python 사용
- FastAPI 0.115.0, LangChain 0.2.16으로 업데이트

### 문제 3: GitHub Pages Jekyll vs React 충돌
**문제**: Jekyll이 React 앱 대신 문서 사이트 생성
**해결**: 
- Jekyll 설정 제거 (_config.yml, index.md 삭제)
- GitHub Actions 워크플로우 생성
- React 앱을 GitHub Pages로 직접 배포

### 문제 4: Render 서비스 rootDir 설정
**문제**: requirements.txt 파일을 찾을 수 없음
**해결**: render.yaml에 rootDir: backend 설정 추가

### 문제 5: 긴 응답 시간
**해결**: 스트리밍 응답 구현 검토

### 문제 6: 세션 관리
**해결**: 메모리 기반 → Redis 전환 검토

## 참고 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com)
- [React 공식 문서](https://react.dev)
- [LangChain 문서](https://python.langchain.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)