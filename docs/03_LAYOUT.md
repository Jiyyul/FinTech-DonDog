# Don Dog Layout System

Version 1.0

---

# 목적

이 문서는 Don Dog 서비스의 전체 레이아웃과 화면 구조를 정의한다.

모든 페이지는 동일한 레이아웃 시스템을 사용한다.

페이지마다 구조가 달라져서는 안 된다.

사용자는 어떤 페이지를 이동하더라도 동일한 사용 경험을 가져야 한다.

---

# 전체 구조

Desktop First

기준 해상도

1920 × 1080

최소 지원

1440px

기본 레이아웃

┌─────────────────────────────────────────────┐
│ Sidebar │ Header                           │
│         ├───────────────────────────────────┤
│         │                                   │
│         │           Main Content            │
│         │                                   │
│         │                                   │
│         │                                   │
└─────────┴───────────────────────────────────┘

---

# Sidebar

좌측 고정

position: fixed

Height

100vh

Collapsed

72px

Expanded

240px

Background

White

Border

없음

Shadow

매우 약하게

Radius

24px

Padding

20px

---

# Sidebar 상단

Don Dog Logo

Shield + Dog Icon

또는

DON DOG

텍스트 로고

로고 아래에는

현재 모임 이름

예시

컴퓨터공학과 학생회

2026년 1학기

---

# Sidebar 메뉴

순서

Dashboard

거래내역

예산관리

AI 감사

일정

구성원

프로필

메뉴는 아이콘과 텍스트를 함께 사용한다.

Collapsed 상태에서는

아이콘만 표시한다.

Expanded 상태에서는

텍스트가 Fade Animation으로 나타난다.

---

# Sidebar 하단

+ 버튼

새 모임 추가

Divider

현재 로그인 사용자

프로필 사진

이름

직책

Treasurer

---

# Hover

Sidebar Hover 시

72px

↓

240px

Transition

300ms

Ease-in-out

아이콘은 움직이지 않는다.

텍스트만 자연스럽게 나타난다.

---

# Header

Header는 Sticky 형태로 유지한다.

Height

88px

Width

100%

Background

Transparent

Blur 효과 사용 가능

---

# Header 좌측

Page Title

예시

컴퓨터공학과 학생회

아래

Semester

2026년 1학기

---

# Header 우측

Search

Notification

Profile

Avatar

Search는 둥근 입력창 형태

Notification은 Bell Icon

---

# Main Content

Content Padding

40px

Top

32px

Bottom

48px

Max Width

1600px

Center Alignment

---

# Dashboard Grid

첫 번째 줄

4개의 카드

┌────────────┬────────────┬────────────┬────────────┐
│ Budget     │ Summary    │ AI Alert   │ Calendar   │
└────────────┴────────────┴────────────┴────────────┘

---

두 번째 줄

2개의 큰 카드

┌──────────────────────────────┬────────────────────┐
│ Recent Transactions          │ Budget Trend       │
└──────────────────────────────┴────────────────────┘

---

세 번째 줄

┌──────────────────────────────┬────────────────────┐
│ AI Report                    │ Activity Feed      │
└──────────────────────────────┴────────────────────┘

---

# Card Layout

모든 카드

Background

White

Radius

24px

Padding

28px

Gap

24px

Hover

Lift Animation

Transition

300ms

---

# Budget Card

왼쪽

도넛 차트

오른쪽

총 예산

사용 금액

잔액

Progress

Legend

차트는 카드 중앙에 충분한 여백을 확보한다.

---

# AI Alert Card

상단

Warning Icon

제목

확인이 필요한 거래

본문

AI가 회칙 위반 가능성을 발견했습니다.

하단

Primary Button

검토하기

---

# Calendar Card

Apple Calendar 스타일

오늘 날짜 강조

다가오는 일정

Badge 형태

Hover 시

살짝 확대

---

# Recent Transactions

Table

Header

Merchant

AI Category

Date

Amount

Status

행 Hover

Background

Light Gray

행 클릭

상세 화면 이동

---

# Budget Trend

Line Chart

월별 예산 사용

Smooth Animation

Tooltip

Card Style

---

# Activity Feed

최근 활동

예시

AI가 거래를 분석했습니다.

공동 승인이 완료되었습니다.

새 일정이 등록되었습니다.

새 구성원이 초대되었습니다.

Timeline 형태

---

# AI Report

AI가 자동 생성한 요약

예시

이번 달 식비 비중이 가장 높습니다.

행사비는 예산보다 12% 초과되었습니다.

회칙 위반 가능 거래가 1건 있습니다.

카드 형태

---

# Modal

모든 Modal은 동일한 스타일을 사용한다.

Width

720px

Radius

28px

Padding

32px

Background

White

Animation

Fade + Scale

Close Button

우측 상단

---

# Drawer

우측에서 등장

AI 상세 정보

Profile

Transaction Detail

등에 사용

Slide Animation

---

# Toast

우측 상단

3초 후 자동 종료

Radius

16px

Success

Green

Warning

Orange

Danger

Red

---

# Empty Layout

데이터가 없을 경우

빈 화면을 보여주지 않는다.

Illustration

설명

CTA Button

을 함께 표시한다.

---

# Responsive

Desktop

4 Column Grid

Tablet

2 Column Grid

Mobile

Single Column

Sidebar는 Drawer 형태로 변경한다.

---

# Scroll

Header는 고정

Sidebar는 고정

Main Content만 스크롤

스크롤바는 최소한으로 표시한다.

---

# Motion

Hover

Lift

Click

Scale

Chart

Fade In

Sidebar

Slide

Modal

Scale + Fade

Calendar

Soft Hover

---

# 페이지 공통 구조

모든 페이지는 동일한 흐름을 따른다.

Header

↓

Page Title

↓

Summary Cards

↓

Main Content

↓

Detail Section

↓

Footer Margin

---

# 레이아웃 원칙

화면이 답답해 보이면 실패이다.

카드를 너무 많이 배치하지 않는다.

여백을 적극적으로 사용한다.

정보를 한눈에 이해할 수 있도록 그룹화한다.

시선은

왼쪽 위

↓

오른쪽

↓

아래

순서로 자연스럽게 이동해야 한다.

---

# 최종 목표

사용자가 Don Dog를 처음 열었을 때

"학생 프로젝트"

가 아니라

"실제 출시된 AI 회계 SaaS"

처럼 느껴져야 한다.

레이아웃은 기능보다 사용성을 우선하며,

항상 Premium SaaS 수준의 구조와 여백을 유지한다.