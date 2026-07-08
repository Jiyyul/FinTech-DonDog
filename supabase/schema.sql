-- Don Dog (돈독) 통합 데이터 스키마
-- Supabase SQL Editor에 이 파일 전체를 붙여넣고 한 번 실행하세요.
-- RLS는 이번 단계(로그인 미도입)에서는 비활성 상태로 둡니다.
-- TODO: Gmail 로그인 도입 시 각 테이블에 RLS 정책을 추가해야 합니다.

create table if not exists payments (
  id bigint generated always as identity primary key,
  merchant text not null,
  amount integer not null,
  balance_after integer not null,
  transacted_at date not null,
  payment_method text not null default '학생회 체크카드',
  created_at timestamptz not null default now()
);
create index if not exists idx_payments_transacted_at on payments (transacted_at desc, id desc);

create table if not exists payment_classifications (
  payment_id bigint primary key references payments (id) on delete cascade,
  category text not null,
  confidence integer not null,
  source text not null default 'openai',
  classified_at timestamptz not null default now()
);

-- 이상거래 검토 상태 (승인/이월/예외처리). 승인 전까지는 예산 사용액에서 "검토대기"로 분리 집계됨.
create table if not exists transaction_reviews (
  payment_id bigint primary key references payments (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'deferred', 'exception')),
  reviewed_at timestamptz,
  reviewer text,
  note text
);

-- 캘린더 일정(모임/행사). CalendarEvent 화면(캘린더 페이지·대시보드 카드·이상거래 예외처리 모달)이
-- 그대로 이 테이블을 읽고 쓴다. 이상거래 규칙엔진에는 lib/anomalies/from-payments.ts가
-- 이 목록을 그때그때 변환해서 참고용으로만 쓴다(별도 예산/카테고리 컬럼이 필요 없음).
create table if not exists schedules (
  id text primary key,
  title text not null,
  event_date date not null,
  color text not null,
  description text
);

create table if not exists receipts (
  id text primary key,
  group_id text not null default 'group_001',
  merchant text not null,
  purchased_at date not null,
  purchased_time text,
  total_amount integer not null,
  payment_method text,
  category text,
  raw_text text,
  confidence integer,
  items jsonb not null default '[]'::jsonb,
  file_name text,
  file_type text,
  file_size integer,
  image_data_url text,
  linked_payment_id bigint references payments (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table receipts add column if not exists image_data_url text;

create table if not exists budget_categories (
  category text primary key,
  budget_amount integer not null default 0
);

create table if not exists budget_total (
  id smallint primary key default 1,
  amount integer not null,
  constraint budget_total_singleton check (id = 1)
);

create table if not exists budget_history (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  category text not null,
  from_amount integer not null,
  to_amount integer not null,
  actor text,
  type text not null check (type in ('budget_change', 'ai_review')),
  label text
);

-- Supabase 신규 프로젝트는 테이블 생성 시 RLS가 기본으로 켜져 있다. 로그인 미도입 단계에서는
-- 위 TODO대로 꺼둔다 (로그인 도입 시 아래 disable 대신 테이블별 RLS 정책을 추가해야 한다).
alter table payments disable row level security;
alter table payment_classifications disable row level security;
alter table transaction_reviews disable row level security;
alter table schedules disable row level security;
alter table receipts disable row level security;
alter table budget_categories disable row level security;
alter table budget_total disable row level security;
alter table budget_history disable row level security;

-- RLS를 꺼도 anon 키가 테이블에 접근하려면 명시적 GRANT가 필요하다.
-- 이미 실행했다면 다시 실행해도 안전하다(권한 재부여일 뿐 데이터에는 영향 없음).
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
