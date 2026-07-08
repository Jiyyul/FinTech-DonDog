"use client";

import { useEffect, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

const SPRING = { stiffness: 50, damping: 26, mass: 0.4 };

export function useHeroParallax() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setEnabled(mqDesktop.matches && !mqMotion.matches);
    update();

    mqDesktop.addEventListener("change", update);
    mqMotion.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
    };
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enabled || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return {
    springX,
    springY,
    onMouseMove,
    onMouseLeave,
    active: enabled && !prefersReducedMotion,
  };
}

export type HeroParallaxMotion = {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
};
