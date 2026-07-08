"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import {
  MOCK_LOGIN_ERROR,
  resolveMockLogin,
  saveMockSession,
} from "@/lib/mock-auth";
import { applySignupProfileOnLogin } from "@/lib/mock-user-store";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth-styles";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const session = resolveMockLogin(email, password);
    if (!session) {
      setError(MOCK_LOGIN_ERROR);
      return;
    }

    saveMockSession(session);
    applySignupProfileOnLogin(session);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-appbg px-4">
      <div className="w-full max-w-sm rounded-card border border-hairline bg-card p-8 shadow-card">
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
          로그인
        </h1>
        <p className="mt-2 text-center text-[14px] text-muted">
          Don Dog에 다시 접속하려면 로그인하세요.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block">
            <span className={AUTH_LABEL_CLASS}>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={AUTH_INPUT_CLASS}
              placeholder="test@dondog.ai"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className={AUTH_LABEL_CLASS}>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className={AUTH_INPUT_CLASS}
              placeholder="비밀번호"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="rounded-xl bg-danger/10 px-3.5 py-2.5 text-[13px] font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full">
            대시보드로 이동
          </Button>
        </form>
      </div>
    </div>
  );
}
