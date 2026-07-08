"use client";

import Image from "next/image";
import Button from "@/components/common/Button";

type EmptyDashboardProps = {
  onCreateClub: () => void;
};

export default function EmptyDashboard({ onCreateClub }: EmptyDashboardProps) {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-brand-subtle/60 ring-1 ring-brand/10">
          <Image
            src="/logo/dondog-logo.png"
            alt="Don Dog"
            width={453}
            height={428}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        <h1 className="text-[clamp(1.5rem,3vw,1.875rem)] font-bold tracking-title-tight text-navy">
          아직 참여 중인 모임이 없습니다.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-ink2">
          새로운 모임을 만들고 AI 회계 관리를 시작해보세요.
        </p>

        <Button
          type="button"
          variant="primary"
          className="mt-8 min-w-[200px]"
          onClick={onCreateClub}
        >
          새 모임 시작하기
        </Button>
      </div>
    </div>
  );
}
