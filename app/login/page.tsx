"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth-styles";

type LoginTab = "accountant" | "member";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<LoginTab>("accountant");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [entryCode, setEntryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch("/api/auth/logout", { method: "POST" });
  }, []);

  const handleAccountantLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "로그인에 실패했습니다.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "입장에 실패했습니다.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("입장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-appbg px-4 py-10">
      <div className="w-full max-w-md rounded-card border border-hairline bg-card p-8 shadow-card">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/dondog-logo.png"
            alt="Don Dog"
            width={453}
            height={428}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <h1 className="text-center text-[22px] font-semibold tracking-title-tight text-navy">
          Don Dog
        </h1>
        <p className="mt-2 text-center text-[14px] text-muted">
          회계 담당자는 로그인, 부원은 입장 코드로 접속하세요.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-btn bg-surface p-1 ring-1 ring-hairline">
          <button
            type="button"
            onClick={() => {
              setTab("accountant");
              setError(null);
            }}
            className={`rounded-btn px-3 py-2 text-[13px] font-medium transition-colors ${
              tab === "accountant" ? "bg-card text-navy shadow-card" : "text-muted"
            }`}
          >
            회계 담당자
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("member");
              setError(null);
            }}
            className={`rounded-btn px-3 py-2 text-[13px] font-medium transition-colors ${
              tab === "member" ? "bg-card text-navy shadow-card" : "text-muted"
            }`}
          >
            동아리 부원
          </button>
        </div>

        {tab === "accountant" ? (
          <form onSubmit={handleAccountantLogin} className="mt-6 space-y-4">
            <Field label="아이디">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={AUTH_INPUT_CLASS}
                placeholder="admin123"
                autoComplete="username"
                required
              />
            </Field>
            <Field label="비밀번호">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={AUTH_INPUT_CLASS}
                placeholder="비밀번호"
                autoComplete="current-password"
                required
              />
            </Field>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMemberEntry} className="mt-6 space-y-4">
            <Field label="입장 코드 (10자)">
              <input
                value={entryCode}
                onChange={(e) => setEntryCode(e.target.value.trim())}
                className={`${AUTH_INPUT_CLASS} font-mono tracking-widest`}
                placeholder="예: 1234567890"
                maxLength={10}
                required
              />
            </Field>
            <p className="text-[12px] leading-relaxed text-muted">
              회계 담당자에게 받은 10자리 코드를 입력하면 회계 현황을 조회할 수 있습니다.
            </p>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "입장 중..." : "입장하기"}
            </Button>
          </form>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-[13px] text-danger">{error}</p>
        )}

        <p className="mt-6 text-center text-[13px] text-muted">
          회계 담당자이신가요?{" "}
          <Link href="/signup" className="font-medium text-navy underline-offset-2 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={`mb-1.5 block ${AUTH_LABEL_CLASS}`}>{label}</span>
      {children}
    </label>
  );
}
