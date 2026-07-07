"use client";

import { useState } from "react";
import { CreditCard, Pencil } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import CardEditModal from "@/components/profile/CardEditModal";
import { CURRENT_USER } from "@/lib/mock-data";
import type { RegisteredCard, UserProfile } from "@/lib/mock-data";

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

export default function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile>(CURRENT_USER);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [saved, setSaved] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== passwordConfirm) return;
    setSaved(true);
    setPassword("");
    setPasswordConfirm("");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCardSave = (card: RegisteredCard) => {
    setProfile((prev) => ({ ...prev, card }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <form onSubmit={handleProfileSave}>
        <Card>
          <h2 className="dash-card-title mb-6">개인정보</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">이름</span>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">생년월일</span>
              <input
                value={profile.birthDate}
                onChange={(e) => setProfile((p) => ({ ...p, birthDate: e.target.value }))}
                className={inputClass}
                placeholder="2002.03.15"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">아이디</span>
              <input
                value={profile.userId}
                onChange={(e) => setProfile((p) => ({ ...p, userId: e.target.value }))}
                className={inputClass}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">새 비밀번호</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="변경 시에만 입력"
                autoComplete="new-password"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">비밀번호 확인</span>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={inputClass}
                placeholder="비밀번호 재입력"
                autoComplete="new-password"
              />
              {password && password !== passwordConfirm && (
                <p className="mt-1.5 text-[12px] text-danger">비밀번호가 일치하지 않습니다.</p>
              )}
            </label>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button type="submit" variant="primary">
              저장하기
            </Button>
            {saved && (
              <span className="text-[13px] font-medium text-success">저장되었습니다.</span>
            )}
          </div>
        </Card>
      </form>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="dash-card-title">등록된 카드</h2>
          <Button
            type="button"
            variant="secondary"
            icon={<Pencil size={15} strokeWidth={1.5} />}
            onClick={() => setCardModalOpen(true)}
          >
            카드 수정
          </Button>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-appbg p-5 ring-1 ring-hairline">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand">
            <CreditCard size={22} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink">{profile.card.label}</p>
            <p className="mt-1 text-[13px] text-ink2">
              {profile.card.issuer} · **** {profile.card.last4}
            </p>
          </div>
        </div>
      </Card>

      <CardEditModal
        open={cardModalOpen}
        card={profile.card}
        onClose={() => setCardModalOpen(false)}
        onSave={handleCardSave}
      />
    </div>
  );
}
