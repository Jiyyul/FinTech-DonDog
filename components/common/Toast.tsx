"use client";

import { AnimatePresence, motion } from "framer-motion";

type ToastProps = {
  message: string | null;
};

export default function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-[110] w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 rounded-btn border border-hairline bg-card px-4 py-3.5 text-center text-[14px] font-medium text-ink shadow-[0_12px_40px_rgba(10,22,128,0.12)]"
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
