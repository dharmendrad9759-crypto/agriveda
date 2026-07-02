import type { CropManagementProfile } from "@/types/crop-management";
import FuturisticPanel, { DataRow } from "@/components/ui/FuturisticPanel";
import { Droplets } from "lucide-react";

interface Props {
  profile: CropManagementProfile;
}

export default function CropManagementIrrigation({ profile }: Props) {
  return (
    <FuturisticPanel
      title="Irrigation Management"
      subtitle="Critical moisture stages · Water budgeting"
      icon={Droplets}
      glow
    >
      <div className="space-y-4">
        <DataRow
          label="Irrigation Philosophy"
          value="Maintain field capacity during critical reproductive/bulking stages. Avoid waterlogging near harvest to prevent quality loss and disease."
          highlight
        />

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            Stage-wise Schedule
          </p>
          <ul className="space-y-2">
            {profile.irrigationSchedule.map((item, i) => (
              <li
                key={item}
                className="relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 to-transparent px-4 py-3"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-400 to-emerald-400" />
                <div className="pl-3">
                  <p className="text-[10px] font-bold text-cyan-400/80">Stage {i + 1}</p>
                  <p className="mt-0.5 text-sm text-slate-300">{item}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Critical Alert
          </p>
          <p className="mt-1 text-sm text-amber-100/80">
            Moisture stress during tuber initiation (potato) or panicle initiation (paddy) can reduce
            yield by 25–40%. Monitor soil moisture at 15–20 cm depth.
          </p>
        </div>
      </div>
    </FuturisticPanel>
  );
}
