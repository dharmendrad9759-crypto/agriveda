import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
}

export default function StatsCard({ label, value, icon, accent }: StatsCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_12px_45px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      <div className={`inline-flex rounded-2xl border border-white/10 bg-white/10 p-3 ${accent}`}>
        {icon}
      </div>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}
