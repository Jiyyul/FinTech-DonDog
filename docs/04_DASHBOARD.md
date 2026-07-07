# Don Dog Dashboard

Version 1.0

---

# 목적

Dashboard는 Don Dog의 핵심 페이지이다.

사용자는 로그인 후 가장 먼저 이 화면을 보게 된다.

Dashboard 하나만 봐도

현재 예산

최근 거래

AI 감사

일정

AI 리포트

모든 정보를 확인할 수 있어야 한다.

Dashboard는 정보를 많이 보여주는 것이 아니라

"가장 중요한 정보만"

보여주는 것이 목표이다.

---

# Dashboard 구성

총 3개의 Section으로 구성한다.

1.

Summary Section

2.

Management Section

3.

AI Section

---

####################################################

SECTION 1

####################################################

첫 번째 줄

4개의 Summary Card

┌────────────┬────────────┬────────────┬────────────┐

예산

예산 요약

AI 감사

일정

└────────────┴────────────┴────────────┴────────────┘

카드 높이

340px

카드 간격

24px

Padding

28px

---

# Card 1

이번 학기 예산

카드 제목

이번 학기 예산

우측 상단

··· 메뉴 버튼

중앙

Large Doughnut Chart

차트 크기

220px

중앙

74%

사용 완료

아래

Legend

Blue

행사비

42%

Green

식비

28%

Purple

운영비

17%

Orange

교통비

13%

Hover

차트 확대 효과

Tooltip

카테고리

금액

퍼센트

표시

---

카드 하단

버튼

예산 상세보기 →

Ghost Button

---

# Card 2

예산 요약

카드 제목

예산 요약

큰 숫자

₩8,000,000

총 예산

Divider

사용

₩5,320,000

잔액

₩2,680,000

Progress

66%

Progress Bar

Green

아래

예산 사용 속도

이번 달은 평균보다

12%

빠르게 사용 중입니다.

AI 코멘트

🐶

이번 달 행사비 비중이 높습니다.

---

# Card 3

AI 감사

이 카드가 Dashboard의 핵심이다.

상단

🐶

AI Audit

Badge

Review Required

Orange

중앙

확인 필요한 거래

1건

아래

학생 MT 펜션

₩850,000

AI 분류

행사비

회칙 확인 필요

버튼

검토하기

Primary Button

버튼 클릭

↓

Modal Open

페이지 이동 금지

---

# Card 4

일정

Calendar

월간 달력

오늘 날짜

Brand Color

일정은

Soft Badge

Hover

Popover

우측 아래

일정 추가 버튼

Floating +

---

####################################################

SECTION 2

####################################################

두 번째 줄

┌──────────────────────────────┬──────────────────────┐

최근 거래내역

예산 추이

└──────────────────────────────┴──────────────────────┘

---

# Recent Transactions

이 카드가 가장 크다.

Width

70%

Height

460px

Header

최근 거래내역

우측

전체보기

Table

Merchant

AI Category

Date

Amount

Status

Status

Completed

Pending

Review

Hover

행 전체 Highlight

클릭

↓

Drawer Open

거래 상세정보

---

거래 예시

MT 펜션 예약

행사비

7월 2일

₩850,000

검토 필요

---

김밥천국

식비

7월 3일

₩42,000

완료

---

전자상가

장비비

7월 5일

₩120,000

완료

---

프린트카페

운영비

7월 6일

₩18,000

완료

---

Status Color

Completed

Green

Pending

Blue

Review

Orange

---

# Budget Trend

Line Chart

카드 제목

월별 예산 추이

X

1월

2월

3월

4월

5월

6월

Y

금액

Animation

700ms

Hover

Tooltip

이번 달

사용

예산

잔액

---

Chart 아래

AI Insight

🐶

3월 이후 행사비가 크게 증가했습니다.

---

####################################################

SECTION 3

####################################################

세 번째 줄

┌──────────────────────────────┬──────────────────────┐

AI Report

Activity

└──────────────────────────────┴──────────────────────┘

---

# AI Report

이 카드는

Don Dog만의 차별점이다.

상단

🐶

AI 회계 리포트

본문

이번 달 식비 비중이

37%

로 가장 높습니다.

행사비는

예산보다

8%

초과되었습니다.

회칙 위반 가능 거래

1건

발견되었습니다.

아래

Button

전체 리포트 보기

---

오른쪽

Confidence

98%

Badge

---

# Activity Feed

Timeline

최근 활동

3분 전

🐶

김밥천국을

식비로 자동 분류했습니다.

--------

12분 전

공동 승인이 완료되었습니다.

--------

35분 전

새 일정이 등록되었습니다.

--------

1시간 전

새로운 구성원이 초대되었습니다.

--------

Yesterday

AI 리포트가 생성되었습니다.

---

Timeline은

Line 형태

Circle Icon

사용

---

####################################################

Floating Components

####################################################

오른쪽 아래

Floating AI Chat

원형 버튼

Brand Color

Dog Icon

Click

↓

AI Chat Open

---

예시 질문

이번 MT 얼마 썼어?

↓

잔액 얼마 남았어?

↓

회칙 위반 거래만 보여줘

↓

식비가 가장 많은 달은?

---

####################################################

Interaction

####################################################

Hover

Card Lift

Button Scale

Table Hover

Chart Animation

Sidebar Animation

Calendar Hover

AI Chat Animation

모든 Animation

200~300ms

---

####################################################

Empty State

####################################################

최근 거래가 없습니다.

일정이 없습니다.

AI 분석 결과가 없습니다.

빈 화면 대신

Illustration

설명

버튼

사용

---

####################################################

절대로 하면 안 되는 것

####################################################

❌ 카드를 작게 만들지 않는다.

❌ 카드를 빽빽하게 배치하지 않는다.

❌ 차트를 화려하게 만들지 않는다.

❌ Gradient 남발 금지

❌ Bootstrap 느낌 금지

❌ 오래된 ERP 화면처럼 만들지 않는다.

❌ 작은 글씨 남발 금지

❌ 관리자(AdminLTE) 스타일 금지

---

# 최종 목표

Dashboard를 보는 순간

사용자는

"학생회 프로그램"

이라고 생각하면 안 된다.

"실제 서비스 중인 AI 핀테크 SaaS"

라는 인상을 받아야 한다.

정보는 적지만 명확하게,

여백은 넉넉하게,

AI는 자연스럽게,

디자인은 Premium SaaS 수준으로 유지한다.