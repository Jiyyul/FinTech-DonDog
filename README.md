# Don Dog (돈독) — Fintech Project

Next.js 기반 동아리/학생회 회계 대시보드입니다. 실제 결제내역을 Supabase(Postgres)에 저장하고
OpenAI API로 분류하는 파이프라인과, 영수증을 업로드해 OCR로 판독·매칭하고 규칙 기반으로
이상거래를 감지하는 기능을 하나로 합쳤습니다. `/landing`에 별도 마케팅 랜딩 페이지가 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

`npm run dev` 실행 시 DB가 비어있으면 자동으로 시드됩니다.

## 결제 데이터 (Supabase)

결제 내역은 **코드가 아니라 Supabase DB**에 저장됩니다. `.env.local`에 `SUPABASE_URL`,
`SUPABASE_ANON_KEY`를 설정하고, `supabase/schema.sql`을 Supabase SQL Editor에서 한 번
실행해야 합니다.

| 경로 | 설명 |
|------|------|
| `supabase/schema.sql` | 전체 테이블 스키마 (payments, receipts, budget_* 등) |
| `data/payments.seed.json` | 결제 원본 데이터 (여기에 추가/수정) |

```bash
# payments.seed.json 수정 후 DB에 반영
npm run db:seed -- --force
```

- `data/payments.seed.json`에 `merchant`, `amount`, `transacted_at`만 넣으면 됩니다
- 잔액은 시드 시 자동 계산됩니다

## OpenAI 결제명 분류

```bash
# .env.local
OPENAI_API_KEY=sk-...

npm run classify
```

- 미분류 결제만 OpenAI(gpt-4o-mini)로 분류합니다
- 결과는 Supabase의 `payment_classifications` 테이블에 저장됩니다
- API 키가 없어도 개발 서버는 정상 동작하며, 미분류 결제는 "기타" 카테고리로 표시됩니다

## 영수증 업로드 · 이상거래 감지

- `/receipts`: 영수증 이미지를 업로드하면 실제 OCR(tesseract.js)로 파싱하고 기존
  거래내역과 매칭하거나, 매칭할 거래가 없으면 새 거래로 자동 등록합니다
- `/audit`: OpenAI로 분류된 결제내역을 승인/이월/공동승인 요청 워크플로우로 검토합니다
- `/audit/overview`: 예산초과·중복결제·일정불일치·고액지출·영수증누락 5가지 규칙 기반 감지 결과를
  전체 거래 테이블로 확인합니다 (`/audit`와 같은 규칙 엔진을 공유)

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

## 참고

- 아이콘: lucide-react · 차트: chart.js + react-chartjs-2 · 랜딩 애니메이션: framer-motion
- 영수증 OCR·매칭 로직: `lib/receipts/*`, 이상거래 규칙 엔진: `lib/anomalies/*`
- 색상/라운드/그림자 값은 `tailwind.config.ts`의 `brand.*`, `rounded-card`,
  `rounded-btn`, `shadow-card` 토큰에 정의되어 있어 전체 화면에 일괄 반영됩니다
