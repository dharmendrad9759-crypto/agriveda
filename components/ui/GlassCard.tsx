"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion/variants";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
  neon?: boolean;
  /** Stagger index for entrance animation */
  motionIndex?: number;
}

export default function GlassCard({
  children,
  className,
  strong,
  hover,
  neon,
  motionIndex = 0,
}: GlassCardProps) {
  const reduced = useReducedMotion();

  const baseClass = cn(
    "rounded-xl",
    strong ? "agriveda-glass-strong" : "agriveda-glass",
    neon && "agriveda-neon-border",
    hover &&
      "transition-all duration-200 ease-out hover:border-emerald-400/30 hover:shadow-[0_0_24px_rgba(0,255,136,0.12)] hover:-translate-y-0.5",
    className
  );

  if (reduced) {
    return <div className={baseClass}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={motionIndex}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={baseClass}
    >
      {children}
    </motion.div>
  );
}
