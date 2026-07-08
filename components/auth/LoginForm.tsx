"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import {
  MOCK_LOGIN_ERROR,
  resolveMockLogin,
  saveMockSession,
} from "@/lib/mock-auth";
import { applySignupProfileOnLogin } from "@/lib/mock-user-store";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth-styles";

type LoginFormProps = {
  onSwitchToSignup: () => void;
  onSuccess?: () => void;
};

export default function LoginForm({ onSwitchToSignup, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const completeLogin = (email: string, password: string) => {
    const session = resolveMockLogin(email, password);
    if (!session) {
      setError(MOCK_LOGIN_ERROR);
      return;
    }

    saveMockSession(session);
    applySignupProfileOnLogin(session);
    onSuccess?.();
    router.push("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    completeLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="name@school.ac.kr"
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
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p className="rounded-xl bg-danger/10 px-3.5 py-2.5 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" className="mt-2 w-full">
        로그인
      </Button>

      <p className="pt-1 text-center text-[13px] text-ink2">
        계정이 없으신가요?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-brand transition-colors hover:text-brand-hover"
        >
          회원가입
        </button>
      </p>
    </form>
  );
}
