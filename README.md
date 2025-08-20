# llm_01
llm_01 숭실대학교 비전공자 1팀 - 김중서, 임정민, 김유완, 박혜영, 최웅, 김지수, 황현일

# Market Trend Chatbot

AI 기반 시장 트렌드 분석 챗봇 서비스

## 프로젝트 구조

```
market-trend-chatbot/
├── backend/          # FastAPI 백엔드 서버
│   ├── main.py      # 메인 API 엔드포인트
│   ├── services/    # 비즈니스 로직
│   │   ├── chatbot.py       # 챗봇 서비스
│   │   ├── topic_guard.py   # 주제 검증
│   │   ├── extractor.py     # 질문 분석
│   │   └── memory.py        # 대화 기록 관리
│   └── requirements.txt
│
└── frontend/         # React 프론트엔드
    ├── src/
    │   ├── components/       # UI 컴포넌트
    │   ├── services/        # API 통신
    │   └── context/         # 상태 관리
    └── package.json
```

## 백엔드 설정 (Render.com)

1. `.env` 파일 생성:
```bash
cd backend
cp .env.example .env
# OPENAI_API_KEY 설정
```

2. Render.com에 배포:
- GitHub 리포지토리 연결
- Web Service 생성
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 프론트엔드 설정

1. 의존성 설치:
```bash
cd frontend
npm install
```

2. 환경 변수 설정:
```bash
cp .env.example .env
# VITE_API_URL=https://llm-01.onrender.com
```

3. 개발 서버 실행:
```bash
npm run dev
```

## 배포

### Backend (Render)
- 자동 배포 설정됨
- 환경 변수: OPENAI_API_KEY 필수

### Frontend (Netlify/Vercel)
- `npm run build` 후 `dist` 폴더 배포
- 환경 변수: VITE_API_URL 설정

## 주요 기능

- ✅ 시장 트렌드 분석
- ✅ 실시간 대화형 인터페이스
- ✅ 세션 기반 대화 기록
- ✅ 추천 질문 제공
- ✅ 주제 검증 시스템
- ✅ 반응형 디자인
