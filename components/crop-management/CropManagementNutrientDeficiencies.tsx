import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { SciBadge } from "@/components/ui/FuturisticPanel";
import { Microscope } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

const DEFICIENCY_COLORS: Record<string, string> = {
  Nitrogen: "border-l-yellow-400",
  Phosphorus: "border-l-purple-400",
  Potassium: "border-l-orange-400",
  Magnesium: "border-l-green-400",
  Zinc: "border-l-blue-400",
  Boron: "border-l-pink-400",
  Calcium: "border-l-slate-300",
  Iron: "border-l-red-400",
};

export default function CropManagementNutrientDeficiencies({ profile }: Props) {
  return (
    <FuturisticPanel
      title="Nutrient Deficiency"
      subtitle="Macro & micro-nutrient symptom differential diagnosis"
      icon={Microscope}
      glow
    >
      <div className="space-y-4">
        {profile.nutrientDeficiencies.map((item) => (
          <details
            key={item.name}
            className={`group overflow-hidden rounded-2xl border border-white/8 border-l-4 bg-black/25 ${DEFICIENCY_COLORS[item.name] ?? "border-l-emerald-400"}`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-white">{item.name}</p>
                  <SciBadge>{item.name === "Nitrogen" || item.name === "Phosphorus" || item.name === "Potassium" ? "Macro" : "Micro"}</SciBadge>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{item.role}</p>
              </div>
              <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400 group-open:hidden">
                EXPAND
              </span>
            </summary>

            <div className="border-t border-white/5 px-4 pb-4 pt-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-yellow-500/15 bg-yellow-500/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                    Deficiency Symptoms
                  </p>
                  <ul className="mt-2 space-y-1">
                    {item.deficiencySymptoms.map((s) => (
                      <li key={s} className="text-xs text-yellow-100/80">• {s}</li>
                    ))}
                  </ul>
                  {item.name === "Nitrogen" && (
                    <p className="mt-2 text-[10px] italic text-yellow-400/60">
                      N deficiency: uniform chlorosis on OLDER leaves (mobile nutrient)
                    </p>
                  )}
                  {item.name === "Magnesium" && (
                    <p className="mt-2 text-[10px] italic text-yellow-400/60">
                      Mg deficiency: interveinal chlorosis on OLDER leaves (vs N: whole leaf)
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    Excess Symptoms
                  </p>
                  <ul className="mt-2 space-y-1">
                    {item.excessSymptoms.map((s) => (
                      <li key={s} className="text-xs text-red-100/80">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
                  Corrective Management
                </p>
                <ul className="mt-1 space-y-1">
                  {item.management.map((m) => (
                    <li key={m} className="text-xs text-emerald-200/80">• {m}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.recommendedFertilizers.map((f) => (
                  <span
                    key={f}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 text-xs font-semibold text-emerald-200"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </FuturisticPanel>
  );
}
