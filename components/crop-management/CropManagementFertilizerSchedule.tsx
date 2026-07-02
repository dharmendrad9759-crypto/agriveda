import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { DataRow, SciBadge } from "@/components/ui/FuturisticPanel";
import { FlaskConical } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

const STAGE_NPK: Record<string, { n: string; p: string; k: string; note: string }> = {
  potato: {
    n: "120 kg/ha",
    p: "80 kg/ha",
    k: "120 kg/ha",
    note: "Basal NPK at planting; split N at 25 & 45 DAS; K critical for tuber bulking (45–75 DAS)",
  },
  paddy: {
    n: "120 kg/ha",
    p: "60 kg/ha",
    k: "60 kg/ha",
    note: "Basal at transplanting; 1st top-dress 25 DAS; 2nd top-dress 45 DAS (tillering)",
  },
  tomato: {
    n: "120 kg/ha",
    p: "80 kg/ha",
    k: "80 kg/ha",
    note: "Basal before transplant; split N at vegetative & flowering; Ca + B foliar at fruit set",
  },
};

export default function CropManagementFertilizerSchedule({ profile }: Props) {
  const npk = STAGE_NPK[profile.slug] ?? {
    n: "As per soil test",
    p: "As per soil test",
    k: "As per soil test",
    note: "Follow stage-wise split application based on crop demand curve",
  };

  return (
    <FuturisticPanel
      title="Fertilizer Schedule"
      subtitle="NPK ratios · Stage-wise top-dressing protocol"
      icon={FlaskConical}
      glow
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Nitrogen</p>
            <p className="mt-1 text-lg font-black text-white">{npk.n}</p>
            <SciBadge variant="green">Basal + Split</SciBadge>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Phosphorus</p>
            <p className="mt-1 text-lg font-black text-white">{npk.p}</p>
            <SciBadge variant="cyan">Basal Only</SciBadge>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Potassium</p>
            <p className="mt-1 text-lg font-black text-white">{npk.k}</p>
            <SciBadge variant="amber">Bulking Stage</SciBadge>
          </div>
        </div>

        <DataRow label="Stage-wise Strategy" value={npk.note} highlight />

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            Application Schedule
          </p>
          <ul className="space-y-2">
            {profile.fertilizerSchedule.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/25 px-4 py-3"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-[10px] font-black text-emerald-400">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {profile.micronutrients.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
              Micronutrient Supplementation
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.micronutrients.map((m) => (
                <span
                  key={m}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-xs font-semibold text-emerald-200"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </FuturisticPanel>
  );
}
