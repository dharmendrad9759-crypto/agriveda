import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { DataRow } from "@/components/ui/FuturisticPanel";
import { Sprout } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementSowingTime({ profile }: Props) {
  return (
    <FuturisticPanel
      title="Sowing Guide"
      subtitle={`${profile.scientificName} · Establishment protocol`}
      icon={Sprout}
      glow
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <DataRow label="Seed rate (per acre)" value={profile.seedRate} highlight />
          <DataRow label="Spacing" value={profile.spacing} highlight />
          <DataRow label="Weather need" value={profile.climate} />
          <DataRow label="Soil" value={profile.soil} />
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            Sowing Window & Timing
          </p>
          <ul className="space-y-2">
            {profile.sowingTime.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-2xl border border-white/5 bg-black/25 px-4 py-3 text-sm text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400 agriveda-glow-dot" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            Seed Treatment Protocol
          </p>
          <ul className="space-y-2">
            {profile.seedTreatment.map((item) => (
              <li key={item} className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-100/90">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {profile.transplanting.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
              Transplanting / Planting Method
            </p>
            <ul className="space-y-2">
              {profile.transplanting.map((item) => (
                <li key={item} className="rounded-2xl border border-white/5 bg-black/25 px-4 py-3 text-sm text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </FuturisticPanel>
  );
}
