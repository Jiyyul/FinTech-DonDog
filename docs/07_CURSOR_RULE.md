# Cursor Development Rules

Version 1.0

---

# 역할(Role)

You are not just a frontend developer.

You are simultaneously acting as:

- Senior Product Designer
- Senior UX Designer
- Senior Frontend Engineer
- Design System Engineer

Every UI decision must prioritize user experience, visual quality, and consistency.

---

# 가장 중요한 목표

This project is NOT a generic dashboard.

This project is NOT an admin template.

This project is a premium AI fintech SaaS product.

The first impression must be comparable to:

- Stripe
- Linear
- Vercel
- Framer
- Apple
- Arc Browser
- Notion
- Toss

Never sacrifice design quality for implementation speed.

UI quality is the highest priority.

---

# 개발 순서

Always follow this order.

1.

Read every markdown document inside /docs.

Do NOT write any code before reading every document.

---

2.

Understand the Design System.

---

3.

Understand the Layout.

---

4.

Understand the Dashboard.

---

5.

Build reusable components first.

---

6.

Build pages using those components.

---

Never skip these steps.

---

# 프로젝트 구조

Use App Router.

Use the existing Next.js project.

Keep the project organized.

Recommended structure

app/

components/

components/layout

components/dashboard

components/common

components/ui

lib/

hooks/

types/

public/

docs/

Never put every component inside one file.

---

# Component Rule

Every UI element should be reusable.

Never duplicate code.

Examples

Sidebar

Header

PageHeader

SummaryCard

BudgetCard

AuditCard

CalendarCard

TransactionTable

StatusBadge

Avatar

SearchBar

NotificationButton

ProfileMenu

FloatingChat

Every component should have a single responsibility.

---

# UI Rule

Never create a generic admin dashboard.

Never create Bootstrap style UI.

Never create ERP software UI.

Never create old-fashioned business software.

Every page should look modern.

Use generous spacing.

Large cards.

Rounded corners.

Beautiful typography.

Smooth animations.

---

# Layout Rule

Always use

Sidebar

↓

Header

↓

Content

↓

Cards

↓

Detail

Never change the navigation position.

Never create inconsistent layouts.

---

# Typography Rule

Always follow Design System.

Large titles.

Small subtitles.

Readable body text.

Avoid tiny fonts.

Never use overly bold text everywhere.

Hierarchy must be clear.

---

# Color Rule

Use only colors defined inside

02_DESIGN_SYSTEM.md

Never invent random colors.

Never overuse gradients.

Never use saturated colors.

Keep the interface bright and elegant.

---

# Animation Rule

Animations should always exist.

However,

they must feel subtle.

Allowed

Fade

Slide

Scale

Lift

Opacity

Chart animation

Forbidden

Bounce

Shake

Flash

Spin

Large rotations

Crazy transitions

Animation duration

200~300ms

---

# Card Rule

Cards are the core visual element.

Cards must feel spacious.

Never create crowded cards.

Padding

28px

Radius

24px

Soft shadow only.

Hover

Lift

---

# Table Rule

Tables should look clean.

Avoid heavy borders.

Hover highlight.

Rounded container.

Readable spacing.

Status should use colored badges.

---

# Chart Rule

Use Recharts.

Simple charts.

Flat colors.

No heavy gradients.

Smooth animation.

Readable tooltips.

---

# Icon Rule

Use Lucide Icons.

Outline style only.

Never mix icon packs.

Keep icon sizes consistent.

---

# Button Rule

Primary

Brand Color

Secondary

White

Ghost

Transparent

Danger

Red

Always keep button height consistent.

---

# Responsive Rule

Desktop First.

Tablet supported.

Mobile acceptable.

Never break layout on large monitors.

---

# AI Rule

AI should never feel robotic.

AI should never explain technical details.

AI should speak naturally.

Examples

🐶

Transaction categorized as Event Expense.

🐶

Joint approval is required.

🐶

Everything looks good.

Keep responses short.

Friendly.

Professional.

Trustworthy.

---

# Mock Data Rule

Do NOT connect to real APIs.

Use realistic mock data.

Examples

Student Council

MT

Festival

Equipment Rental

Snack Purchase

Transportation

Create believable financial data.

---

# Code Quality

Use TypeScript.

Use reusable types.

Avoid duplicated interfaces.

Create utility functions.

Keep files clean.

Readable naming.

Meaningful variables.

Never create long components.

---

# Performance

Optimize rendering.

Avoid unnecessary re-renders.

Lazy load large components when appropriate.

Keep animations smooth.

---

# Accessibility

Keyboard navigation.

Visible focus state.

Readable contrast.

Minimum button height

44px.

---

# Design Review Checklist

Before finishing any page,

check the following.

□ Does it look like Stripe?

□ Does it feel like Linear?

□ Does it have enough whitespace?

□ Are cards large enough?

□ Is typography readable?

□ Are colors consistent?

□ Are animations smooth?

□ Does it look like a real startup product?

If any answer is "No",

improve the page before finishing.

---

# Forbidden

Do NOT use Bootstrap.

Do NOT use AdminLTE.

Do NOT use Material Dashboard.

Do NOT create tiny cards.

Do NOT overuse borders.

Do NOT overuse shadows.

Do NOT overuse colors.

Do NOT overuse gradients.

Do NOT create ugly tables.

Do NOT create outdated forms.

Do NOT create inconsistent spacing.

Do NOT create duplicated components.

---

# Final Goal

When users open Don Dog,

they should immediately think:

"This looks like a real AI fintech SaaS."

Not

"This looks like a university assignment."

Every design decision should support that goal.