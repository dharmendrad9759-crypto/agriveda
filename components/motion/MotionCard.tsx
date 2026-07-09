"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion/variants";

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  layout?: boolean;
  onClick?: () => void;
}

export default function MotionCard({
  children,
  className,
  delay = 0,
  hover = true,
  layout = false,
  onClick,
}: MotionCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout={layout}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={
        hover && !reduced
          ? {
              y: -2,
              transition: { duration: 0.2, ease: "easeOut" },
            }
          : undefined
      }
      onClick={onClick}
      className={cn(
        "av-card",
        hover && "av-card-hover",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
