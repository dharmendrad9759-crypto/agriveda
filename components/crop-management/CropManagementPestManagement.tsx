import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { SciBadge } from "@/components/ui/FuturisticPanel";
import { ShieldAlert, Bug } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementPestManagement({ profile }: Props) {
  return (
    <FuturisticPanel
      title="Pest Management"
      subtitle="IRAC-classified insecticide strategies"
      icon={Bug}
      glow
    >
      <div className="space-y-5">
        {profile.pestManagement.map((pest) => (
          <article
            key={pest.pestName}
            className="overflow-hidden rounded-2xl border border-white/8 bg-black/30"
          >
            <div className="border-b border-white/5 bg-gradient-to-r from-red-500/5 to-transparent px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">{pest.pestName}</h3>
                <SciBadge variant="red">{pest.iracGroup}</SciBadge>
              </div>
              <p className="mt-0.5 text-xs italic text-slate-400">{pest.scientificName}</p>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Identification</p>
                <p className="mt-1 text-sm text-slate-300">{pest.identification}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Economic Threshold Level (ETL)
                </p>
                <p className="mt-1 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm font-semibold text-amber-200">
                  {pest.etl}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Symptoms</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {pest.symptoms.map((s) => (
                    <li key={s} className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
                    Biological Control
                  </p>
                  <ul className="mt-1 space-y-1">
                    {pest.biologicalControl.map((b) => (
                      <li key={b} className="text-xs text-emerald-200/80">• {b}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/70">
                    Chemical Control
                  </p>
                  <ul className="mt-1 space-y-1">
                    {pest.chemicalControl.map((c) => (
                      <li key={c} className="text-xs text-red-200/80">• {c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Recommended Chemistry
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {pest.activeIngredient} · {pest.dose}
                </p>
                <p className="mt-0.5 text-[10px] text-emerald-400/60">
                  IRAC Group {pest.iracGroup} — Rotate modes of action to delay resistance
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </FuturisticPanel>
  );
}

export function CropManagementCropProtection({ profile }: Props) {
  return (
    <div className="space-y-5">
      <CropManagementPestManagement profile={profile} />
      <CropManagementDiseaseSection profile={profile} />
    </div>
  );
}

function CropManagementDiseaseSection({ profile }: { profile: CropManagementProfile }) {
  return (
    <FuturisticPanel
      title="Disease Management"
      subtitle="Pathogen biology · FRAC fungicide rotation"
      icon={ShieldAlert}
      glow
    >
      <div className="space-y-5">
        {profile.diseaseManagement.map((disease) => (
          <article
            key={disease.diseaseName}
            className="overflow-hidden rounded-2xl border border-white/8 bg-black/30"
          >
            <div className="border-b border-white/5 bg-gradient-to-r from-purple-500/5 to-transparent px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">{disease.diseaseName}</h3>
                <SciBadge variant="cyan">{disease.fracGroup}</SciBadge>
                <SciBadge variant="amber">{disease.type}</SciBadge>
              </div>
              <p className="mt-0.5 text-xs italic text-purple-300/80">
                Pathogen: {disease.pathogen}
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Symptoms</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {disease.symptoms.map((s) => (
                    <li key={s} className="rounded-lg border border-purple-500/15 bg-purple-500/5 px-2.5 py-1 text-xs text-purple-200">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Favourable Conditions
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {disease.favourableConditions.join(" · ")}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
                  Integrated Management (IPM)
                </p>
                <ul className="mt-1 space-y-1">
                  {disease.integratedManagement.map((m) => (
                    <li key={m} className="text-xs text-emerald-200/80">• {m}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Fungicide Protocol
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {disease.activeIngredient} · {disease.dose}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  FRAC {disease.fracGroup} · PHI: {disease.waitingPeriod}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </FuturisticPanel>
  );
}
