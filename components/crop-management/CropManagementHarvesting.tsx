import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { DataRow } from "@/components/ui/FuturisticPanel";
import { Tractor } from "lucide-react";
import CropManagementYield from "./CropManagementYield";

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementHarvesting({ profile }: Props) {
  return (
    <div className="space-y-5">
      <FuturisticPanel
        title="Harvesting Protocol"
        subtitle="Maturity indices · Post-harvest handling"
        icon={Tractor}
        glow
      >
        <div className="space-y-4">
          <ul className="space-y-2">
            {profile.harvesting.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/25 px-4 py-3"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-[10px] font-black text-amber-400">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{item}</span>
              </li>
            ))}
          </ul>

          {profile.storage.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
                Storage & Curing
              </p>
              <ul className="space-y-2">
                {profile.storage.map((item) => (
                  <li key={item} className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-100/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </FuturisticPanel>

      <CropManagementYield profile={profile} />
    </div>
  );
}
