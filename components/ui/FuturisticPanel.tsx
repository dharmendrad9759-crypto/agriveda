import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface FuturisticPanelProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconEmoji?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function FuturisticPanel({
  title,
  subtitle,
  icon: Icon,
  iconEmoji,
  children,
  className,
  glow,
}: FuturisticPanelProps) {
  return (
    <section
      className={cn(
        "agriveda-glass-strong overflow-hidden rounded-3xl",
        glow && "agriveda-neon-border",
        className
      )}
    >
      <div className="border-b border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-transparent px-5 py-4">
        <div className="flex items-center gap-3">
          {(Icon || iconEmoji) && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-lg ring-1 ring-emerald-500/20">
              {Icon ? <Icon className="h-5 w-5 text-emerald-400" /> : iconEmoji}
            </div>
          )}
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-white">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-[11px] font-medium text-emerald-400/70">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

interface DataRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function DataRow({ label, value, highlight }: DataRowProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3",
        highlight
          ? "border-emerald-500/25 bg-emerald-500/5"
          : "border-white/5 bg-black/20"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/80">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-relaxed text-slate-200">{value}</p>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "cyan" | "amber" | "red";
}

export function SciBadge({ children, variant = "green" }: BadgeProps) {
  const colors = {
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    red: "border-red-500/30 bg-red-500/10 text-red-300",
  };
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", colors[variant])}>
      {children}
    </span>
  );
}
