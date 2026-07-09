-- 기존 단일 그룹 Supabase 스키마 → 멀티 그룹 + auth 마이그레이션
-- schema.sql 을 이미 실행한 프로젝트에만 적용하세요.

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

-- 데모 그룹 (기존 데이터 귀속)
insert into groups (name, entry_code)
select 'AI 핀테크 동아리', '1234567890'
where not exists (select 1 from groups limit 1);

do $$
declare
  default_group_id bigint;
begin
  select id into default_group_id from groups order by id limit 1;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'payments' and column_name = 'group_id'
  ) then
    alter table payments add column group_id bigint;
    update payments set group_id = default_group_id where group_id is null;
    alter table payments alter column group_id set not null;
    alter table payments add constraint payments_group_id_fkey
      foreign key (group_id) references groups (id) on delete cascade;
    create index if not exists idx_payments_group_transacted
      on payments (group_id, transacted_at desc, id desc);
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'receipts' and column_name = 'group_id' and data_type = 'text'
  ) then
    alter table receipts alter column group_id type bigint using default_group_id;
  elsif not exists (
    select 1 from information_schema.columns
    where table_name = 'receipts' and column_name = 'group_id'
  ) then
    alter table receipts add column group_id bigint not null default default_group_id;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'schedules' and column_name = 'group_id'
  ) then
    alter table schedules add column group_id bigint;
    update schedules set group_id = default_group_id where group_id is null;
    alter table schedules alter column group_id set not null;
    alter table schedules drop constraint if exists schedules_pkey;
    alter table schedules add primary key (group_id, id);
  end if;
end $$;

-- budget_total: singleton → per group
do $$
declare
  default_group_id bigint;
  legacy_amount integer;
begin
  select id into default_group_id from groups order by id limit 1;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'budget_total' and column_name = 'id'
  ) then
    select amount into legacy_amount from budget_total where id = 1;
    create table if not exists budget_total_new (
      group_id bigint primary key references groups (id) on delete cascade,
      amount integer not null
    );
    insert into budget_total_new (group_id, amount)
    values (default_group_id, coalesce(legacy_amount, 0))
    on conflict (group_id) do nothing;
    drop table budget_total;
    alter table budget_total_new rename to budget_total;
  end if;
end $$;

-- budget_categories: per group
do $$
declare
  default_group_id bigint;
begin
  select id into default_group_id from groups order by id limit 1;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'budget_categories' and column_name = 'group_id'
  ) then
    create table budget_categories_new (
      group_id bigint not null references groups (id) on delete cascade,
      category text not null,
      budget_amount integer not null default 0,
      primary key (group_id, category)
    );
    insert into budget_categories_new (group_id, category, budget_amount)
    select default_group_id, category, budget_amount from budget_categories;
    drop table budget_categories;
    alter table budget_categories_new rename to budget_categories;
  end if;
end $$;

-- budget_history: group_id
do $$
declare
  default_group_id bigint;
begin
  select id into default_group_id from groups order by id limit 1;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'budget_history' and column_name = 'group_id'
  ) then
    alter table budget_history add column group_id bigint;
    update budget_history set group_id = default_group_id where group_id is null;
    alter table budget_history alter column group_id set not null;
    alter table budget_history add constraint budget_history_group_id_fkey
      foreign key (group_id) references groups (id) on delete cascade;
  end if;
end $$;

-- 데모 회계 담당자 (admin123 / admin)
insert into accountants (username, password_hash, account_number, phone, affiliation, group_id)
select
  'admin123',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81ae6fc3b6a63f6',
  '110-123-456789',
  '010-1234-5678',
  '경영학과',
  (select id from groups order by id limit 1)
where not exists (select 1 from accountants where username = 'admin123');
