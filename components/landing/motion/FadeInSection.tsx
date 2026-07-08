"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type FadeInSectionProps = HTMLMotionProps<"section"> & {
  children: ReactNode;
  delay?: number;
};

export default function FadeInSection({
  children,
  delay = 0,
  className = "",
  ...props
}: FadeInSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
