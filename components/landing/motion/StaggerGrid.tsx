"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0, 0, 0.2, 1] },
  },
};

type StaggerGridProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerGrid({ children, className = "" }: StaggerGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
