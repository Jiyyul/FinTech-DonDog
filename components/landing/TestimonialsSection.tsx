"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "@/lib/landing-data";
import FadeInSection from "@/components/landing/motion/FadeInSection";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <FadeInSection className="landing-section">
      <div className="mx-auto max-w-2xl text-center">
        <p className="dash-section-label">후기</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-title-tight text-navy">
          동아리 총무부가 말하는 돈독
        </h2>
      </div>

      <div
        className="relative mx-auto mt-14 max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-card border border-hairline bg-card p-8 shadow-card sm:p-10"
          >
            <Stars count={TESTIMONIALS[activeIndex].rating} />
            <p className="mt-6 text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-ink">
              &ldquo;{TESTIMONIALS[activeIndex].quote}&rdquo;
            </p>
            <div className="mt-8 border-t border-hairline pt-6">
              <p className="font-semibold text-navy">{TESTIMONIALS[activeIndex].club}</p>
              <p className="mt-1 text-sm text-muted">{TESTIMONIALS[activeIndex].school}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-brand" : "w-2 bg-hairline hover:bg-muted"
              }`}
              aria-label={`후기 ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <div
            key={item.club}
            className="rounded-card border border-hairline bg-card p-7 shadow-card transition-all duration-300 ease-premium hover:-translate-y-2 hover:shadow-card-hover"
          >
            <Stars count={item.rating} />
            <p className="mt-4 text-[15px] leading-relaxed text-ink2">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="mt-6">
              <p className="font-semibold text-navy">{item.club}</p>
              <p className="mt-1 text-sm text-muted">{item.school}</p>
            </div>
          </div>
        ))}
      </div>
    </FadeInSection>
  );
}
