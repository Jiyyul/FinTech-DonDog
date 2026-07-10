# DonDog — 동아리/학생회 회계 대시보드

Next.js 기반 동아리/학생회 회계 관리 대시보드입니다. 결제 내역을 Supabase(Postgres)에 저장하고
OpenAI API로 자동 분류하며, 영수증 업로드 OCR 인식·매칭과 규칙 기반 이상거래 탐지 기능을 제공합니다.

> 4인 팀 프로젝트입니다. 이 레포는 완성된 최종 코드 기준으로 개인 포트폴리오용으로 정리한 것이며,
> 아래 "담당 부분"은 본인이 직접 작업한 범위입니다.

## 담당 부분

### 영수증 OCR 업로드 & 거래 매칭
- `/receipts` 페이지: 영수증 이미지를 업로드하면 tesseract.js OCR로 텍스트를 인식해 가맹점명·금액을
  파싱하고, 기존 거래내역과 자동 매칭하거나 매칭되는 거래가 없으면 신규 거래로 등록
- 업로드 시 "증빙용" / "거래추가용" 용도를 명시적으로 선택하도록 UX 개선
- 영수증 리스트에서 연결된 거래를 바로 수정할 수 있도록 개선, OCR 가맹점명 추출 정확도 개선
- Supabase 스키마 설계 및 영수증-거래 연동 파이프라인 구축

### 캘린더 ↔ 거래 연동
- 캘린더에서 날짜 클릭 시 해당 일자의 실거래 내역을 바로 확인할 수 있도록 연동
- 감사(`/audit`) 페이지 이상거래 목록에 페이지네이션 적용

### 브랜치 통합 & 버그 수정 (팀 병합 리드)
- `feature/frontend-landing`, `feature/dashboard-final`, `branch_openai`(OpenAI 챗봇/분류),
  `supabase` 등 팀원별 기능 브랜치를 순차적으로 병합하며 충돌 해결
- 병합 과정에서 발견한 버그 수정
  - Next.js App Router 공유 레이아웃에 걸려있던 `force-dynamic` 옵션이 페이지 간 클라이언트 사이드
    이동을 막던 문제 해결 (레이아웃에서 제거 후 필요한 개별 페이지로 이동)
  - 대시보드 진입마다 쓰이지 않는 영수증 원본 이미지(base64, 10MB+)를 매번 재조회하던 성능 문제 제거
  - 예산 도넛 차트가 검토 대기 거래까지 포함해 계산되어 사용률 수치와 어긋나던 버그 수정
  - 루트 경로가 랜딩 페이지 대신 강제 로그아웃되던 라우팅 버그 수정

## 기술 스택
- Framework: Next.js 14 (App Router), React 18, TypeScript
- DB: Supabase (Postgres)
- AI: OpenAI API (gpt-4o-mini) — 결제 자동 분류, 챗봇
- OCR: tesseract.js
- UI: Tailwind CSS, chart.js, framer-motion, lucide-react

## 주요 기능
- 결제 내역 자동 분류 및 대시보드 시각화
- 영수증 업로드 → OCR 인식 → 거래 매칭/등록
- 규칙 기반 이상거래 탐지 (예산초과·중복결제·일정불일치·고액지출·영수증누락)
- 승인/이월/공동승인 워크플로우
- 캘린더 기반 거래 조회
- 장부 CSV 다운로드 (`/api/export`)

## 실행 방법

```bash
npm install
npm run dev   # DB가 비어있으면 자동으로 시드됩니다
```

`.env.local`
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
OPENAI_API_KEY=sk-...   # 없어도 개발 서버는 정상 동작, 미분류 결제는 "기타"로 표시
```

`supabase/schema.sql`을 Supabase SQL Editor에서 한 번 실행해야 합니다.

## 데이터 흐름

```
data/payments.seed.json
        ↓ npm run db:seed
Supabase payments 테이블
        ↓ npm run classify
Supabase payment_classifications 테이블
        ↓ 서버에서 읽기 (lib/get-dashboard-data.ts)
        ↓ 규칙 기반 이상거래 감지 (lib/anomalies/from-payments.ts)
대시보드 / 거래내역 / 감사 / 랜딩 UI
```

## 프로덕션 빌드

```bash
npm run build
npm start
```
