"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";

export default function ReviewCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex flex-col rounded-card border border-hairline bg-card p-5.5 shadow-card">
      <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-warning">
        <AlertTriangle size={18} />
        <span>확인 필요 1건</span>
      </div>
      <p className="flex-1 text-[13px] leading-relaxed text-ink2">
        AI가 검토가 필요한 거래를 발견했습니다. 회칙 기준 공동 승인 여부를
        확인해주세요.
      </p>
      <Button
        variant="secondary"
        onClick={onOpen}
        className="mt-3.5 h-10 w-full"
        icon={<ArrowRight size={14} />}
      >
        검토하러 가기
      </Button>
    </div>
  );
}
