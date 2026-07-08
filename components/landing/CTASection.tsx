"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { useAuth } from "@/components/auth/AuthProvider";

export default function CTASection() {
  const { openAuth } = useAuth();

  return (
    <FadeInSection className="landing-section !py-[clamp(4rem,7vw,5.5rem)]">
      <div className="relative mx-auto w-full max-w-[640px]">
        <div
          className="pointer-events-none absolute left-1/2 top-[45%] h-[220px] w-[min(100%,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(147,178,248,0.18)_0%,rgba(147,178,248,0)_70%)] blur-2xl"
          aria-hidden
        />

        <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-card border border-hairline bg-gradient-to-b from-[#FCFDFF] to-[#FAFBFF] px-8 py-10 shadow-[0_4px_20px_rgba(16,24,40,0.05)] sm:min-h-[320px] sm:px-10 sm:py-11">
          <div className="relative flex w-full flex-col items-center text-center">
            <Image
              src="/logo/dondog-logo.png"
              alt="Don Dog"
              width={453}
              height={428}
              className="h-12 w-auto object-contain opacity-90 sm:h-14"
            />

            <h2 className="mt-4 max-w-[520px] text-[clamp(1.5rem,3vw,2.35rem)] font-extrabold leading-[1.22] tracking-title-tight text-navy">
              회계는 돈독에게 맡기고
              <br />
              동아리 활동에 집중하세요.
            </h2>

            <p className="mt-3.5 max-w-[440px] text-[clamp(14px,1.5vw,16px)] leading-relaxed text-[#4B5563]">
              AI가 반복적인 회계 업무를 대신 관리하고
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              회원들과 투명하게 회계를 공유할 수 있습니다.
            </p>

            <button
              type="button"
              onClick={() => openAuth("signup")}
              className="group mt-6 inline-flex h-[58px] w-[min(100%,18rem)] items-center justify-center gap-2.5 rounded-btn bg-brand px-8 text-[16px] font-semibold text-inverse shadow-[0_2px_10px_rgba(10,22,128,0.18)] transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_10px_28px_rgba(10,22,128,0.24)] active:translate-y-0 sm:w-[280px]"
            >
              무료로 시작하기
              <ArrowRight
                size={18}
                strokeWidth={2}
                className="transition-transform duration-200 ease-premium group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
