"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion/variants";
import Card from "@/components/design-system/Card";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
  neon?: boolean;
  motionIndex?: number;
}

/** Glass surface — delegates to unified Card primitive */
export default function GlassCard({
  children,
  className,
  strong: _strong,
  hover = false,
  neon,
  motionIndex = 0,
}: GlassCardProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Card variant="glass" hover={hover} className={cn(neon && "agriveda-neon-border", className)} static>
        {children}
      </Card>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={motionIndex}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
    >
      <Card
        variant="glass"
        hover={hover}
        static
        className={cn(neon && "agriveda-neon-border", className)}
      >
        {children}
      </Card>
    </motion.div>
  );
}
