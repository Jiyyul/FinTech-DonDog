"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import { useAuth } from "@/components/providers/AuthProvider";

type ProfileData = {
  username: string;
  phone: string;
  accountNumber: string;
  affiliation: string;
};

type AccountantProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

export default function AccountantProfileModal({ open, onClose }: AccountantProfileModalProps) {
  const { session } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setPassword("");
    setPasswordConfirm("");
    setSaved(false);

    fetch("/api/auth/profile")
      .then(async (res) => {
        if (!res.ok) throw new Error("프로필을 불러오지 못했습니다.");
        const data = (await res.json()) as { profile: ProfileData };
        if (!cancelled) {
          setProfile(data.profile);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "프로필을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (password && password !== passwordConfirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: profile.phone,
          accountNumber: profile.accountNumber,
          affiliation: profile.affiliation,
          ...(password ? { password } : {}),
        }),
      });

      const data = (await res.json()) as { profile?: ProfileData; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "프로필 저장에 실패했습니다.");
      }

      if (data.profile) setProfile(data.profile);
      setPassword("");
      setPasswordConfirm("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[90vh] w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="profile-modal-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="profile-modal-title"
            className="text-[18px] font-semibold tracking-title-tight text-navy"
          >
            프로필
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {loading ? (
              <p className="py-8 text-center text-[14px] text-muted">불러오는 중...</p>
            ) : profile ? (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-muted">아이디</span>
                  <input value={profile.username} className={inputClass} readOnly disabled />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-muted">현재 모임 입장 코드</span>
                  <input value={session.entryCode} className={inputClass} readOnly disabled />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-muted">연락처</span>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={inputClass}
                    placeholder="010-0000-0000"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-muted">계좌번호</span>
                  <input
                    value={profile.accountNumber}
                    onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                    className={inputClass}
                    placeholder="110-000-000000"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-muted">소속 (선택)</span>
                  <input
                    value={profile.affiliation}
                    onChange={(e) => setProfile({ ...profile, affiliation: e.target.value })}
                    className={inputClass}
                    placeholder="예: 경영학과"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
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
                      placeholder="비밀번호 확인"
                      autoComplete="new-password"
                    />
                  </label>
                </div>
              </>
            ) : (
              <p className="py-8 text-center text-[14px] text-danger">
                {error ?? "프로필을 불러올 수 없습니다."}
              </p>
            )}

            {error && profile && (
              <p className="text-[13px] text-danger">{error}</p>
            )}
            {saved && (
              <p className="text-[13px] text-success">프로필이 저장되었습니다.</p>
            )}
          </div>

          <div className="flex shrink-0 gap-2.5 border-t border-hairline px-6 py-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              닫기
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={!profile || loading || saving}
            >
              {saving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
