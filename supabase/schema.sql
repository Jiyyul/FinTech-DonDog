-- Don Dog (돈독) 통합 데이터 스키마 (멀티 그룹 + 회원가입/로그인)
-- Supabase SQL Editor에 이 파일 전체를 붙여넣고 한 번 실행하세요.
-- 기존 단일 그룹 DB가 있다면 supabase/migrations/002_auth_multitenant.sql 도 실행하세요.

create table if not exists groups (
  id bigint generated always as identity primary key,
  name text not null,
  entry_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists accountants (
  id bigint generated always as identity primary key,
  username text not null unique,
  password_hash text not null,
  account_number text not null,
  phone text not null,
  affiliation text,
  group_id bigint not null references groups (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists idx_accountants_group_id on accountants (group_id);

create table if not exists payments (
  id bigint generated always as identity primary key,
  group_id bigint not null references groups (id) on delete cascade,
  merchant text not null,
  amount integer not null,
  balance_after integer not null,
  transacted_at date not null,
  payment_method text not null default '학생회 체크카드',
  created_at timestamptz not null default now()
);
create index if not exists idx_payments_group_transacted on payments (group_id, transacted_at desc, id desc);

create table if not exists payment_classifications (
  payment_id bigint primary key references payments (id) on delete cascade,
  category text not null,
  confidence integer not null,
  source text not null default 'openai',
  classified_at timestamptz not null default now()
);

create table if not exists transaction_reviews (
  payment_id bigint primary key references payments (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'deferred', 'exception')),
  reviewed_at timestamptz,
  reviewer text,
  note text
);

create table if not exists schedules (
  id text not null,
  group_id bigint not null references groups (id) on delete cascade,
  title text not null,
  event_date date not null,
  color text not null,
  description text,
  primary key (group_id, id)
);

create table if not exists receipts (
  id text primary key,
  group_id bigint not null references groups (id) on delete cascade,
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
create index if not exists idx_receipts_group_id on receipts (group_id);
alter table receipts add column if not exists image_data_url text;

create table if not exists budget_total (
  group_id bigint primary key references groups (id) on delete cascade,
  amount integer not null
);

create table if not exists budget_categories (
  group_id bigint not null references groups (id) on delete cascade,
  category text not null,
  budget_amount integer not null default 0,
  primary key (group_id, category)
);

create table if not exists budget_history (
  id bigint generated always as identity primary key,
  group_id bigint not null references groups (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  category text not null,
  from_amount integer not null,
  to_amount integer not null,
  actor text,
  type text not null check (type in ('budget_change', 'ai_review')),
  label text
);
create index if not exists idx_budget_history_group_id on budget_history (group_id, occurred_at desc);

alter table payments disable row level security;
alter table payment_classifications disable row level security;
alter table transaction_reviews disable row level security;
alter table schedules disable row level security;
alter table receipts disable row level security;
alter table budget_categories disable row level security;
alter table budget_total disable row level security;
alter table budget_history disable row level security;
alter table groups disable row level security;
alter table accountants disable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
