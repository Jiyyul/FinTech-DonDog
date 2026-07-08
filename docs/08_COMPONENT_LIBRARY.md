# Don Dog Component Library

Version 1.0

---

# 목적

이 문서는 Don Dog 프로젝트에서 사용하는 모든 컴포넌트를 정의한다.

모든 UI는 재사용 가능한 컴포넌트 기반으로 개발한다.

절대로 동일한 UI를 여러 번 구현하지 않는다.

새로운 화면을 만들 때는 기존 컴포넌트를 우선 활용한다.

---

##################################################

Layout Components

##################################################

Sidebar

Header

PageHeader

PageContainer

ContentSection

FloatingChat

NotificationCenter

---

# Sidebar

목적

모든 페이지에서 사용하는 좌측 Navigation

기능

Logo

Organization Switcher

Navigation

Create Organization

Current User

Hover Expand

Props

Current Menu

Current Organization

Collapsed

Expanded

Animation

Slide

---

# Header

목적

페이지 제목과 검색, 알림을 제공한다.

구성

Title

Subtitle

Search

Notification

Avatar

---

# PageHeader

목적

페이지 제목

설명

Action Button

을 표시한다.

Props

Title

Description

Button

---

##################################################

Card Components

##################################################

SummaryCard

BudgetCard

AuditCard

CalendarCard

ReportCard

ActivityCard

ProfileCard

TransactionCard

ChartCard

MetricCard

---

# SummaryCard

사용 위치

Dashboard

구성

Title

Value

Description

Icon

Trend

Props

title

value

icon

description

trend

---

# BudgetCard

구성

Doughnut Chart

Legend

Progress

AI Comment

Button

Hover

Lift

---

# AuditCard

구성

AI Badge

Warning

Merchant

Category

Review Button

Status

Review

Pending

Approved

---

# CalendarCard

구성

Mini Calendar

Upcoming Events

Today

Add Button

---

# ReportCard

구성

AI Summary

Insight

Recommendation

Confidence

---

# ActivityCard

Timeline

Activity

Date

Status

Icon

---

##################################################

Table Components

##################################################

TransactionTable

MemberTable

BudgetTable

NotificationTable

---

# TransactionTable

Columns

Merchant

Category

Date

Amount

Status

Click

Drawer Open

Hover

Highlight

---

# MemberTable

Columns

Avatar

Name

Role

Status

Permission

Join Date

---

# BudgetTable

Columns

Category

Budget

Spent

Remaining

Progress

---

##################################################

Chart Components

##################################################

BudgetChart

TrendChart

PieChart

BarChart

MetricChart

---

# BudgetChart

Library

Recharts

Type

Doughnut

Animation

700ms

Legend

Bottom

---

# TrendChart

Type

Line Chart

Smooth Curve

Tooltip

Rounded

---

##################################################

Navigation Components

##################################################

SearchBar

Breadcrumb

PageTabs

Pagination

FilterBar

---

# SearchBar

Rounded

Search Icon

Clear Button

Placeholder

---

# FilterBar

Date

Category

Status

Member

Reset Button

---

##################################################

Status Components

##################################################

StatusBadge

ProgressBar

Toast

EmptyState

Skeleton

---

# StatusBadge

Approved

Green

Pending

Blue

Review

Orange

Rejected

Red

---

# ProgressBar

Animated

Rounded

Soft Color

---

# Toast

Success

Warning

Danger

Info

Duration

3 Seconds

---

##################################################

Form Components

##################################################

TextInput

NumberInput

Dropdown

Checkbox

Textarea

Upload

DatePicker

TimePicker

---

모든 Input은

Height

48px

Radius

14px

사용

---

##################################################

AI Components

##################################################

AIMessage

AIConfidence

AIReason

AIInsight

AIChat

AIRecommendation

---

# AIMessage

Icon

Dog

Text

Friendly

Short

Professional

---

# AIConfidence

Circular Badge

95%

Green

90%

Blue

80%

Orange

60%

Red

---

# AIReason

AI가

왜 그렇게 판단했는지

간단하게 설명한다.

예시

가맹점 업종

거래 금액

기존 거래 패턴

등을 분석했습니다.

---

# AIInsight

AI가

예산

거래

회칙

등을 분석하여

요약을 제공한다.

---

##################################################

Profile Components

##################################################

ProfileCard

AvatarCard

SecurityCard

NotificationCard

BankCard

---

# ProfileCard

Avatar

Name

Role

Department

Email

---

##################################################

Calendar Components

##################################################

MiniCalendar

ScheduleCard

ScheduleModal

UpcomingList

---

##################################################

Floating Components

##################################################

FloatingAIChat

FloatingCreateButton

FloatingHelp

---

##################################################

Modal Components

##################################################

AuditModal

TransactionModal

ScheduleModal

InviteMemberModal

ProfileModal

---

모든 Modal

Radius

28px

Padding

32px

Animation

Fade + Scale

---

##################################################

Animation Components

##################################################

Card Hover

Sidebar Expand

Button Press

Modal Fade

Drawer Slide

Chart Fade

Timeline Animation

---

##################################################

Empty Components

##################################################

No Transactions

No Members

No Events

No Budget

No Reports

모든 Empty State는

Illustration

Title

Description

CTA Button

을 포함한다.

---

##################################################

Loading Components

##################################################

Skeleton Card

Skeleton Table

Skeleton Chart

Skeleton Profile

Spinner는 최소한만 사용한다.

---

##################################################

Naming Rule

##################################################

컴포넌트 이름은

항상 PascalCase

예시

SummaryCard

BudgetCard

TransactionTable

MemberTable

AIMessage

Sidebar

Header

---

##################################################

Reuse Rule

##################################################

새로운 UI를 만들기 전에

기존 컴포넌트를 먼저 확인한다.

동일한 UI는 절대로 새로 만들지 않는다.

모든 컴포넌트는

재사용을 목표로 한다.

---

##################################################

Component Folder Structure

##################################################

components/

layout/

Sidebar.tsx

Header.tsx

PageHeader.tsx

dashboard/

BudgetCard.tsx

SummaryCard.tsx

AuditCard.tsx

CalendarCard.tsx

ReportCard.tsx

ActivityCard.tsx

tables/

TransactionTable.tsx

MemberTable.tsx

BudgetTable.tsx

charts/

BudgetChart.tsx

TrendChart.tsx

common/

StatusBadge.tsx

ProgressBar.tsx

EmptyState.tsx

Skeleton.tsx

Button.tsx

Card.tsx

Avatar.tsx

AI/

AIMessage.tsx

AIChat.tsx

AIInsight.tsx

AIConfidence.tsx

AIReason.tsx

forms/

Input.tsx

Dropdown.tsx

Textarea.tsx

Checkbox.tsx

Upload.tsx

---

##################################################

최종 목표

##################################################

Don Dog는

컴포넌트 하나하나가

독립적이고

재사용 가능하며

일관된 디자인을 유지해야 한다.

모든 컴포넌트는

Premium SaaS 수준의 품질을 가져야 하며,

새로운 페이지를 만들더라도

기존 컴포넌트를 조합하는 방식으로 개발한다.