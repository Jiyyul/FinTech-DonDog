-- 회계 담당자 1명이 여러 그룹(동아리)을 관리할 수 있도록 연결 테이블 추가

create table if not exists accountant_groups (
  accountant_id bigint not null references accountants (id) on delete cascade,
  group_id bigint not null references groups (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (accountant_id, group_id)
);

create index if not exists idx_accountant_groups_group_id on accountant_groups (group_id);

-- 기존 accountants.group_id 를 멤버십으로 이전
insert into accountant_groups (accountant_id, group_id)
select id, group_id from accountants
where group_id is not null
on conflict do nothing;

alter table accountant_groups disable row level security;
grant select, insert, update, delete on accountant_groups to anon, authenticated;
