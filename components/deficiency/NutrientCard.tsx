import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import type { NutrientDeficiencyData } from "@/types/deficiency";

const severityClasses: Record<string, string> = {
  Critical: "border-red-500/30 bg-red-500/10 text-red-200",
  High: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  Moderate: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  Low: "border-sky-500/30 bg-sky-500/10 text-sky-200",
};

export default function NutrientCard({ nutrient }: { nutrient: NutrientDeficiencyData }) {
  return (
    <Link
      href={`/deficiencies/${nutrient.slug}`}
      className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-[0_10px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-slate-900/90"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-2xl text-emerald-300 shadow-inner">
            {nutrient.icon}
          </div>
          <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${severityClasses[nutrient.severity]}`}>
            {nutrient.severity}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-white">{nutrient.name}</h3>
            <span className="text-sm font-medium text-slate-400">{nutrient.symbol}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">{nutrient.summary}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            <Leaf className="h-3.5 w-3.5 text-emerald-300" />
            Primary function
          </div>
          <p className="mt-1 text-sm font-medium text-slate-200">{nutrient.role}</p>
        </div>

        <div className="flex items-center justify-between pt-1 text-sm text-slate-400">
          <span>{nutrient.cropSpecificData.length} crop guides</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300 transition group-hover:translate-x-1">
            Explore
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
