"use client";

import { motion, useTransform } from "framer-motion";
import type { HeroParallaxMotion } from "@/components/landing/hooks/useHeroParallax";

type ParallaxLayerProps = HeroParallaxMotion & {
  depth: number;
  className: string;
};

function ParallaxLayer({ depth, springX, springY, className }: ParallaxLayerProps) {
  const x = useTransform(springX, (v) => v * depth);
  const y = useTransform(springY, (v) => v * depth);

  return (
    <motion.div
      aria-hidden
      className={`absolute will-change-transform ${className}`}
      style={{ x, y }}
    />
  );
}

type HeroParallaxBackgroundProps = HeroParallaxMotion;

export default function HeroParallaxBackground({
  springX,
  springY,
}: HeroParallaxBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-appbg/80 via-transparent to-appbg/40" />

      <ParallaxLayer
        depth={8}
        springX={springX}
        springY={springY}
        className="-left-24 top-[5%] h-[420px] w-[420px] rounded-full bg-[#93B2F8]/[0.08] blur-[100px]"
      />
      <ParallaxLayer
        depth={15}
        springX={springX}
        springY={springY}
        className="-right-20 top-[25%] h-[380px] w-[380px] rounded-full bg-[#FBEDB0]/[0.10] blur-[90px]"
      />
      <ParallaxLayer
        depth={20}
        springX={springX}
        springY={springY}
        className="bottom-[10%] left-[20%] h-[340px] w-[340px] rounded-full bg-[#0A1680]/[0.06] blur-[110px]"
      />

      <div className="absolute right-[15%] top-[12%] h-[240px] w-[240px] rounded-full bg-[#93B2F8]/[0.06] blur-[80px]" />
      <div className="absolute bottom-[20%] right-[30%] h-[200px] w-[200px] rounded-full bg-[#FBEDB0]/[0.08] blur-[70px]" />

      <div
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(147,178,248,0.07) 0%, rgba(252,253,255,0) 70%)",
        }}
      />
    </div>
  );
}
