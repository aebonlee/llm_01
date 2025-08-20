# 배포 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [Backend 배포 (Render.com)](#backend-배포-rendercom)
3. [Frontend 배포 (Netlify)](#frontend-배포-netlify)
4. [환경 변수 설정](#환경-변수-설정)
5. [도메인 설정](#도메인-설정)
6. [모니터링](#모니터링)

## 사전 준비

### 필요한 계정
- [GitHub](https://github.com) 계정
- [Render.com](https://render.com) 계정
- [Netlify](https://netlify.com) 계정
- [OpenAI](https://platform.openai.com) API 키

### 로컬 환경 테스트
```bash
# Backend 테스트
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend 테스트
cd frontend
npm install
npm run dev
```

## Backend 배포 (Render.com)

### 1. GitHub 리포지토리 생성

```bash
# 로컬에서
cd market-trend-chatbot
git remote add origin https://github.com/YOUR_USERNAME/market-trend-chatbot.git
git branch -M main
git push -u origin main
```

### 2. Render.com 설정

1. [Render Dashboard](https://dashboard.render.com) 접속
2. "New +" → "Web Service" 클릭
3. GitHub 리포지토리 연결

### 3. 서비스 설정

**Basic Settings:**
- **Name**: `market-trend-chatbot-api`
- **Region**: `Singapore (Southeast Asia)`
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

### 4. 환경 변수 설정

Render Dashboard → Environment → Add Environment Variable

```
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4o-mini
PYTHON_VERSION=3.11
```

### 5. 배포 확인

배포 완료 후 제공된 URL로 접속:
```
https://market-trend-chatbot-api.onrender.com/api/health
```

## Frontend 배포 (Netlify)

### 1. 빌드 준비

```bash
cd frontend
npm install
npm run build
```

### 2. Netlify CLI 배포 (옵션 1)

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod --dir=dist
```

### 3. Netlify 웹 인터페이스 배포 (옵션 2)

1. [Netlify](https://app.netlify.com) 접속
2. "Add new site" → "Import an existing project"
3. GitHub 리포지토리 연결
4. 배포 설정:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 4. 환경 변수 설정

Site settings → Environment variables:
```
VITE_API_URL=https://llm-01.onrender.com
```

### 5. 리다이렉트 설정

`frontend/netlify.toml` 파일 확인:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://llm-01.onrender.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 환경 변수 설정

### Backend (.env)
```env
# OpenAI
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Server
PORT=8000
ENVIRONMENT=production
```

### Frontend (.env)
```env
# API
VITE_API_URL=https://llm-01.onrender.com

# Features
VITE_ENABLE_ANALYTICS=true
```

## 도메인 설정

### Custom Domain (Netlify)

1. Domain settings → Add custom domain
2. DNS 설정:
   ```
   Type: CNAME
   Name: chat
   Value: your-site.netlify.app
   ```

### SSL 인증서

- Netlify: 자동 Let's Encrypt SSL
- Render: 자동 SSL 인증서

## 모니터링

### 1. 로그 확인

**Render Logs:**
```bash
# Render Dashboard → Logs
# 또는 Render CLI
render logs --service market-trend-chatbot-api
```

**Netlify Functions Log:**
```bash
netlify functions:log
```

### 2. 성능 모니터링

**추천 도구:**
- [Sentry](https://sentry.io) - 에러 추적
- [LogRocket](https://logrocket.com) - 세션 리플레이
- [Google Analytics](https://analytics.google.com) - 사용자 분석

### 3. 상태 확인 스크립트

```bash
#!/bin/bash
# health-check.sh

BACKEND_URL="https://llm-01.onrender.com"
FRONTEND_URL="https://your-app.netlify.app"

echo "Checking Backend..."
curl -s "$BACKEND_URL/api/health" | jq .

echo -e "\nChecking Frontend..."
curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL"
```

## 업데이트 배포

### GitHub Actions 자동 배포

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 롤백 절차

### Render 롤백
1. Dashboard → Deploys
2. 이전 배포 선택
3. "Rollback to this deploy" 클릭

### Netlify 롤백
1. Deploys 탭
2. 이전 배포 선택
3. "Publish deploy" 클릭

## 스케일링

### Render.com 스케일링
- **Free Tier**: 512MB RAM, 0.1 CPU
- **Starter**: $7/month, 512MB RAM, 0.5 CPU
- **Standard**: $25/month, 2GB RAM, 1 CPU
- **Pro**: Custom resources

### 최적화 팁
1. **캐싱 활용**
   - Redis 도입
   - CDN 활용

2. **데이터베이스**
   - PostgreSQL 도입 (대화 기록)
   - 인덱싱 최적화

3. **비동기 처리**
   - 백그라운드 작업
   - 큐 시스템

## 트러블슈팅

### 일반적인 문제

**1. CORS 에러**
```python
# main.py에서 CORS 설정 확인
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**2. 환경 변수 누락**
- Render: Environment 탭 확인
- Netlify: Site settings → Environment variables

**3. 빌드 실패**
```bash
# Python 버전 명시
# render.yaml
envVars:
  - key: PYTHON_VERSION
    value: 3.11
```

**4. 콜드 스타트**
- Render Free tier는 15분 비활성 후 슬립
- 해결: Paid plan 업그레이드 또는 health check cron job

## 보안 체크리스트

- [ ] API 키 환경 변수 설정
- [ ] HTTPS 강제 적용
- [ ] CORS 프로덕션 도메인만 허용
- [ ] Rate limiting 구현
- [ ] 입력 검증 강화
- [ ] 에러 메시지 정보 최소화
- [ ] 보안 헤더 설정

## 비용 최적화

### 무료 플랜 활용
- **Render**: 750시간/월 무료
- **Netlify**: 100GB 대역폭/월 무료
- **OpenAI**: Pay-as-you-go

### 예상 비용 (월)
- Small (< 1000 users): $0-10
- Medium (< 10000 users): $25-50  
- Large (> 10000 users): $100+

## 지원 및 문의

- Render Support: support@render.com
- Netlify Support: https://www.netlify.com/support/
- GitHub Issues: https://github.com/YOUR_USERNAME/market-trend-chatbot/issues