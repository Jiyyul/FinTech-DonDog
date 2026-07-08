"use client";

import { useEffect, useState } from "react";
import { CreditCard, Pencil, Plus } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import CardEditModal from "@/components/profile/CardEditModal";
import { useMockSession } from "@/components/auth/useMockSession";
import {
  resolveUserProfile,
  saveUserProfile,
  type StoredUserProfile,
} from "@/lib/mock-user-store";
import type { RegisteredCard } from "@/lib/mock-data";

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

export default function ProfileContent() {
  const { session } = useMockSession();
  const isDemoAccount = session?.accountType === "demo";

  const [profile, setProfile] = useState<StoredUserProfile | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [saved, setSaved] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const syncProfile = () => {
    setProfile(resolveUserProfile(session));
  };

  useEffect(() => {
    syncProfile();
  }, [session]);

  useEffect(() => {
    const handleDataChange = () => syncProfile();
    window.addEventListener("dondok-user-data-change", handleDataChange);
    return () => window.removeEventListener("dondok-user-data-change", handleDataChange);
  }, [session]);

  const persistProfile = (next: StoredUserProfile) => {
    setProfile(next);
    if (!isDemoAccount && session) {
      saveUserProfile(session.user.id, next);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (password && password !== passwordConfirm) return;

    persistProfile(profile);
    setSaved(true);
    setPassword("");
    setPasswordConfirm("");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCardSave = (card: RegisteredCard) => {
    if (!profile) return;
    persistProfile({ ...profile, card });
  };

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <p className="text-[14px] text-muted">로그인 후 프로필을 확인할 수 있습니다.</p>
        </Card>
      </div>
    );
  }

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
                onChange={(e) => setProfile((p) => (p ? { ...p, name: e.target.value } : p))}
                className={inputClass}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">생년월일</span>
              <input
                value={profile.birthDate}
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, birthDate: e.target.value } : p))
                }
                className={inputClass}
                placeholder="2002.03.15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">아이디</span>
              <input
                value={profile.userId}
                onChange={(e) => setProfile((p) => (p ? { ...p, userId: e.target.value } : p))}
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
          {profile.card && (
            <Button
              type="button"
              variant="secondary"
              icon={<Pencil size={15} strokeWidth={1.5} />}
              onClick={() => setCardModalOpen(true)}
            >
              카드 수정
            </Button>
          )}
        </div>

        {profile.card ? (
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
        ) : (
          <div className="flex flex-col items-center rounded-2xl bg-appbg px-6 py-10 text-center ring-1 ring-hairline">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface ring-1 ring-hairline">
              <CreditCard size={24} className="text-muted" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-[15px] font-medium text-ink">등록된 카드가 없습니다</p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted">
              결제 카드를 등록하면 거래 내역을 자동으로 불러올 수 있습니다.
            </p>
            <Button
              type="button"
              variant="primary"
              className="mt-6"
              icon={<Plus size={15} strokeWidth={1.5} />}
              onClick={() => setCardModalOpen(true)}
            >
              카드 등록
            </Button>
          </div>
        )}
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
