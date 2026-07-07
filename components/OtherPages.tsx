"use client";

import { useState } from "react";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-hairline bg-card p-5.5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="flex items-center justify-between border-b border-hairline py-3.5 text-[13px] last:border-b-0">
      <span>{label}</span>
      <span className="text-xs text-muted">{meta}</span>
    </div>
  );
}

export function MembersPage() {
  return (
    <Card title="모임 구성원">
      <Row label="박지영" meta="총무 · 전체 권한" />
      <Row label="김태원" meta="회장 · 전체 권한" />
      <Row label="배윤민" meta="부회장 · 승인 권한" />
      <Row label="이OO 외 9명" meta="부원 · 조회 권한" />
      <button className="mt-4 rounded-btn bg-brand px-4 py-2.5 text-[13px] font-semibold text-inverse hover:brightness-110">
        구성원 초대
      </button>
    </Card>
  );
}

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <Card title="프로필">
        {[
          ["이름", "박지영"],
          ["학교 / 학과", "숭실대학교 컴퓨터공학과"],
          ["전화번호", "010-0000-0000"],
          ["이메일", "jiyoung@soongsil.ac.kr"],
        ].map(([label, value]) => (
          <div key={label} className="mb-3.5 flex max-w-xs flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted">{label}</label>
            <input
              defaultValue={value}
              className="rounded-[10px] border border-hairline px-3 py-2 text-[13px] outline-none"
            />
          </div>
        ))}
      </Card>
      <Card title="결제 및 계좌 관리">
        <Row label="카드 등록" meta="신한카드 ****4321" />
        <Row label="계좌 관리" meta="모임 통장 연결됨" />
        <Row label="자동이체 관리" meta="미납자 3명 예약됨" />
      </Card>
    </div>
  );
}

export function AddGroupPage() {
  const [type, setType] = useState("동아리");
  const types = ["동아리", "학생회", "스터디", "소모임"];

  return (
    <Card title="새 모임 만들기">
      <p className="-mt-2 mb-4 text-[13px] text-ink2">모임 유형을 선택해주세요</p>
      <div className="mb-4 flex gap-2.5">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-xl border px-4.5 py-3.5 text-[13px] font-semibold transition-colors ${
              type === t
                ? "border-brand bg-brand-subtle text-navy"
                : "border-hairline bg-card text-ink2 hover:bg-surface"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mb-3.5 flex max-w-xs flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted">모임 이름</label>
        <input
          placeholder="예: 컴퓨터공학과 학생회"
          className="rounded-[10px] border border-hairline px-3 py-2 text-[13px] outline-none"
        />
      </div>
      <div className="mb-4 flex max-w-xs flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted">이번 학기 예산</label>
        <input
          placeholder="예: 3000000"
          className="rounded-[10px] border border-hairline px-3 py-2 text-[13px] outline-none"
        />
      </div>
      <button className="rounded-btn bg-brand px-4 py-2.5 text-[13px] font-semibold text-inverse hover:brightness-110">
        다음
      </button>
    </Card>
  );
}

export function SettingsPage() {
  return (
    <Card title="설정">
      <Row label="알림 설정" meta="확인 필요 거래 발생 시 알림" />
      <Row label="AI 설정" meta="자동 분류 확신도 임계값 70%" />
      <Row label="카테고리 관리" meta="행사비 · 식비 · 운영비 · 교통비 · 홍보비 · 기타" />
      <Row label="회칙 업로드" meta="PDF 업로드 · 규정 3건 인식됨" />
      <Row label="예산 설정" meta="학기 단위 예산 관리" />
    </Card>
  );
}
