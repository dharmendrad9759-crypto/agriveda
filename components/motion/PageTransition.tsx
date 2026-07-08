"use client";

import { motion } from "framer-motion";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { pageTransition } from "@/lib/motion/variants";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const native = typeof window !== "undefined" && isCapacitorNative();

  if (native) {
    return <div className="min-h-0 flex-1">{children}</div>;
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
      className="min-h-0 flex-1"
    >
      {children}
    </motion.div>
  );
}
