# Don Dog (돈독) Dashboard — Next.js

React + Next.js(App Router) + TypeScript + Tailwind CSS로 만든 돈독 대시보드입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 구조

```
app/
  layout.tsx      전체 레이아웃, Pretendard 폰트 로드
  page.tsx        메인 페이지 (사이드바 + 페이지 전환 상태 관리)
  globals.css     Tailwind 진입점 + 사이드바 호버 라벨 스타일
components/
  Sidebar.tsx           호버 시 확장되는 좌측 네비게이션
  Topbar.tsx            상단 검색/알림/프로필 바
  BudgetCard.tsx         예산 도넛 차트 카드 (Chart.js)
  ReviewCard.tsx         확인 필요 거래 카드 → Drawer 오픈
  SummaryCard.tsx        AI 요약 카드
  TransactionsTable.tsx  최근 거래내역 테이블 (상태 배지)
  Calendar.tsx           모임 일정 캘린더 (일정 추가 모달 포함)
  ReviewDrawer.tsx       거래 검토 Drawer (분류 변경, 승인/공동승인 요청)
  OtherPages.tsx         Members / Profile / Add Group / Settings 목업 페이지
lib/
  types.ts        공용 타입 정의
```

## 참고

- 아이콘: lucide-react
- 차트: chart.js + react-chartjs-2
- 폰트: Pretendard (CDN)
- 색상/라운드/그림자 값은 tailwind.config.ts의 `brand.*`, `rounded-card`,
  `rounded-btn`, `shadow-card` 토큰에 정의되어 있어서 여기서만 바꾸면
  전체 화면에 일괄 반영됩니다.
- 지금은 거래내역/일정 데이터가 컴포넌트 안에 하드코딩되어 있습니다.
  실제 서비스로 이어가려면 오픈뱅킹 API 연동 부분을 각 컴포넌트의
  데이터 소스 자리에 fetch 로직으로 교체하면 됩니다.
