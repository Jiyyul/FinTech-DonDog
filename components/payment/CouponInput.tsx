"use client";

import { useState } from "react";
import Button from "@/components/common/Button";

export default function CouponInput() {
  const [code, setCode] = useState("");

  const handleApply = () => {
    // TODO: Payment API 연결 — 쿠폰 검증
    if (!code.trim()) return;
  };

  return (
    <div>
      <label htmlFor="payment-coupon" className="text-[13px] font-medium text-ink">
        쿠폰 코드
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="payment-coupon"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="쿠폰 코드 입력"
          className="h-11 min-w-0 flex-1 rounded-btn border border-hairline bg-card px-3.5 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.1)]"
        />
        <Button
          type="button"
          variant="secondary"
          className="h-11 shrink-0 px-4"
          onClick={handleApply}
        >
          적용
        </Button>
      </div>
    </div>
  );
}
