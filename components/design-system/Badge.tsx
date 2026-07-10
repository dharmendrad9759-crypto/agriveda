import { cn } from "@/lib/cn";
import type { BadgeVariant } from "@/lib/design/tokens";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  high: "av-badge av-badge-high",
  medium: "av-badge av-badge-medium",
  low: "av-badge av-badge-low",
  neutral: "av-badge av-badge-neutral",
  info: "av-badge border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-300",
  success: "av-badge border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  warning: "av-badge border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return <span className={cn(variantClass[variant], className)}>{children}</span>;
}
