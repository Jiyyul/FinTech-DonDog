"use client";

import { useMemo, useState } from "react";
import Button from "@/components/common/Button";
import PasswordInput from "@/components/auth/PasswordInput";
import SignupFieldHint from "@/components/auth/SignupFieldHint";
import SignupPlanPicker from "@/components/auth/SignupPlanPicker";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePayment } from "@/components/payment/PaymentProvider";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/lib/auth-styles";
import { saveSignupProfile } from "@/lib/mock-user-store";
import { isPaymentPlanId } from "@/lib/payment-data";
import {
  isEmailValid,
  isNameValid,
  isPasswordValid,
  isSignupFormValid,
} from "@/lib/signup-validation";

type SignupFormProps = {
  onSwitchToLogin: () => void;
  onSignupComplete: () => void;
};

export default function SignupForm({ onSwitchToLogin, onSignupComplete }: SignupFormProps) {
  const { closeAuth } = useAuth();
  const { openPayment } = usePayment();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => isSignupFormValid(name, email, password, agreed),
    [name, email, password, agreed]
  );

  const completeSignup = (planId: string) => {
    saveSignupProfile(email, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      planId,
    });
    onSignupComplete();
  };

  const handleFreeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    completeSignup("free");
  };

  const handlePlanSignup = () => {
    if (!canSubmit || !selectedPlanId) return;

    saveSignupProfile(email, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      planId: selectedPlanId,
    });

    if (isPaymentPlanId(selectedPlanId)) {
      closeAuth();
      openPayment(selectedPlanId);
      return;
    }

    onSignupComplete();
  };

  if (showPlans) {
    return (
      <SignupPlanPicker
        selectedPlanId={selectedPlanId}
        onSelect={setSelectedPlanId}
        onConfirm={handlePlanSignup}
        onBack={() => setShowPlans(false)}
        canConfirm={canSubmit}
      />
    );
  }

  return (
    <form onSubmit={handleFreeSubmit} className="space-y-3.5">
      <label className="block">
        <span className={AUTH_LABEL_CLASS}>이름</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={AUTH_INPUT_CLASS}
          placeholder="홍길동"
          autoComplete="name"
        />
        <SignupFieldHint show={name.length > 0 && isNameValid(name)} message="이름 입력완료" />
      </label>

      <label className="block">
        <span className={AUTH_LABEL_CLASS}>이메일</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={AUTH_INPUT_CLASS}
          placeholder="name@school.ac.kr"
          autoComplete="email"
        />
        <SignupFieldHint
          show={email.length > 0 && isEmailValid(email)}
          message="올바른 이메일입니다."
        />
      </label>

      <label className="block">
        <span className={AUTH_LABEL_CLASS}>비밀번호</span>
        <PasswordInput value={password} onChange={setPassword} />
        <SignupFieldHint
          show={password.length > 0 && isPasswordValid(password)}
          message="비밀번호 8자 이상입니다."
        />
      </label>

      <label className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-hairline text-brand focus:ring-brand"
        />
        <span className="text-[12px] leading-relaxed text-ink2">
          <span className="font-medium text-ink">서비스 이용약관</span> 및{" "}
          <span className="font-medium text-ink">개인정보 처리방침</span>에 동의합니다.
        </span>
      </label>

      <div className="space-y-2.5 pt-1">
        <Button type="submit" variant="primary" className="w-full" disabled={!canSubmit}>
          무료 시작하기
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => setShowPlans(true)}
        >
          요금제 가입하기
        </Button>
      </div>

      <p className="text-center text-[13px] text-ink2">
        이미 계정이 있으신가요?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-brand transition-colors hover:text-brand-hover"
        >
          로그인
        </button>
      </p>
    </form>
  );
}
