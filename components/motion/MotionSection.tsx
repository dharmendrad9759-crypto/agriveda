"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion/variants";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Scroll-triggered section entrance */
export default function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={delay}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
}
