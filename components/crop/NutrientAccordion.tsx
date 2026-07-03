import type { NutrientDeficiency } from "@/types/crop-management";

interface NutrientAccordionProps {
  deficiencies: NutrientDeficiency[];
}

export default function NutrientAccordion({ deficiencies }: NutrientAccordionProps) {
  return (
    <div className="space-y-3">
      {deficiencies.map((item) => (
        <details key={item.name} className="group overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-sm text-slate-400">{item.role}</p>
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              View
            </span>
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Deficiency symptoms</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {item.deficiencySymptoms.map((symptom) => (
                  <li key={symptom} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">{symptom}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Excess and management</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {item.excessSymptoms.map((symptom) => (
                  <li key={symptom} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">{symptom}</li>
                ))}
                {item.management.map((step) => (
                  <li key={step} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-100">{step}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-[20px] border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Recommended fertilizers</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.recommendedFertilizers.map((fertilizer) => (
                <span key={fertilizer} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                  {fertilizer}
                </span>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
