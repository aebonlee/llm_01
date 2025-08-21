# 개발 내역 (Development Log)

## 2025-08-21: Render.com 배포 오류 해결

### 문제 상황
Render.com에서 백엔드 배포 시 `tiktoken` 패키지 빌드 실패 오류 발생

#### 에러 내용
```
ERROR: Failed building wheel for tiktoken
error: failed to create directory `/usr/local/cargo/registry/cache/index.crates.io-1949cf8c6b5b557f`
Caused by: Read-only file system (os error 30)
```

### 원인 분석
1. `tiktoken==0.7.0`은 Rust 기반 패키지로 컴파일 과정이 필요
2. Render.com의 빌드 환경에서 `/usr/local/cargo/` 디렉토리가 읽기 전용으로 설정됨
3. Rust 패키지 컴파일 시 캐시 디렉토리 생성 실패

### 해결 방법

#### 1. tiktoken 버전 다운그레이드
- **변경 전**: `tiktoken==0.7.0`
- **변경 후**: `tiktoken==0.5.2`
- **이유**: 0.5.2 버전은 pre-compiled wheel 제공으로 컴파일 불필요

#### 2. 빌드 스크립트 생성
**파일**: `backend/render-build.sh`
```bash
#!/usr/bin/env bash
# Exit on error
set -o errexit

# Upgrade pip and setuptools
pip install --upgrade pip setuptools wheel

# Install requirements
pip install -r requirements.txt
```

#### 3. render.yaml 수정
- **변경 전**: 
  ```yaml
  buildCommand: "pip install --upgrade pip && pip install -r requirements.txt"
  ```
- **변경 후**: 
  ```yaml
  buildCommand: "chmod +x render-build.sh && ./render-build.sh"
  ```

#### 4. 의존성 최적화
- `numpy==1.26.4` 명시적 추가 (tiktoken의 의존성)

### 변경된 파일
1. `backend/requirements.txt` - tiktoken 버전 변경 및 numpy 추가
2. `backend/render-build.sh` - 새로운 빌드 스크립트 생성
3. `render.yaml` - 빌드 명령어 수정

### 테스트 및 검증
- 로컬 환경에서 의존성 설치 테스트 완료
- Render.com 재배포 시 정상 작동 확인 필요

### 참고 사항
- Python 3.13 환경에서 테스트됨
- 향후 tiktoken 업데이트 시 pre-compiled wheel 지원 여부 확인 필요
- Render.com free tier 사용 중