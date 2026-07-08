"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

interface MotionPressableProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "button" | "span";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

/** Micro-interaction wrapper: hover scale 1.03, tap 0.97 */
export default function MotionPressable({
  children,
  className,
  as = "div",
  onClick,
  type = "button",
  disabled,
}: MotionPressableProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      type={as === "button" ? type : undefined}
      disabled={disabled}
      onClick={onClick}
      whileHover={!reduced && !disabled ? { scale: 1.03 } : undefined}
      whileTap={!reduced && !disabled ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
