# Don Dog Design System

Version 2.0

---

# 목적

이 문서는 Don Dog 서비스의 전체 디자인 시스템을 정의한다.

모든 화면은 이 문서를 기준으로 제작한다.

새로운 페이지와 컴포넌트를 제작하더라도 반드시 동일한 디자인 원칙을 따른다.

UI의 일관성과 브랜드 아이덴티티를 가장 중요하게 생각한다.

---

# 디자인 철학

Don Dog는

학생회 회계 프로그램이 아니다.

Bootstrap Admin Dashboard도 아니다.

ERP 프로그램도 아니다.

우리가 만드는 것은

"AI 기반 Premium SaaS"

이다.

사용자는 첫 화면을 보는 순간

"실제 출시된 서비스"

라고 느껴야 한다.

---

# 디자인 키워드

Premium

Minimal

Fintech

Elegant

Professional

Friendly

Trustworthy

Modern

Bright

Simple

Calm

Soft

Spacious

---

# 참고 서비스

Stripe Dashboard ⭐⭐⭐⭐⭐

Linear ⭐⭐⭐⭐⭐

Apple ⭐⭐⭐⭐⭐

Arc Browser ⭐⭐⭐⭐⭐

Notion ⭐⭐⭐⭐☆

Vercel ⭐⭐⭐⭐☆

Toss ⭐⭐⭐⭐⭐

Framer ⭐⭐⭐⭐☆

OpenAI ⭐⭐⭐⭐☆

---

# Brand Identity

브랜드는

"회계를 지켜주는 AI 강아지"

를 의미한다.

하지만

캐릭터 서비스처럼 보이면 안 된다.

강아지는

브랜드의 포인트일 뿐이다.

전체 UI는

금융 서비스처럼 신뢰감을 준다.

---

##################################################

Color System

##################################################

## Color Palette

Primary

#0A1680

Primary Blue

브랜드 컬러

CTA

Progress

Primary Button

Active Menu

---

Secondary

#93B2F8

Light Blue

Icon

Chart

보조 강조

---

Accent 1

#F1B94C

Gold

Badge

Highlight

AI 포인트

---

Accent 2

#FBEDB0

Soft Gold

Accent Background

Subtle Highlight

---

## Background

Main Background

#FCFDFF

배경은 거의 흰색

---

Sidebar

#FCFDFF

---

Card

#FFFFFF

---

Hover

#F3F5F7

---

Border

#E8EDF2

---

## Text

Primary

#1A1A1A

Secondary

#64748B

Muted

#94A3B8

Disabled

#CBD5E1

Inverse

#FFFFFF

---

##################################################

Functional Colors

##################################################

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Info

#3B82F6

Purple

#8B5CF6

---

##################################################

Chart Palette

##################################################

행사비

#5B8DEF

식비

#8FD36B

운영비

#93B2F8

교통비

#FFD166

홍보비

#FF8C69

장비비

#4FB3BF

기타

#CBD5E1

차트에서는

항상 위 색상을 사용한다.

임의의 색상을 추가하지 않는다.

---

##################################################

Color Usage Rule

##################################################

색상은

많이 쓰는 것이 아니라

잘 쓰는 것이 중요하다.

권장 비율

White / Background

70%

Gray

15%

Primary Blue

8%

Secondary

5%

Accent

2%

절대로

브랜드 컬러를 화면 전체에 사용하지 않는다.

강조색은 필요한 곳에만 사용한다.

Primary Blue를 브랜드 컬러로 사용한다.

---

##################################################

Typography

##################################################

Font

Pretendard

Fallback

SUIT

System UI

---

Page Title

40px

700

---

Section Title

28px

700

---

Card Title

18px

600

---

Body

15px

400

---

Caption

13px

400

---

Small

12px

400

---

Line Height

1.5

---

##################################################

Spacing System

##################################################

4

8

12

16

20

24

32

40

48

64

80

96

Spacing은

위 값만 사용한다.

---

##################################################

Grid System

##################################################

Desktop

12 Columns

---

Content Max Width

1600px

---

Section Gap

40px

---

Card Gap

24px

---

Container Padding

40px

---

##################################################

Responsive

##################################################

1920+

4 Columns

---

1600

3 Columns

---

1200

2 Columns

---

768

1 Column

---

절대로

텍스트가 겹치면 안 된다.

카드는

자동 줄바꿈한다.

Table은

가로 스크롤 허용.

---

##################################################

Cards

##################################################

Radius

24px

Padding

28px

Background

White

Shadow

0 8px 30px rgba(0,0,0,0.06)

Hover

Lift

Scale 1.01

Transition

250ms

카드는

충분히 크게 만든다.

---

##################################################

Buttons

##################################################

Primary

Primary Blue

Secondary

White

Ghost

Transparent

Danger

Red

Height

48px

Radius

14px

Hover

Brightness 95%

---

##################################################

Inputs

##################################################

Height

48px

Radius

14px

Border

1px

Border Color

#E8EDF2

Focus

Primary Blue

Placeholder

Muted

---

##################################################

Sidebar

##################################################

Background

#FCFCFD

Width

72px

Hover

240px

Logo

Don Dog Logo

(방패 아이콘 사용 금지)

Hover 시

메뉴 이름 Fade In

현재 페이지

Primary Blue Indicator

---

##################################################

Header

##################################################

Height

88px

Background

Transparent

Title

Large

Subtitle

Small

우측

Search

Notification

Avatar

---

##################################################

Charts

##################################################

Library

Recharts

Style

Flat

Minimal

Gradient 사용 금지

Legend

Bottom

Animation

700ms

Tooltip

Rounded Card

차트는

Apple Fitness

Stripe Analytics

스타일을 참고한다.

---

##################################################

Tables

##################################################

Row Height

64px

Header

Bold

Hover

#FCFDFF

Border

Minimal

Status

Badge

---

##################################################

Badges

##################################################

Radius

999px

Height

28px

Padding

12px

Approved

Green

Review

Orange

Pending

Blue

Rejected

Red

AI

Accent Gold

---

##################################################

Icons

##################################################

Lucide Icons Only

Outline Style

Filled Icons 금지

크기

20

22

24

---

##################################################

Motion

##################################################

Hover Animation 적용

Lift · Sidebar Slide · Modal Fade + Scale · Drawer Slide · Button Scale · Chart Fade

Transition

200~300ms

Bounce 금지

Shake 금지

Flash 금지

---

##################################################

Logo Rule

##################################################

Sidebar 상단에는

반드시

Don Dog 공식 로고를 사용한다.

방패 아이콘은 제거한다.

로고 아래에는

현재 선택된 모임명을 표시한다.

예시

컴퓨터공학과 학생회

2026년 1학기

---

##################################################

AI Tone

##################################################

🐶

행사비로 분류했어요.

🐶

회칙상 공동 승인이 필요해요.

🐶

예산을 초과하지 않았어요.

AI는

친절하지만

전문적인 말투를 유지한다.

---

##################################################

Accessibility

##################################################

Minimum Button

44px

Focus Style 제공

텍스트 대비 확보

Hover만 의존하지 않는다.

---

##################################################

Forbidden

##################################################

❌ Bootstrap 스타일

❌ Material Dashboard

❌ AdminLTE

❌ 촌스러운 Gradient

❌ Glassmorphism 남발

❌ 작은 카드

❌ 작은 글씨

❌ 두꺼운 Border

❌ 과한 Shadow

❌ 여러 브랜드 컬러 혼용

❌ 컴포넌트마다 다른 Radius

---

##################################################

Ultimate Goal

##################################################

Don Dog는

학생회 회계 프로그램처럼 보이면 실패다.

사용자는

처음 화면을 보는 순간

"토스나 Stripe 같은 서비스 같다."

라고 느껴야 한다.

모든 화면은

디자인보다

브랜드 경험을 제공해야 한다.

Premium SaaS 수준의 일관성과 완성도를 유지한다.
## Brand Color Usage

Primary Blue (#0A1680)는
화면 전체를 지배하는 색이 아니다.

Primary Blue는

- CTA 버튼
- 진행률(Progress)
- 현재 활성 메뉴
- 선택 상태
- 핵심 KPI

에서만 사용한다.

Accent 1 (#F1B94C), Accent 2 (#FBEDB0)는

- Badge
- AI 포인트
- 특정 Highlight

처럼 꼭 필요한 곳에만 사용한다.

일반 카드, 배경, 테이블에는 사용하지 않는다.

브랜드 컬러는 화면의 약 5~10%만 차지해야 한다.

모든 인터랙션에는 Hover Animation과 200~300ms Transition을 적용한다.