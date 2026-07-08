"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AUTH_INPUT_CLASS } from "@/lib/auth-styles";

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  id?: string;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder = "8자 이상",
  autoComplete = "new-password",
  id,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${AUTH_INPUT_CLASS} pr-11`}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition-colors hover:text-ink"
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {visible ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
      </button>
    </div>
  );
}
