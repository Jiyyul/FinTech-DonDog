"use client";

import Image from "next/image";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { useAuth } from "@/components/auth/AuthProvider";

export default function CTASection() {
  const { openAuth } = useAuth();
  return (
    <FadeInSection className="landing-section">
      <div className="overflow-hidden rounded-card border border-hairline bg-card shadow-card">
        <div className="grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12">
          <div className="flex items-center gap-6">
            <div className="hidden shrink-0 sm:block">
              <Image
                src="/logo/dondog-logo.png"
                alt="Don Dog 캐릭터"
                width={453}
                height={428}
                className="h-24 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-snug tracking-title-tight text-navy">
                회계는 돈독에게 맡기고
                <br />
                동아리 활동에 집중하세요.
              </h2>
              <p className="mt-3 text-[15px] text-ink2">
                지금 바로 무료로 시작하고, AI 회계의 차이를 경험해보세요.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openAuth("signup")}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-btn bg-brand px-8 text-[15px] font-semibold text-inverse shadow-[0_1px_2px_rgba(10,22,128,0.12)] transition-all duration-200 ease-premium hover:scale-[1.04] hover:bg-brand-hover active:scale-[0.99]"
          >
            무료 시작하기
          </button>
        </div>
      </div>
    </FadeInSection>
  );
}
