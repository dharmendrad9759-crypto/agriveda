"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import type { ReactNode } from "react";

interface DarkCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
  /** Skip enter animation */
  static?: boolean;
}

/** Theme-aware panel card — uses enterprise design tokens */
export default function DarkCard({
  children,
  className = "",
  hover = false,
  delay = 0,
  onClick,
  static: isStatic = false,
}: DarkCardProps) {
  const reduced = useReducedMotion();
  const base = `av-card ${hover ? "av-card-hover" : ""} ${className}`;

  if (reduced || isStatic) {
    return (
      <div onClick={onClick} className={base}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: MOTION.normal, delay: delay * MOTION.stagger, ease: EASE_OUT }}
      onClick={onClick}
      className={base}
    >
      {children}
    </motion.div>
  );
}
