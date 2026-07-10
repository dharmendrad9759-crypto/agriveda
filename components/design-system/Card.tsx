"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { cn } from "@/lib/cn";
import type { CardVariant } from "@/lib/design/tokens";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
  static?: boolean;
  padding?: boolean;
}

const variantClass: Record<CardVariant, string> = {
  default: "av-card",
  glass: "agriveda-glass rounded-xl",
  inset: "av-card-inset",
};

/** Unified card primitive — replaces DarkCard / GlassCard patterns */
export default function Card({
  children,
  className = "",
  variant = "default",
  hover = false,
  delay = 0,
  onClick,
  static: isStatic = false,
  padding = true,
}: CardProps) {
  const reduced = useReducedMotion();
  const base = cn(
    variantClass[variant],
    hover && variant === "default" && "av-card-hover",
    !padding && "!p-0",
    className
  );

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
