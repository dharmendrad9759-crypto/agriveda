import DeficiencySymptomImage from "@/components/nutrients/DeficiencySymptomImage";
import type { NutrientDeficiencyData } from "@/types/deficiency";

export default function DeficiencyHero({ nutrient }: { nutrient: NutrientDeficiencyData }) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-emerald-400/20 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/70 shadow-[0_20px_90px_rgba(16,185,129,0.18)] backdrop-blur-2xl">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="space-y-4 p-6 sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
            <span className="text-lg">{nutrient.icon}</span>
            {nutrient.name}
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {nutrient.symbol} · {nutrient.name}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {nutrient.summary}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Mobility</p>
              <p className="mt-1 font-semibold text-white">{nutrient.mobility}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Severity</p>
              <p className="mt-1 font-semibold text-white">{nutrient.severity}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Importance</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">{nutrient.role}</p>
            </div>
          </div>
        </div>
        <div className="relative min-h-[220px] lg:min-h-full">
          <DeficiencySymptomImage
            nutrient={nutrient.slug}
            alt={`${nutrient.name} deficiency`}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent lg:from-slate-950/50" />
        </div>
      </div>
    </section>
  );
}
