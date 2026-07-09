"use client";

import { motion } from "framer-motion";
import Badge from "@/components/common/Badge";
import DashboardMockup from "@/components/landing/DashboardMockup";
import HeroParallaxBackground from "@/components/landing/HeroParallaxBackground";
import { useHeroParallax } from "@/components/landing/hooks/useHeroParallax";
import { useAuth } from "@/components/auth/AuthProvider";

export default function HeroSection() {
  const { springX, springY, onMouseMove, onMouseLeave } = useHeroParallax();
  const { openAuth } = useAuth();

  return (
    <section
      className="relative overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <HeroParallaxBackground springX={springX} springY={springY} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-24 pt-32 min-[1200px]:px-8 min-[1200px]:pb-32 min-[1200px]:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Badge variant="navy" className="mb-6">
              AI 기반 동아리 회계 관리
            </Badge>

            <h1 className="font-bold leading-[1.15] tracking-title-tight text-ink">
              <span className="block text-[clamp(1.125rem,2vw,1.375rem)] text-ink2">
                AI가 관리하는 동아리 회계
              </span>
              <span className="mt-3 block text-[clamp(2rem,4.5vw,3.25rem)]">
                회계는 <span className="text-brand">돈독</span>에게 맡기고,
                <br />
                동아리는 더 <span className="text-brand">돈독</span>하게.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[clamp(15px,1.6vw,17px)] leading-relaxed text-ink2">
              계좌와 카드를 연결하면 AI가 거래를 자동으로 분류하고,
              <br className="hidden sm:block" />
              회계장부 작성부터 이상거래 탐지, 실시간 회계 공개까지 한 번에.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openAuth("signup")}
                className="inline-flex h-12 items-center justify-center rounded-btn bg-brand px-6 text-[15px] font-semibold text-inverse shadow-[0_1px_2px_rgba(10,22,128,0.12)] transition-all duration-200 ease-premium hover:scale-[1.04] hover:bg-brand-hover active:scale-[0.99]"
              >
                무료 시작하기
              </button>
              <a
                href="#pricing"
                className="inline-flex h-12 items-center justify-center rounded-btn border border-hairline bg-card px-6 text-[15px] font-semibold text-ink transition-all duration-200 ease-premium hover:scale-[1.04] hover:bg-surface"
              >
                요금제 둘러보기
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
