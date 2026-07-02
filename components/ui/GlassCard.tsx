import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
  neon?: boolean;
}

export default function GlassCard({ children, className, strong, hover, neon }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl",
        strong ? "agriveda-glass-strong" : "agriveda-glass",
        neon && "agriveda-neon-border",
        hover && "transition-all duration-300 hover:border-emerald-400/30 hover:shadow-[0_0_24px_rgba(0,255,136,0.12)] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
