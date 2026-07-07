# Don Dog (돈독) — Fintech Project

Next.js 기반 동아리/학생회 회계 대시보드입니다.  
프론트엔드 UI는 [zeyyee/dondog](https://github.com/zeyyee/dondog)를 기반으로 합니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

`npm run dev` 실행 시 DB가 없으면 자동으로 시드됩니다.

## 결제 데이터 (SQLite)

결제 내역은 **코드가 아니라 DB 파일**에 저장됩니다.

| 경로 | 설명 |
|------|------|
| `data/dondok.db` | SQLite DB 파일 (결제 + AI 분류 결과) |
| `data/payments.seed.json` | 결제 원본 데이터 (여기에 추가/수정) |

```bash
# payments.seed.json 수정 후 DB에 반영
npm run db:seed -- --force
```

- `data/payments.seed.json`에 `merchant`, `amount`, `transacted_at`만 넣으면 됩니다
- 잔액은 시드 시 자동 계산됩니다
- DB 파일은 [DB Browser for SQLite](https://sqlitebrowser.org/) 등으로 직접 열어볼 수 있습니다

## OpenAI 결제명 분류

```bash
# .env.local
OPENAI_API_KEY=sk-...

npm run classify
```

- 미분류 결제만 OpenAI(gpt-4o-mini)로 분류합니다
- 결과는 `data/dondok.db`의 `payment_classifications` 테이블에 저장됩니다

## 데이터 흐름

```
data/payments.seed.json
        ↓ npm run db:seed
data/dondok.db (payments)
        ↓ npm run classify
data/dondok.db (payment_classifications)
        ↓ 서버에서 읽기
대시보드 / 거래내역 / 감사 UI
```

## 프로덕션 빌드

```bash
npm run build
npm start
```
