"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

type LoginTab = "accountant" | "member";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<LoginTab>("accountant");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [entryCode, setEntryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        setError(data.error ?? "???? ??????.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("??? ? ??? ??????.");
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
        setError(data.error ?? "??? ??????.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("?? ? ??? ??????.");
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
          ?? ???? ???, ??? ?? ??? ?????.
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
            ?? ???
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
            ??? ??
          </button>
        </div>

        {tab === "accountant" ? (
          <form onSubmit={handleAccountantLogin} className="mt-6 space-y-4">
            <Field label="???">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="ui-input"
                placeholder="admin123"
                autoComplete="username"
                required
              />
            </Field>
            <Field label="????">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ui-input"
                placeholder="????"
                autoComplete="current-password"
                required
              />
            </Field>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "??? ?..." : "???"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMemberEntry} className="mt-6 space-y-4">
            <Field label="?? ?? (10?)">
              <input
                value={entryCode}
                onChange={(e) => setEntryCode(e.target.value.trim())}
                className="ui-input font-mono tracking-widest"
                placeholder="?: 1234567890"
                maxLength={10}
                required
              />
            </Field>
            <p className="text-[12px] leading-relaxed text-muted">
              ?? ????? ?? 10?? ??? ???? ?? ??? ??? ? ????.
            </p>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "?? ?..." : "????"}
            </Button>
          </form>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-[13px] text-danger">{error}</p>
        )}

        <p className="mt-6 text-center text-[13px] text-muted">
          ?? ????????{" "}
          <Link href="/signup" className="font-medium text-navy underline-offset-2 hover:underline">
            ????
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink2">{label}</span>
      {children}
    </label>
  );
}
