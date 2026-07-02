import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  hover?: boolean;
}

export default function GlassCard({ children, className, strong, hover }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl",
        strong ? "agriveda-glass-strong" : "agriveda-glass",
        hover && "transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/10 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
